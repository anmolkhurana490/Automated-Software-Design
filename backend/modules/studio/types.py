from pydantic import BaseModel, Field
from typing import List, Dict, Any
from config.errors import BadRequestException
from modules.studio.models import StageName, StageStatus
from bson import ObjectId

def validate_object_id(value: str, err_message: str) -> ObjectId:
  if ObjectId.is_valid(value):
    return ObjectId(value)
  
  raise BadRequestException(err_message)

# Define request body schema for starting the agent
class AgentStartData(BaseModel):
  user_input: str = Field(min_length=1)

# Define request body schema for user checkpoint input
class UserCheckpointData(BaseModel):
  stage: StageName
  response: Dict[str, Any] = Field(default_factory=dict)