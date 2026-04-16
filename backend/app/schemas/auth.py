from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from uuid import UUID

class Token(BaseModel):
    access_token: str
    token_type: str
    user_id: Optional[int] = None

class TokenData(BaseModel):
    user_id: Optional[int] = None

class LoginRequest(BaseModel):
    email: str
    password: str

class TwoFactorVerify(BaseModel):
    email: str
    code: str

class TwoFactorSetupResponse(BaseModel):
    secret: str
    qr_code: str
    instructions: str

class PasswordResetRequest(BaseModel):
    code_2fa: str
    new_password: str

class SecurityValidation(BaseModel):
    primary_email_otp: Optional[str] = None
    backup_email_otp: Optional[str] = None
    google_2fa_code: Optional[str] = None
    payment_password: Optional[str] = None
    login_password: Optional[str] = None

class EmailRebindRequest(BaseModel):
    validation: SecurityValidation
    new_email: EmailStr
    new_email_otp: str

class PasswordChangeRequest(BaseModel):
    validation: SecurityValidation
    new_password: str
