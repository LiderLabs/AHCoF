from fastapi import APIRouter

from app.modules.members.router import router as members_router


api_router = APIRouter()
api_router.include_router(members_router)