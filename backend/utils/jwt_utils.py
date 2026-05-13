from datetime import datetime, timedelta, timezone
from jose import JWTError, jwt
from typing import Any
from dotenv import load_dotenv
import os

load_dotenv()

JWT_ALGORITHM = "HS256"
JWT_SECRET = os.getenv("JWT_SECRET") or "dev-jwt-secret"
JWT_EXPIRE_DAYS = 30  # 7 days

def create_access_token(payload: dict[str, Any]) -> str:
	now = datetime.now(timezone.utc)
	expires_at = now + timedelta(days=JWT_EXPIRE_DAYS)

	token_payload = {
		**payload,
		"iat": int(now.timestamp()),
		"exp": int(expires_at.timestamp()),
	}

	return jwt.encode(token_payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

def decode_access_token(token: str) -> dict[str, Any] | None:
	try:
		payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
		return payload
	except JWTError:
		return None