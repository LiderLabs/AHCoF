from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, EmailStr, Field, field_validator

from app.core.serialization import api_model_config


class MemberCreate(BaseModel):
    model_config = api_model_config

    first_name: str = Field(min_length=1, max_length=100, examples=["Elder"])
    last_name: str = Field(min_length=1, max_length=100, examples=["Mensah"])
    email_address: EmailStr | None = Field(default=None, examples=["elder.mensah@example.com"])
    phone_number: str = Field(min_length=10, max_length=20, examples=["0241234567"])
    password: str = Field(min_length=8, examples=["securepassword123"])

    @field_validator("phone_number")
    @classmethod
    def validate_phone_number(cls, v: str) -> str:
        digits = "".join(filter(str.isdigit, v))
        if len(digits) != 10:
            raise ValueError("Phone number must be exactly 10 digits")
        return digits


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

    identifier: str = Field(
        min_length=3,
        examples=["0241234567", "elder.mensah@example.com"],
        description="The member's phone number or email address.",
    )
    password: str

class TokenResponse(BaseModel):
    model_config = api_model_config

    member: MemberResponse | None = None
    access_token: str
    refresh_token: str | None = None
    token_type: str = "bearer"
    expires_in: int = 300


class CurrentMemberResponse(MemberResponse):
    pass