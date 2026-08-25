from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, EmailStr, Field

from app.core.serialization import api_model_config


class MemberCreate(BaseModel):
    model_config = api_model_config

    membership_id: str = Field(
        min_length=3,
        max_length=50,
        examples=["AHCOF-000123"],
    )
    first_name: str = Field(
        min_length=1,
        max_length=100,
        examples=["Elder"],
    )
    last_name: str = Field(
        min_length=1,
        max_length=100,
        examples=["Mensah"],
    )
    membership_type: str = Field(
        min_length=1,
        max_length=100,
        examples=["Standard"],
    )
    email_address: EmailStr | None = Field(
        default=None,
        examples=["elder.mensah@example.com"],
    )
    phone_number: str = Field(
        min_length=10,
        max_length=20,
        examples=["0241234567"],
    )
    church_branch: str | None = Field(
        default=None,
        max_length=150,
        examples=["Kumasi Central SDA Church"],
    )
    conference: str | None = Field(
        default=None,
        max_length=150,
        examples=["Mid-Central Ghana Conference"],
    )
    gps_address: str | None = Field(
        default=None,
        max_length=255,
        examples=["Kumasi, Ashanti Region, Ghana"],
    )


class MemberResponse(BaseModel):
    model_config = api_model_config

    id: UUID
    first_name: str
    last_name: str
    membership_type: str
    email_address: EmailStr | None
    phone_number: str
    church_branch: str | None
    conference: str | None
    is_active: bool
    membership_id: str
    is_demo: bool
    created_at: datetime
    updated_at: datetime
    accounts: list[str] = Field(default_factory=list)
    gps_address: str | None


class LoginRequest(BaseModel):
    model_config = api_model_config

    phone_number: str
    password: str


class TokenResponse(BaseModel):
    model_config = api_model_config

    access_token: str
    token_type: str = "bearer"


class CurrentMemberResponse(MemberResponse):
    pass
