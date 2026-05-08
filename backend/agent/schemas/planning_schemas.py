from pydantic import BaseModel, Field
from typing import List, Literal


# Structured output schema for architecture design
class ArchitectureOutput(BaseModel):
	pattern: Literal["monolith", "modular_monolith", "microservices"]
	modules: List[str] = Field(default_factory=list, description="List of key modules/components in the architecture")
	reasoning: str = Field("", description="Short Explanation of why this architecture was chosen and others were rejected")
	confidence: float = 0.0


# Structured output schema for tech stack selection
class FrontendStack(BaseModel):
	language: str = Field(default="", description="Primary frontend language")
	framework: str = Field(default="", description="Frontend framework or library")
	reasoning: str = Field(default="", description="Why this frontend choice fits the system")


class BackendStack(BaseModel):
	language: str = Field(default="", description="Primary backend language")
	framework: str = Field(default="", description="Backend framework or runtime")
	api_style: str = Field(default="", description="API style such as REST or GraphQL if applicable")
	reasoning: str = Field(default="", description="Why this backend choice fits the system")


class DatabaseStack(BaseModel):
	type: str = Field(default="", description="Database category such as relational or document")
	name: str = Field(default="", description="Recommended database product")
	orm: str = Field(default="", description="ORM framework if database is relational and backend requires it")
	reasoning: str = Field(default="", description="Why this database choice fits the system")


class InfraStack(BaseModel):
	provider: str = Field(default="", description="Cloud or platform provider")
	services: List[str] = Field(default_factory=list, description="Core infrastructure services")
	reasoning: str = Field(default="", description="Why this infrastructure choice fits the system")


class TechStackOutput(BaseModel):
	frontend: FrontendStack = Field(default_factory=FrontendStack)
	backend: BackendStack = Field(default_factory=BackendStack)
	database: DatabaseStack = Field(default_factory=DatabaseStack)
	infra: InfraStack = Field(default_factory=InfraStack)
	overall_reasoning: str = Field(default="", description="How the tech stack fit the architecture as a whole")
	confidence: float = Field(default=0.0, ge=0.0, le=1.0, description="Overall confidence from 0 to 1")