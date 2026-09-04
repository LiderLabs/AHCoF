from functools import lru_cache

from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "AHCoF Member API"
    app_env: str = "development"
    debug: bool = False
    demo_mode: bool = True
    database_url: str
    redis_url: str | None = "redis://localhost:6379/0"

    jwt_secret_key: str
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 5

    otp_length: int = 6
    otp_expire_minutes: int = 5

    otp_resend_cooldown_seconds: int = 60
    otp_max_requests_per_hour: int = 5

    arkesel_api_key: str | None = None
    arkesel_sender_id: str = "AHCoF"

    resend_api_key: str | None = None
    resend_from_email: str = "onboarding@resend.dev"

    @field_validator("database_url", mode="before")
    @classmethod
    def assemble_database_url(cls, v: str) -> str:
        if isinstance(v, str):
            if v.startswith("postgres://"):
                return v.replace("postgres://", "postgresql+psycopg://", 1)
            if v.startswith("postgresql://") and not v.startswith("postgresql+"):
                return v.replace("postgresql://", "postgresql+psycopg://", 1)
        return v

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )


@lru_cache
def get_settings() -> Settings:
    return Settings()

settings = get_settings()