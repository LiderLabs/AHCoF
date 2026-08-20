# AHCoF Backend API

FastAPI backend for the AHCoF Member Application prototype.

## Backend Documentation

Read the detailed backend documentation in:

```text
docs/
```

Key documents:

- `docs/project_overview.md`
- `docs/architecture.md`
- `docs/development_setup.md`
- `docs/naming_conventions.md`
- `docs/implementation_log.md`

## Quick Start

From the `backend/` directory:

```bash
python3 -m venv .venv
source .venv/bin/activate

python -m pip install fastapi "uvicorn[standard]" pydantic-settings
python -m pip install sqlalchemy "psycopg[binary]" alembic
python -m pip install "pydantic[email]" pytest httpx

cp .env.example .env
docker compose up -d
python -m alembic upgrade head
python -m app.scripts.seed_demo_data
python -m uvicorn app.main:app --reload
```

Open Swagger:

```text
http://127.0.0.1:8000/docs
```

Run tests:

```bash
python -m pytest
```

## Current API

```text
GET /health
GET /health/ready
GET /api/v1/members
GET /api/v1/members/{member_id}
```

All current records are fictional prototype data.
