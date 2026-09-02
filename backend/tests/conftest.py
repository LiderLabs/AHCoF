"""
Pytest configuration for the backend test suite.

Test isolation
--------------
Importing `app.core.database` binds a SQLAlchemy engine to whatever
`DATABASE_URL` is configured — normally your local dev database. Running
the integration tests directly against that database is what caused the
order-dependent failures we saw locally: registrations from one run left
rows behind for the next run to collide with, and nothing seeded the demo
member before the suite that assumes it exists ran.

This file switches the test process onto a dedicated `<name>_test`
database *before* anything under `app/` gets imported, then, once per
test:

  1. truncates every table, so no test can ever see a row left behind by
     a previous test or a previous run, and
  2. reseeds the demo member, so tests never depend on you having run
     `seed_demo_data` by hand first.

Your real dev database is never touched by the test suite.

Nothing extra is required in CI: the ephemeral CI Postgres container
starts empty regardless, and `TEST_DATABASE_URL` isn't set there, so this
just creates `ahcof_test` inside that same throwaway container.
"""

from __future__ import annotations

import os
import re
from pathlib import Path

# ---------------------------------------------------------------------------
# Point the app at a test database BEFORE importing anything from `app`.
#
# app/core/config.py reads DATABASE_URL the first time it's imported, and
# app/core/database.py binds a SQLAlchemy engine to that URL at import time
# too. Both need to see the test URL on that first import, so this block
# has to run before any `from app...` import below.
# ---------------------------------------------------------------------------


def _resolve_test_database_url() -> str:
    explicit = os.environ.get("TEST_DATABASE_URL")
    if explicit:
        return explicit

    base_url = os.environ.get("DATABASE_URL")
    if not base_url:
        # Shell doesn't have DATABASE_URL exported — read .env directly.
        # (We can't rely on app.core.config/pydantic-settings for this: that
        # module can't be imported yet, since it would bind to the wrong
        # database before we get a chance to override it.)
        env_path = Path(__file__).resolve().parent.parent / ".env"
        if env_path.exists():
            for line in env_path.read_text().splitlines():
                if line.strip().startswith("DATABASE_URL="):
                    base_url = line.split("=", 1)[1].strip()
                    break

    if not base_url:
        raise RuntimeError(
            "Could not determine a database URL for tests. Set "
            "TEST_DATABASE_URL (or DATABASE_URL) before running pytest."
        )

    # postgresql+psycopg://user:pass@localhost:5432/ahcof
    #   -> postgresql+psycopg://user:pass@localhost:5432/ahcof_test
    match = re.match(r"^(?P<prefix>.+/)(?P<dbname>[^/?]+)(?P<suffix>\?.*)?$", base_url)
    if not match:
        raise RuntimeError(f"Could not parse a database name out of {base_url!r}")

    return f"{match['prefix']}{match['dbname']}_test{match['suffix'] or ''}"


_TEST_DATABASE_URL = _resolve_test_database_url()
os.environ["DATABASE_URL"] = _TEST_DATABASE_URL

import pytest
from app.core.database import Base, engine
from app.modules.members.model import Member
from app.modules.otp.model import OtpCode  # noqa: F401  (populates Base.metadata)
from app.scripts.seed_demo_data import seed_demo_member
from sqlalchemy import create_engine, text
from sqlalchemy.engine.url import make_url

assert Member  # keep the import from being flagged as unused


def _create_test_database_if_missing(test_url: str) -> None:
    """Creates the test database if it doesn't exist yet.

    CREATE DATABASE can't run inside a transaction, so this connects to the
    server's default `postgres` maintenance database in autocommit mode
    rather than to the (possibly not-yet-existing) test database itself.
    """
    url = make_url(test_url)
    admin_engine = create_engine(
        url.set(database="postgres"), isolation_level="AUTOCOMMIT"
    )
    try:
        with admin_engine.connect() as conn:
            exists = conn.execute(
                text("SELECT 1 FROM pg_database WHERE datname = :name"),
                {"name": url.database},
            ).first()
            if not exists:
                conn.execute(text(f'CREATE DATABASE "{url.database}"'))
    finally:
        admin_engine.dispose()


@pytest.fixture(scope="session", autouse=True)
def _test_database():
    """Creates the test database (if needed) and builds a fresh schema in
    it once per test session, straight from the SQLAlchemy models.

    This intentionally bypasses Alembic migration history — the tests only
    need the current schema shape, not migration correctness, and running
    real migrations programmatically here would add a lot of ceremony for
    no benefit to this suite.
    """
    _create_test_database_if_missing(_TEST_DATABASE_URL)

    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

    yield

    engine.dispose()


@pytest.fixture(autouse=True)
def _clean_database():
    """Truncates every table and reseeds the demo member before each test."""
    with engine.begin() as conn:
        for table in reversed(Base.metadata.sorted_tables):
            conn.execute(table.delete())

    seed_demo_member()

    yield