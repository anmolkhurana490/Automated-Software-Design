from fastapi import APIRouter, Depends
from modules.auth.dependencies import get_current_user
from modules.auth.models import AuthUser
from modules.auth.types import LoginRequest, SignupRequest, GoogleOAuthRequest, UpdateUserRequest
from modules.auth.services import AuthService

router = APIRouter()
auth_service = AuthService()

@router.get("/me")
async def get_me(current_user: AuthUser = Depends(get_current_user)):
	return {"user": current_user.to_public()}

@router.patch("/me")
async def update_me(
	data: UpdateUserRequest,
	current_user: AuthUser = Depends(get_current_user)
):
	updated_user = await auth_service.update_user(current_user, data)
	return {"user": updated_user}

@router.post("/login")
async def login(data: LoginRequest):
	user_data, token = await auth_service.login(data)
	return {"user": user_data, "access_token": token}

@router.post("/signup")
async def signup(data: SignupRequest):
	user_data = await auth_service.signup(data)
	return {"user": user_data}

@router.post("/google")
async def google_oauth(data: GoogleOAuthRequest):
	user_data, token = await auth_service.google_oauth(data)
	return {"user": user_data, "access_token": token}