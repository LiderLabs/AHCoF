# Architecture

## Current Architecture Style

The AHCoF Member API uses a modular monolith architecture.

A modular monolith is one backend application that is organized into independent business modules. It is intentionally simpler than microservices during the prototype stage, while preserving clean boundaries that can support future growth.

Current modules include:

```text
auth
members
dashboard
savings
loans
shares
transactions
notifications
forms
statements
payments
audit
```

Only the `members` module is currently implemented.

## System Diagram

```text
Swagger UI / Future Mobile Application
                |
                | HTTP + JSON
                v
          FastAPI Application
                |
                | SQLAlchemy + psycopg
                v
          PostgreSQL Database
                |
                v
      Docker persistent volume
```

## Request Flow

```text
Client request
    ↓
FastAPI route
    ↓
Database session dependency
    ↓
Module service
    ↓
SQLAlchemy query
    ↓
PostgreSQL
    ↓
Pydantic response schema
    ↓
JSON response
```

Example member request:

```text
GET /api/v1/members/{member_id}
    ↓
members/router.py
    ↓
members/service.py
    ↓
members/members.py
    ↓
PostgreSQL members table
    ↓
MemberResponse schema
    ↓
JSON response
```

## Application Structure

```text
app/
├── main.py
├── api/
│   └── router.py
├── core/
│   ├── config.py
│   └── database.py
├── common/
├── modules/
│   └── members/
│       ├── members.py
│       ├── schema.py
│       ├── service.py
│       └── router.py
└── scripts/
    └── seed_demo_data.py
```

## Core Components

### FastAPI

FastAPI is the API application layer. It defines routes, validates path/query data, applies dependency injection, generates OpenAPI documentation, and returns HTTP responses.

### PostgreSQL

PostgreSQL is the persistent relational database and future financial system-of-record foundation.

The mobile application will never directly access PostgreSQL. All access must go through the FastAPI backend and its authorization rules.

### SQLAlchemy

SQLAlchemy is the Python database toolkit and ORM. It maps Python classes such as `Member` to PostgreSQL tables such as `members`.

### Alembic

Alembic manages database migrations.

A migration is a versioned database-change script. It allows every developer and environment to apply the same table/column/index changes safely and in order.

### Pydantic

Pydantic validates API data and defines response shapes. It helps ensure that only explicitly approved fields are returned to API clients.

### Docker Compose

Docker Compose runs PostgreSQL locally in a repeatable containerized environment. The database uses a persistent Docker volume so data survives normal container restarts.

## Scalability Direction

The project begins as a modular monolith because it is faster to build, easier to test, and simpler to operate during a prototype.

The intended growth path is:

1. Keep API requests stateless.
2. Run multiple FastAPI instances behind a load balancer when demand requires it.
3. Use efficient queries and database indexes.
4. Add connection pooling and performance monitoring.
5. Add Redis only for measured caching, rate limiting, token revocation, or temporary state.
6. Add background workers for slow tasks such as notifications, statement generation, scheduled reminders, and reconciliation.
7. Use managed PostgreSQL, backups, high availability, and read scaling when production usage requires them.
8. Extract a module into a separate service only when operational evidence justifies it.

## Security Direction

Security is designed in layers:

- No direct mobile-client access to PostgreSQL.
- Configuration and secrets stay outside source code.
- Prototype data is marked with `is_demo=true`.
- Authentication and authorization will be added before private member data is exposed in a real environment.
- Database roles will follow least-privilege access.
- Production traffic will use TLS.
- Sensitive data will be minimized, protected, and excluded from logs.
- Significant actions will later create audit events.
- Rate limiting and token controls will be introduced with authentication.