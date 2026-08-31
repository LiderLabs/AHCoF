# AHCoF Member API Backend

## Project Purpose

This repository contains the backend foundation for the Adventist Heritage Co-operative Fund (AHCoF) Member Mobile Application prototype.

The backend will provide a secure API layer for a future mobile application. It is designed to support members viewing and managing financial information such as savings, loans, shares, dividends, transactions, forms, notifications, and profile information.

The first version is a prototype and must use realistic but fictional data. It must not claim to process real financial transactions, perform real loan approvals, or connect to real AHCoF member records until approved integrations, business rules, security controls, and compliance requirements are in place.

## Product Vision

The backend supports the broader AHCoF vision of giving members a convenient digital channel through which they can:

```text
Save → Invest → Borrow → Repay → Track → Communicate
```

The mobile application communicates with the backend through secure APIs. It must not directly access financial or member databases.

## Current Development Stage

Current stage: Backend foundation and member module

Completed foundation capabilities:

- FastAPI backend service running locally.
- Interactive Swagger/OpenAPI documentation.
- Environment-based configuration.
- PostgreSQL 16 running through Docker Compose.
- SQLAlchemy database integration.
- Alembic migration setup.
- Database health/readiness endpoint.
- `members` database table.
- Fictional demo member seed script.
- Versioned member read endpoints.

## Current Prototype Boundaries

The following are currently not implemented:

- Authentication and password management.
- Authorization and role-based access control.
- Real member data integration.
- Savings account management.
- Loans and repayment schedules.
- Shares and dividends.
- Transaction history.
- Digital forms.
- Notifications.
- Statements.
- Mobile Money payments.
- Real financial calculations.
- Real loan approval or disbursement.
- Production deployment and production compliance controls.

## Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| API framework | FastAPI | Receives API requests and returns JSON responses |
| API documentation | OpenAPI and Swagger UI | Documents and demonstrates the API |
| Database | PostgreSQL 16 | Stores structured backend data |
| ORM | SQLAlchemy 2.0 | Maps Python models to database tables |
| Migration tool | Alembic | Versions database schema changes |
| Validation | Pydantic v2 | Validates request/response data |
| Configuration | Pydantic Settings | Loads environment-specific configuration |
| Database driver | psycopg | Connects Python/SQLAlchemy to PostgreSQL |
| Containers | Docker Compose | Runs local PostgreSQL consistently |
| Runtime server | Uvicorn | Runs the FastAPI application |

## API Base URL

Local development base URL:

```text
http://127.0.0.1:8000
```

Current documentation URL:

```text
http://127.0.0.1:8000/docs
```

Current API version prefix:

```text
/api/v1
```