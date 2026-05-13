from config.mongo_config import db
from modules.auth.models import AuthUser, AuthUserCreate, AuthUserUpdate
from modules.auth.types import validate_object_id

class AuthDao:
  def __init__(self):
    self.users = db["users"]

  async def get_user_by_id(self, user_id: str):
    user_obj_id = validate_object_id(user_id)
    data = await self.users.find_one({"_id": user_obj_id})
    return AuthUser.from_mongo(data) if data else None

  async def get_user_by_email(self, email: str):
    data = await self.users.find_one({"email": email})
    return AuthUser.from_mongo(data) if data else None
  
  async def get_user_by_provider_id(self, provider_user_id: str, auth_provider: str):
    data = await self.users.find_one({
      "provider_user_id": provider_user_id,
      "auth_provider": auth_provider
    })
    return AuthUser.from_mongo(data) if data else None

  async def create_user(self, user_data: dict):
    data = await self.users.insert_one(user_data)
    if data.inserted_id:
      return AuthUser.from_mongo({**user_data, "_id": data.inserted_id})
    
    return None

  async def update_user(self, user_id: str, updates: dict):
    user_obj_id = validate_object_id(user_id)
    await self.users.update_one(
      {"_id": user_id},
      {"$set": updates}
    )
    return await self.get_user_by_id(user_id)