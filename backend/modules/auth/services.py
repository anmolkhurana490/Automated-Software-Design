from datetime import datetime, timezone
from typing import Any, Optional
from uuid import uuid4
import os

from google.auth.transport.requests import Request as GoogleRequest
from google.oauth2 import id_token as google_id_token

from config.errors import BadRequestException, ConflictException, UnauthorizedException
from modules.auth.dao import AuthDao
from modules.auth.models import AuthUser, AuthUserCreate, AuthUserUpdate
from modules.auth.types import GoogleOAuthRequest, LoginRequest, SignupRequest, UpdateUserRequest

from utils.jwt_utils import create_access_token, decode_access_token
from utils.password_utils import hash_password, verify_password

GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID") or "your-google-client-id"

class AuthService:
	def __init__(self):
		self.auth_dao = AuthDao()
	
	async def get_current_user(self, token: str):
		payload = decode_access_token(token)
		if not payload:
			raise UnauthorizedException("Invalid or expired token")

		user_id = payload.get("sub")
		if not user_id:
			raise UnauthorizedException("Token does not contain a user id")

		user_data = await self.auth_dao.get_user_by_id(user_id)

		if not user_data:
			raise UnauthorizedException("User not found")
		
		return user_data
	
	async def update_user(self, user: AuthUser, data: UpdateUserRequest):
		if user.auth_provider != "credential" and data.password:
			raise BadRequestException("Cannot set password for non-credential user")
		
		data_dict = data.model_dump(exclude_unset=True)
		
		if data.password:
			data_dict["password_hash"] = hash_password(data.password)
			del data_dict["password"]

		updates = AuthUserUpdate(**data_dict).model_dump(exclude_unset=True)
		updated_user = await self.auth_dao.update_user(user.id, updates)
		
		if not updated_user:
			raise Exception("Failed to update user")
		
		return updated_user.to_public()

	async def signup(self, data: SignupRequest):
		email = data.email.strip().lower()
		existing_user = await self.auth_dao.get_user_by_email(email)

		if existing_user:
			raise ConflictException("A user with this email already exists")

		user_document = AuthUserCreate(
			name=data.name.strip(),
      email=email,
      password_hash=hash_password(data.password),
      auth_provider="credential"
    ).model_dump()

		created_user = await self.auth_dao.create_user(user_document)
		
		if not created_user:
			raise Exception("Failed to create user")
		
		return created_user.to_public()

	async def login(self, data: LoginRequest):
		email = data.email.strip().lower()
		user_data = await self.auth_dao.get_user_by_email(email)
		
		if not user_data:
			raise UnauthorizedException("Invalid email or password")

		if not user_data.password_hash or not verify_password(data.password, user_data.password_hash):
			raise UnauthorizedException("Invalid email or password")

		token = create_access_token({
      "sub": user_data.id,
      "name": user_data.name,
      "email": user_data.email,
      "avatar": user_data.avatar,
    })
		
		return user_data.to_public(), token

	async def google_oauth(self, data: GoogleOAuthRequest):
		google_profile = self.verify_google_id_token(data.id_token)
		if not google_profile:
			raise UnauthorizedException("Invalid Google ID token")
		
		provider_user_id = google_profile.get("sub", "")
		email = google_profile.get("email", "").strip().lower()
		name = google_profile.get("name", "").strip()
		avatar = google_profile.get("picture")

		if not email or not name:
			raise BadRequestException("Google account profile is incomplete")
		
		existing_user_data = await self.auth_dao.get_user_by_provider_id(provider_user_id, "google")
		
		if existing_user_data:
			if existing_user_data.auth_provider != "google":
				raise ConflictException("A user with this email already exists with a different authentication method")
			
			user_data = await self.auth_dao.update_user(
				existing_user_data.id,
				{
					"name": name,
					"avatar": avatar or existing_user_data.avatar
				},
			)
			
			if not user_data:
				raise Exception("Failed to update user")
			
		else:
			user_document = AuthUserCreate(
        name=name,
        email=email,
        avatar=avatar,
        auth_provider="google",
        provider_user_id=provider_user_id,
      ).model_dump()
			
			user_data = await self.auth_dao.create_user(user_document)
			
			if not user_data:
				raise Exception("Failed to create user")
			
		token = create_access_token({
      "sub": user_data.id,
      "name": user_data.name,
      "email": user_data.email,
      "avatar": user_data.avatar
    })
		
		return user_data.to_public(), token
	

	def verify_google_id_token(self, id_token: str):
		try:
			google_profile = google_id_token.verify_oauth2_token(
				id_token,
				GoogleRequest(),
				GOOGLE_CLIENT_ID,
			)
			return google_profile
		except Exception as e:
			print(f"Google ID token verification failed: {str(e)}")
			return None