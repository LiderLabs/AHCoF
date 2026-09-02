from typing import Any, Optional

from fastapi import status


class AppException(Exception):
    """Base application exception."""

    error_code: str = "APP_ERROR"
    status_code: int = status.HTTP_500_INTERNAL_SERVER_ERROR
    message: str = "An unexpected error occurred"

    def __init__(
        self,
        message: Optional[str] = None,
        error_code: Optional[str] = None,
        status_code: Optional[int] = None,
        details: Optional[dict[str, Any]] = None,
    ) -> None:
        self.message = message or self.message
        self.error_code = error_code or self.error_code
        self.status_code = status_code or self.status_code
        self.details = details or {}
        super().__init__(self.message)


class MemberNotFoundError(AppException):
    error_code = "MEMBER_NOT_FOUND"
    status_code = status.HTTP_404_NOT_FOUND
    message = "Member not found"


class UserAlreadyExistsError(AppException):
    error_code = "USER_ALREADY_EXISTS"
    status_code = status.HTTP_409_CONFLICT
    message = "A user with this email or phone already exists"


class InvalidCredentialsError(AppException):
    error_code = "INVALID_CREDENTIALS"
    status_code = status.HTTP_401_UNAUTHORIZED
    message = "Invalid phone number, email address, or password"


class AccountInactiveError(AppException):
    error_code = "ACCOUNT_INACTIVE"
    status_code = status.HTTP_403_FORBIDDEN
    message = "Member account is inactive"


class InsufficientBalanceError(AppException):
    error_code = "INSUFFICIENT_BALANCE"
    status_code = status.HTTP_400_BAD_REQUEST
    message = "Insufficient balance for this operation"


class InvalidOtpError(AppException):
    error_code = "INVALID_OTP"
    status_code = status.HTTP_400_BAD_REQUEST
    message = "The OTP code is invalid"


class OtpExpiredError(AppException):
    error_code = "OTP_EXPIRED"
    status_code = status.HTTP_400_BAD_REQUEST
    message = "The OTP code has expired. Request a new one."