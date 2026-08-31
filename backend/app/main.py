import logging

from fastapi import FastAPI, HTTPException, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.api.router import api_router
from app.core.config import settings
from app.core.database import check_database_connection
from app.core.error_schemas import ErrorResponse
from app.core.exceptions import AppException

logger = logging.getLogger("ahcof")

app = FastAPI(
    title=settings.app_name,
    version="0.1.0",
    description=(
        "Backend API for the AHCoF Member Mobile Application prototype. "
        "All current member records and workflows use fictional demonstration data.\n\n"
        "## Authentication\n\n"
        "1. Call `POST /api/v1/auth/login` with `identifier` (phone number or email address) and "
        "`password` to obtain a JWT access token.\n"
        "2. Include the token in the `Authorization` header as `Bearer <token>` for all protected endpoints.\n\n"
        "## Errors\n\n"
        "All error responses share a consistent shape:\n\n"
        "```json\n"
        '{"error": "MEMBER_NOT_FOUND", "message": "Member not found", '
        '"status_code": 404, "details": null}\n'
        "```\n\n"
        "## Members\n\n"
        "Member endpoints return prototype member data. Use `GET /api/v1/members` to list all members "
        "and `GET /api/v1/members/{member_id}` to retrieve a single profile.\n\n"
        "## Dashboard\n\n"
        "The dashboard module is under active development. Endpoints will be documented here once stabilized."
    ),
    contact={
        "name": "AHCoF Backend Team",
    },
    license_info={
        "name": "Proprietary Prototype",
    },
    openapi_tags=[
        {
            "name": "Authentication",
            "description": (
                "Endpoints for member authentication:\n\n"
                "- `POST /api/v1/auth/login`: Obtain a JWT access token.\n"
                "- `GET /api/v1/auth/me`: Get the current authenticated member."
            ),
        },
        {
            "name": "Members",
            "description": (
                "Member-related operations:\n\n"
                "- `GET /api/v1/members`: List all prototype members.\n"
                "- `GET /api/v1/members/{member_id}`: Retrieve a single member profile."
            ),
        },
        {
            "name": "Dashboard",
            "description": "Dashboard and analytics endpoints (in development).",
        },
        {
            "name": "Health",
            "description": "Health and readiness checks.",
        },
    ],
)


# ---------------------------------------------------------------------------
# Error handling
#
# Every error response returned by this API — whether it comes from an
# explicit AppException, a FastAPI/Starlette HTTPException, a request
# validation failure, or an unhandled exception — is normalized to the same
# ErrorResponse shape: {error, message, status_code, details}.
#
# This matches PRD section 15 (Error Handling): messages shown to members
# must be understandable and must never expose internal/technical detail.
# ---------------------------------------------------------------------------


@app.exception_handler(AppException)
def app_exception_handler(request: Request, exc: AppException) -> JSONResponse:
    return JSONResponse(
        status_code=exc.status_code,
        content=ErrorResponse(
            error=exc.error_code,
            message=exc.message,
            status_code=exc.status_code,
            details=exc.details or None,
        ).model_dump(),
    )


@app.exception_handler(RequestValidationError)
def validation_exception_handler(
    request: Request, exc: RequestValidationError
) -> JSONResponse:
    # exc.errors() can contain non-JSON-serializable values (e.g. bytes),
    # so we only surface the parts that are safe and useful to a client:
    # where the bad field was and what was wrong with it.
    field_errors = [
        {
            "field": ".".join(str(part) for part in error["loc"] if part != "body"),
            "issue": error["msg"],
        }
        for error in exc.errors()
    ]

    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content=ErrorResponse(
            error="VALIDATION_ERROR",
            message="Your request could not be processed. Please check the submitted data.",
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            details={"fields": field_errors},
        ).model_dump(),
    )


@app.exception_handler(StarletteHTTPException)
def http_exception_handler(
    request: Request, exc: StarletteHTTPException
) -> JSONResponse:
    # Covers plain `raise HTTPException(...)` calls (e.g. auth 401/403) and
    # framework-raised HTTPExceptions (e.g. 404 for an unknown route),
    # normalizing them into the same error shape as AppException.
    error_codes = {
        status.HTTP_401_UNAUTHORIZED: "UNAUTHORIZED",
        status.HTTP_403_FORBIDDEN: "FORBIDDEN",
        status.HTTP_404_NOT_FOUND: "NOT_FOUND",
        status.HTTP_405_METHOD_NOT_ALLOWED: "METHOD_NOT_ALLOWED",
        status.HTTP_503_SERVICE_UNAVAILABLE: "SERVICE_UNAVAILABLE",
    }

    return JSONResponse(
        status_code=exc.status_code,
        headers=getattr(exc, "headers", None),
        content=ErrorResponse(
            error=error_codes.get(exc.status_code, "HTTP_ERROR"),
            message=str(exc.detail),
            status_code=exc.status_code,
        ).model_dump(),
    )


@app.exception_handler(Exception)
def unhandled_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    # Last resort for anything we didn't anticipate. Log the real error
    # server-side for debugging, but never leak internals (stack traces,
    # exception messages, library details) to the client.
    logger.exception("Unhandled exception on %s %s", request.method, request.url.path)

    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content=ErrorResponse(
            error="INTERNAL_SERVER_ERROR",
            message="Something went wrong on our end. Please try again shortly.",
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        ).model_dump(),
    )


# ---------------------------------------------------------------------------
# Health
# ---------------------------------------------------------------------------


@app.get(
    "/health",
    tags=["Health"],
    summary="Check API service status",
    description=(
        "Confirms that the FastAPI application is running. "
        "This endpoint does not check database connectivity."
    ),
)
def health_check() -> dict[str, str | bool]:
    return {
        "status": "ok",
        "message": "AHCoF backend is running",
        "environment": settings.app_env,
        "demo_mode": settings.demo_mode,
    }


@app.get(
    "/health/ready",
    tags=["Health"],
    summary="Check API and database readiness",
    description=(
        "Confirms that the API is running and can connect to PostgreSQL. "
        "Returns HTTP 503 when the database is unavailable."
    ),
    responses={
        503: {
            "description": "Database is unavailable.",
        }
    },
)
def readiness_check() -> dict[str, str]:
    if not check_database_connection():
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database is unavailable.",
        )

    return {
        "status": "ok",
        "database": "connected",
    }


app.include_router(api_router, prefix="/api/v1")
