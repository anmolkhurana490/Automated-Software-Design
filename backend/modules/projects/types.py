from config.errors import BadRequestException
from pydantic import BaseModel, Field
from typing import Optional
from bson import ObjectId

def validate_object_id(value: str, err_message: str) -> ObjectId:
  if ObjectId.is_valid(value):
    return ObjectId(value)

  raise BadRequestException(err_message)

class GetProjectsQueryParams(BaseModel):
  limit: int = Field(default=10, gt=0)
  skip: int = Field(default=0, ge=0)

class ProjectCreateData(BaseModel):
  name: str = Field(min_length=1)
  description: Optional[str] = None

class ProjectUpdateData(BaseModel):
  name: Optional[str] = Field(default=None, min_length=1)
  description: Optional[str] = None