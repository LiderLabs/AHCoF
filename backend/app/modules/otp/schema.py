# <<<<<<< HEAD
# <<<<<<< HEAD
# this one is your own merge conflict you might have not resolved yet
from app.core.serialization import api_model_config
from pydantic import BaseModel, Field

# =======
from pydantic import BaseModel, Field

# =======
# >>>>>>> 5667952 (fix: channelsSent leak)
from app.core.serialization import api_model_config
from pydantic import BaseModel, Field

# >>>>>>> ef3904a (Add channel/channelsSent/verified fields to OTP endpoints to match Data_shapes.docx)

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

# <<<<<<< HEAD
class SendOtpResponse(BaseModel):
    model_config = api_model_config

    channels_sent: list[str]
    message: str
    debug_otp_code: str | None = Field(
        default=None,
        description=(
            "The OTP code, included only when DEMO_MODE is enabled so "
            "testers aren't blocked on real SMS/email delivery. Never "
            "present when DEMO_MODE is off."
        ),
    )
# =======

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
# <<<<<<< HEAD
# >>>>>>> ef3904a (Add channel/channelsSent/verified fields to OTP endpoints to match Data_shapes.docx)
# =======
    debug_otp_code: str | None = Field(
        default=None,
        description=(
            "The OTP code, included only when DEMO_MODE is enabled so "
            "testers aren't blocked on real SMS/email delivery. Never "
            "present when DEMO_MODE is off."
        ),
    )    
# >>>>>>> 5667952 (fix: channelsSent leak)
