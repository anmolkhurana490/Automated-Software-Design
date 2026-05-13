from passlib.context import CryptContext
from typing import Optional
import hashlib

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def normalize_password(password: str) -> str:
	return hashlib.sha256(password.encode()).hexdigest()

def hash_password(password: str) -> str:
	norm_password = normalize_password(password)
	return pwd_context.hash(norm_password)

def verify_password(password: str, password_hash: str) -> bool:
	norm_password = normalize_password(password)
	return pwd_context.verify(norm_password, password_hash)