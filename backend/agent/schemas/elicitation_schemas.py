from pydantic import BaseModel, Field
from typing import List, Literal

# Define a schema for unknown fields to capture any missing information
class UnknownItem(BaseModel):
    field: str
    input_type: Literal["string", "list"]

# Define structured output schema for requirement extraction
class RequirementDetails(BaseModel):
    problem_statement: str = ""
    target_users: List[str] = []
    core_features: List[str] = []
    user_actions: List[str] = []  # what users actually do
    entities: List[str] = []  # main objects (order, user, product, etc.)
    scale_hint: str = ""
    domain: str = ""
    
# Define structured output schema for constraints extraction
class ConstraintDetails(BaseModel):
    scale: str = ""
    latency: str = ""
    availability: str = ""
    consistency: str = ""
    timeline: str = ""
    budget: str = ""
    team_size: str = ""
    security: str = ""

class RequirementSpecification(BaseModel):
    requirements: RequirementDetails
    constraints: ConstraintDetails
    unknowns: List[UnknownItem] = []


# Define structured output schema for clarification questions
class ClarificationOutput(BaseModel):
    questions: List[str] = Field(default_factory=list)