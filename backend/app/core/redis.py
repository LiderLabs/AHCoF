import logging
import threading
import time
from typing import Any

import redis

from app.core.config import settings

logger = logging.getLogger("ahcof.redis")


class InMemoryRedis:
    """Thread-safe in-memory store that provides Redis operations required
    by rate-limiting and temporary OTP storage when no Redis server is available
    (e.g. Render free tier, local development without Docker)."""

    def __init__(self) -> None:
        self._store: dict[str, Any] = {}
        self._expires: dict[str, float] = {}
        self._lock = threading.Lock()

    def _cleanup_expired(self, key: str) -> None:
        if key in self._expires and time.time() >= self._expires[key]:
            self._store.pop(key, None)
            self._expires.pop(key, None)

    def exists(self, key: str) -> bool:
        with self._lock:
            self._cleanup_expired(key)
            return key in self._store

    def ttl(self, key: str) -> int:
        with self._lock:
            self._cleanup_expired(key)
            if key not in self._store:
                return -2
            if key not in self._expires:
                return -1
            remaining = int(self._expires[key] - time.time())
            return max(0, remaining)

    def incr(self, key: str, amount: int = 1) -> int:
        with self._lock:
            self._cleanup_expired(key)
            try:
                current = int(self._store.get(key, 0))
            except (ValueError, TypeError):
                current = 0
            val = current + amount
            self._store[key] = str(val)
            return val

    def expire(self, key: str, seconds: int) -> bool:
        with self._lock:
            self._cleanup_expired(key)
            if key not in self._store:
                return False
            self._expires[key] = time.time() + max(0, seconds)
            return True

    def set(
        self,
        key: str,
        value: Any,
        ex: int | None = None,
        px: int | None = None,
        nx: bool = False,
        xx: bool = False,
    ) -> bool:
        with self._lock:
            self._cleanup_expired(key)
            if nx and key in self._store:
                return False
            if xx and key not in self._store:
                return False

            self._store[key] = str(value)
            if ex is not None:
                self._expires[key] = time.time() + max(0, ex)
            elif px is not None:
                self._expires[key] = time.time() + max(0, px / 1000.0)
            elif key in self._expires:
                del self._expires[key]
            return True

    def get(self, key: str) -> str | None:
        with self._lock:
            self._cleanup_expired(key)
            return self._store.get(key)

    def delete(self, *keys: str) -> int:
        with self._lock:
            deleted = 0
            for key in keys:
                self._cleanup_expired(key)
                if key in self._store:
                    del self._store[key]
                    self._expires.pop(key, None)
                    deleted += 1
            return deleted

    def flushdb(self) -> None:
        with self._lock:
            self._store.clear()
            self._expires.clear()

    def ping(self) -> bool:
        return True


class ResilientRedis:
    """Wraps redis.Redis with graceful fallback to InMemoryRedis when Redis
    is unreachable or not configured. This prevents 500 errors on hosting
    environments like Render's free tier that restrict additional databases."""

    def __init__(self, url: str | None) -> None:
        self.url = url
        self._real_client: redis.Redis | None = None
        self._fallback = InMemoryRedis()
        self._has_logged_fallback = False

        if url and url.strip():
            try:
                self._real_client = redis.Redis.from_url(
                    url,
                    decode_responses=True,
                    socket_connect_timeout=1.5,
                    socket_timeout=1.5,
                )
            except Exception as err:
                logger.warning("Failed to initialize Redis client (%s). Using in-memory fallback.", err)
                self._real_client = None

    def _delegate(self, method_name: str, *args: Any, **kwargs: Any) -> Any:
        if self._real_client is not None:
            try:
                method = getattr(self._real_client, method_name)
                return method(*args, **kwargs)
            except (redis.exceptions.ConnectionError, redis.exceptions.TimeoutError, redis.exceptions.RedisError) as exc:
                if not self._has_logged_fallback:
                    logger.warning(
                        "Redis server at %s unavailable (%s). Falling back to in-memory store.",
                        self.url,
                        exc,
                    )
                    self._has_logged_fallback = True

        fallback_method = getattr(self._fallback, method_name)
        return fallback_method(*args, **kwargs)

    def exists(self, *names: Any) -> Any:
        return self._delegate("exists", *names)

    def ttl(self, name: Any) -> Any:
        return self._delegate("ttl", name)

    def incr(self, name: Any, amount: int = 1) -> Any:
        return self._delegate("incr", name, amount)

    def expire(self, name: Any, time: Any) -> Any:
        return self._delegate("expire", name, time)

    def set(self, name: Any, value: Any, **kwargs: Any) -> Any:
        return self._delegate("set", name, value, **kwargs)

    def get(self, name: Any) -> Any:
        return self._delegate("get", name)

    def delete(self, *names: Any) -> Any:
        return self._delegate("delete", *names)

    def flushdb(self) -> Any:
        return self._delegate("flushdb")

    def ping(self) -> Any:
        return self._delegate("ping")


redis_client: ResilientRedis = ResilientRedis(settings.redis_url)


def get_redis() -> ResilientRedis:
    return redis_client