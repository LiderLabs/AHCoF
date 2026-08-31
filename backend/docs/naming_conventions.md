# Naming Conventions

## Purpose

This document defines the naming standards for the AHCoF Member API backend.

Consistent naming improves readability, makes collaboration easier, reduces onboarding time, and prevents avoidable confusion across backend, frontend, DevOps, and future contributors.

## General Rule

The backend uses Python naming conventions.

Use clear English names that describe purpose. Avoid abbreviations unless they are universally understood in the project domain, such as `api`, `id`, `url`, `sms`, or `otp`.

## Python Code

| Item | Convention | Examples |
|---|---|---|
| Packages and directories | lowercase or snake_case | `members`, `loan_applications`, `core` |
| Python files/modules | snake_case | `seed_demo_data.py`, `database.py`, `member_service.py` |
| Functions | snake_case | `get_member_by_id()`, `check_database_connection()` |
| Methods | snake_case | `create_member()`, `update_profile()` |
| Variables | snake_case | `member_id`, `database_url`, `demo_member` |
| Function parameters | snake_case | `member_id`, `requested_amount` |
| Classes | PascalCase | `Member`, `MemberResponse`, `LoanApplication` |
| Exceptions | PascalCase ending in `Error` | `MemberNotFoundError`, `InvalidCredentialsError` |
| Constants | UPPER_SNAKE_CASE | `DEMO_MEMBER`, `MAX_LOGIN_ATTEMPTS` |
| Private Python names | leading underscore | `_create_reference_number()` |

## API Naming

| Item | Convention | Examples |
|---|---|---|
| API versions | lowercase path segments | `/api/v1` |
| Resource paths | lowercase plural nouns | `/members`, `/loan_applications`, `/transactions` |
| Path parameters | snake_case | `/members/{member_id}` |
| Query parameters | snake_case | `?start_date=...&transaction_type=...` |
| JSON request/response fields | snake_case | `membership_id`, `phone_number`, `is_demo` |
| HTTP headers | standard header names | `Authorization`, `Content-Type`, `X-Request-ID` |

## Database Naming

| Item | Convention | Examples |
|---|---|---|
| Table names | lowercase plural snake_case | `members`, `loan_applications`, `repayment_schedules` |
| Column names | lowercase snake_case | `membership_id`, `created_at`, `is_demo` |
| Primary keys | `id` | `id` |
| Foreign keys | referenced singular name plus `_id` | `member_id`, `loan_id` |
| Indexes | database-generated or descriptive snake_case | `ix_members_membership_id` |
| Boolean fields | start with `is_`, `has_`, or `can_` | `is_demo`, `is_active`, `has_verified_email` |
| Timestamps | descriptive `_at` suffix | `created_at`, `updated_at`, `submitted_at` |

## Git Naming

| Item | Convention | Examples |
|---|---|---|
| Branches | lowercase kebab-case | `feat/member-api`, `fix/database-connection` |
| Commit messages | Conventional Commit style | `feat: add member read endpoints` |
| Feature commits | `feat:` | `feat: add demo member seed script` |
| Fix commits | `fix:` | `fix: use virtual environment uvicorn` |
| Documentation commits | `docs:` | `docs: add backend setup guide` |
| Chores | `chore:` | `chore: initialize project configuration` |

## Examples

Correct:

```python
class MemberResponse(BaseModel):
    membership_id: str
    phone_number: str


def get_member_by_id(member_id: UUID) -> Member | None:
    ...
```

Incorrect:

```python
class member_response:
    MembershipID: str
    PhoneNumber: str


def GetMemberByID(MemberID):
    ...
```