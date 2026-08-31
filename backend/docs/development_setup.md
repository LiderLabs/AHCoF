# Development Setup

## Prerequisites

Install the following before running the project:

- Python 3.13 or the project-approved Python version.
- Docker Desktop.
- Git.
- A code editor such as Visual Studio Code.

## Create and Activate the Virtual Environment

From the repository root:

```bash
python3 -m venv .venv
source .venv/bin/activate

The terminal should show:

```text
(.venv)
```

## Install Dependencies

Install the project's current dependencies:

```bash
python -m pip install fastapi "uvicorn[standard]" pydantic-settings
python -m pip install sqlalchemy "psycopg[binary]" alembic
python -m pip install "pydantic[email]"
```

For a fresh installation after the project packaging configuration is finalized, contributors should be able to use:

```bash
python -m pip install -e .
```

## Configure Environment Variables

Create a local environment file from the example:

```bash
cp .env.example .env
```

Update `.env` with local-only values.

Do not commit `.env`.

Current development configuration includes:

```env
APP_NAME=AHCoF Member API
APP_ENV=development
DEBUG=true
DEMO_MODE=true

POSTGRES_DB=ahcof
POSTGRES_USER=ahcof_user
POSTGRES_PASSWORD=ahcof_local_dev_password
POSTGRES_HOST=localhost
POSTGRES_PORT=5432

DATABASE_URL=postgresql+psycopg://ahcof_user:ahcof_local_dev_password@localhost:5432/ahcof
```

## Start PostgreSQL

Start PostgreSQL in Docker:

```bash
docker compose up -d

Check its status:

```bash
docker compose ps

Expected database status:

```text
healthy
```

To open PostgreSQL inside the container:

```bash
docker compose exec db psql -U ahcof_user -d ahcof

To exit PostgreSQL:

```sql
\q

Do not use `docker compose down -v` unless you intentionally want to delete the local database volume and all local data.

## Run Database Migrations

Apply all migrations:

```bash
python -m alembic upgrade head

Check the currently applied migration:

```bash
python -m alembic current

Create a migration after modifying SQLAlchemy models:

```bash
python -m alembic revision --autogenerate -m "describe schema change"

Always review generated migrations before applying them.

## Seed Fictional Demo Data

Create the current fictional demo member:

bash
python -m app.scripts.seed_demo_data

The script is idempotent. It can run repeatedly without creating duplicate Elder Mensah records.

## Start the API

Run the FastAPI application:

*bash
python -m uvicorn app.main:app --reload

Use `python -m uvicorn` rather than a globally installed `uvicorn` command. This ensures Uvicorn uses the project’s active virtual environment and its installed dependencies.

## Verify the API

Open:

http://127.0.0.1:8000/health
http://127.0.0.1:8000/health/ready
http://127.0.0.1:8000/docs

## Recommended Two-Terminal Workflow

Terminal A runs the API:

*bash
source .venv/bin/activate
python -m uvicorn app.main:app --reload

Terminal B runs development commands:

*bash
source .venv/bin/activate
docker compose ps
python -m alembic current
python -m app.scripts.seed_demo_data
git status