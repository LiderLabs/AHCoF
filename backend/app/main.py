from fastapi import FastAPI, HTTPException, status

from app.api.router import api_router
from app.core.config import settings
from app.core.database import check_database_connection


app = FastAPI(
    title=settings.app_name,
    version="0.1.0",
    description=(
        "Backend API for the AHCoF Member Mobile Application prototype. "
        "All current member records and workflows use fictional demonstration data."
    ),
    contact={
        "name": "AHCoF Backend Team",
    },
    license_info={
        "name": "Proprietary Prototype",
    },
)


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