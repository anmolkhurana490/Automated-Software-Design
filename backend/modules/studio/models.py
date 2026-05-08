from pydantic import BaseModel, Field
from typing import Optional, Literal, Dict
from datetime import datetime

StageStatus = Literal["pending", "in_progress", "completed"]
StageName = Literal["elicitation", "planning", "design", "validation", "output"]

class StageSchema(BaseModel):
  output: Dict = Field(default_factory=dict)
  status: StageStatus = Field(default="pending")
  updated_at: datetime = Field(default_factory=datetime.now)
  completed_at: Optional[datetime] = None

class AgentSession(BaseModel):
  project_id: str = Field(min_length=1)

  user_input: str = Field(min_length=1)
  elicitation: StageSchema = Field(default_factory=StageSchema)
  planning: StageSchema = Field(default_factory=StageSchema)
  design: StageSchema = Field(default_factory=StageSchema)
  validation: StageSchema = Field(default_factory=StageSchema)
  output: StageSchema = Field(default_factory=StageSchema)

  created_at: datetime = Field(default_factory=datetime.now)
  updated_at: datetime = Field(default_factory=datetime.now)

class AgentSessionCreate(AgentSession):
  pass

class AgentSessionUpdate(BaseModel):
  user_input: Optional[str] = None

  elicitation: Optional[StageSchema] = None
  planning: Optional[StageSchema] = None
  design: Optional[StageSchema] = None
  validation: Optional[StageSchema] = None
  output: Optional[StageSchema] = None

  updated_at: datetime = Field(default_factory=datetime.now)

class StageUpdate(BaseModel):
  stage: StageName
  status: StageStatus
  output: Dict = Field(default_factory=dict)

class AgentSessionOutput(AgentSession):
  id: str

  @classmethod
  def from_mongo(cls, data: dict):
    return cls(
      id=str(data["_id"]),
      project_id=data["project_id"],
      user_input=data["user_input"],
      elicitation=StageSchema(**data.get("elicitation", {})),
      planning=StageSchema(**data.get("planning", {})),
      design=StageSchema(**data.get("design", {})),
      validation=StageSchema(**data.get("validation", {})),
      output=StageSchema(**data.get("output", {})),
      created_at=data["created_at"],
      updated_at=data["updated_at"]
    )