from pydantic import BaseModel
from typing import Optional
from bson import ObjectId

class UpdateUserRequest(BaseModel):
	name: Optional[str] = None
	avatar: Optional[str] = None
	password: Optional[str] = None

class LoginRequest(BaseModel):
	email: str
	password: str

class SignupRequest(BaseModel):
	name: str
	email: str
	password: str

class GoogleOAuthRequest(BaseModel):
	id_token: str

def validate_object_id(id_str: str) -> ObjectId:
	try:
		return ObjectId(id_str)
	except Exception:
		raise ValueError("Invalid ObjectId format")