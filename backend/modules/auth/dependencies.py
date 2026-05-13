from fastapi import Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from config.errors import UnauthorizedException
from modules.auth.models import AuthUser
from modules.auth.services import AuthService

security = HTTPBearer(auto_error=False)
auth_service = AuthService()

async def get_current_user(
  # to extract token from Authorization header
  credentials: HTTPAuthorizationCredentials | None = Depends(security),
) -> AuthUser:
  if not credentials or not credentials.credentials:
    raise UnauthorizedException("Authentication token is required")

  return await auth_service.get_current_user(credentials.credentials)

def get_current_user_id(current_user: AuthUser = Depends(get_current_user)) -> str:
  return current_user.id