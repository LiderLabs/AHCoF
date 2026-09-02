from pydantic import BaseModel, Field

from app.core.serialization import api_model_config


class VerifySignupOtpRequest(BaseModel):
    model_config = api_model_config

    channel: str | None = Field(
        default=None,
        examples=["phone", "email"],
        description=(
            "Which channel the member read the code from. Informational only — "
            "the same code is valid regardless of which channel it arrived on, "
            "so this does not affect verification. Echoed back in the response."
        ),
    )
    identifier: str = Field(
        min_length=3,
        examples=["0241234567", "elder.mensah@example.com"],
        description="The member's phone number or email address.",
    )
    code: str = Field(min_length=6, max_length=6, examples=["483920"])


class ForgotPasswordRequest(BaseModel):
    model_config = api_model_config

    identifier: str = Field(
        min_length=3,
        examples=["0241234567", "elder.mensah@example.com"],
        description="The member's phone number or email address.",
    )


class ResetPasswordRequest(BaseModel):
    model_config = api_model_config

    identifier: str = Field(
        min_length=3,
        examples=["0241234567", "elder.mensah@example.com"],
    )
    code: str = Field(min_length=6, max_length=6, examples=["483920"])
    new_password: str = Field(min_length=8, examples=["newsecurepassword123"])


class MessageResponse(BaseModel):
    model_config = api_model_config

    message: str


class VerifyOtpResponse(BaseModel):
    model_config = api_model_config

    channel: str | None = Field(
        default=None,
        examples=["phone", "email"],
        description="Echoes back the channel field from the request, if one was sent.",
    )
    verified: bool
    message: str


class SendOtpResponse(BaseModel):
    model_config = api_model_config

    channels_sent: list[str] = Field(
        examples=[["phone"], ["phone", "email"]],
        description=(
            "Which channels the code was actually sent to. Always includes "
            "'phone' — every member has one on file. Includes 'email' only if "
            "the member has one registered."
        ),
    )
    message: str