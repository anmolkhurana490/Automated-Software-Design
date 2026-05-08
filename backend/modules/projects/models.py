from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class Project(BaseModel):
  name: str
  user_id: str
  description: Optional[str] = None
  created_at: datetime = Field(default_factory=datetime.now)
  updated_at: datetime = Field(default_factory=datetime.now)

class ProjectCreate(Project):
  pass

class ProjectUpdate(BaseModel):
  name: Optional[str] = None
  description: Optional[str] = None
  updated_at: datetime = Field(default_factory=datetime.now)

class ProjectOutput(Project):
  id: str

  @classmethod
  def from_mongo(cls, data: dict):
    return cls(
      id=str(data["_id"]),
      user_id=data["user_id"],
      name=data["name"],
      description=data.get("description"),
      created_at=data["created_at"],
      updated_at=data["updated_at"]
    )