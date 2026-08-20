from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class MemberCreate(BaseModel):
    membership_id: str = Field(
        min_length=3,
        max_length=50,
        examples=["AHCOF-000123"],
    )
    first_name: str = Field(min_length=1, max_length=100, examples=["Elder"])
    last_name: str = Field(min_length=1, max_length=100, examples=["Mensah"])
    phone_number: str = Field(
        min_length=10,
        max_length=20,
        examples=["0241234567"],
    )
    email: EmailStr | None = Field(
        default=None,
        examples=["elder.mensah@example.com"],
    )
    church: str | None = Field(
        default=None,
        max_length=150,
        examples=["Kumasi Central SDA Church"],
    )
    conference: str | None = Field(
        default=None,
        max_length=150,
        examples=["Mid-Central Ghana Conference"],
    )


class MemberResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    membership_id: str
    first_name: str
    last_name: str
    phone_number: str
    email: EmailStr | None
    church: str | None
    conference: str | None
    membership_status: str
    is_demo: bool
    created_at: datetime
    updated_at: datetime
