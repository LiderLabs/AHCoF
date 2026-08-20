 AHCoF Member Platform

Monorepo for the Adventist Heritage Co-operative Fund (AHCoF) Member Application prototype.

The project contains the mobile client, Python backend API, shared API contracts, documentation, and 
future deployment automation.

## Repository Structure

```text
AHCoF/
├── backend/        # FastAPI, PostgreSQL, SQLAlchemy, Alembic, and backend tests
├─frontend/         # Expo / React Native mobile application
├── docs/           # Shared product, architecture, and collaboration documentation
└── .github/        # GitHub Actions workflows and repository automation
```

## Current Status

### Backend

The backend foundation currently includes:

- FastAPI API with generated Swagger/OpenAPI documentation.
- PostgreSQL 16 local development database through Docker Compose.
- SQLAlchemy database integration.
- Alembic migrations.
- Health and database readiness checks.
- A versioned members API.
- Fictional prototype member data.
- Automated integration tests.

### Mobile Application

The mobile application is being developed using:

- React Native.
- Expo.
- NativeWind.
- Metro.

## Prototype Boundary

This repository currently contains a prototype foundation.

Do not add real member data, Ghana Card information, passwords, Mobile Money credentials, production 
payment keys, or live financial records to the repository or local prototype database.

All local and prototype data must remain fictional unless the organization approves a secure 
production implementation.

## Getting Started

Backend setup instructions are available in:

```text
backend/docs/development_setup.md
```

API documentation is available while the backend is running:

```text
http://127.0.0.1:8000/docs
```

## Collaboration

- Use feature branches.
- Open pull requests into the shared integration branch.
- Keep backend and frontend  changes isolated to their respective folders.
- Update documentation when behavior, architecture, API contracts, setup, or database schema 
changes.
- Do not commit `.env` files or secrets.
