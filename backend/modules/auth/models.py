from datetime import datetime
from typing import Optional, Literal

from pydantic import BaseModel, Field

AuthProviders = Literal["credential", "google"]

class AuthUser(BaseModel):
	id: str
	name: str
	email: str
	avatar: Optional[str] = None
	auth_provider: AuthProviders = "credential"
	password_hash: Optional[str] = None
	provider_user_id: Optional[str] = None
	created_at: datetime
	updated_at: datetime

	@classmethod
	def from_mongo(cls, data: dict):
		return cls(
			id=str(data["_id"]),
			name=data["name"],
			email=data["email"],
			avatar=data.get("avatar"),
			auth_provider=data.get("auth_provider", "credential"),
			password_hash=data.get("password_hash"),
      provider_user_id=data.get("provider_user_id"),
			created_at=data.get("created_at", datetime.utcnow()),
			updated_at=data.get("updated_at", datetime.utcnow()),
		)
	
	def to_public(self):
		return {
      "id": self.id,
      "name": self.name,
      "email": self.email,
      "avatar": self.avatar,
      "auth_provider": self.auth_provider,
      "created_at": self.created_at,
      "updated_at": self.updated_at,
    }
	
class AuthUserCreate(BaseModel):
	name: str
	email: str
	avatar: Optional[str] = None
	auth_provider: AuthProviders = "credential"
	password_hash: Optional[str] = None
	provider_user_id: Optional[str] = None
	created_at: datetime = Field(default_factory=datetime.utcnow)
	updated_at: datetime = Field(default_factory=datetime.utcnow)

class AuthUserUpdate(BaseModel):
  name: Optional[str] = None
  email: Optional[str] = None
  avatar: Optional[str] = None
  password_hash: Optional[str] = None