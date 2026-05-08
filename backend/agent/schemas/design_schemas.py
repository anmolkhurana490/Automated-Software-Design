from pydantic import BaseModel, Field
from typing import List


# Structured output models for service design
class ServiceComponent(BaseModel):
	name: str = Field(default="", description="Service or module name")
	responsibility: str = Field(default="", description="Primary business responsibility")
	owned_data: List[str] = Field(default_factory=list, description="Data entities primarily owned by this service")
	dependencies: List[str] = Field(default_factory=list, description="Other services this service depends on")
	key_patterns: List[str] = Field(default_factory=list, description="Key design patterns used (e.g. JWT for auth, caching strategy)")


class ServicesDesignOutput(BaseModel):
	services: List[ServiceComponent] = Field(default_factory=list, description="Desciption of service or module design")
	reasoning: str = Field(default="", description="Why this fits the requirements and constraints")
	confidence: float = Field(default=0.0, ge=0.0, le=1.0, description="Overall confidence from 0 to 1")


# Structured output models for database design
class DatabaseTable(BaseModel):
	name: str = Field(default="", description="Table name")
	description: str = Field(default="", description="Concise description of the table's purpose and which service owns it")
	fields: List[str] = Field(default_factory=list, description="list of core tables fields. format: id: uuid, pk")
	relations: List[str] = Field(default_factory=list, description="list of relationships to other tables. format: follows.user_id -> users.id")


class DatabaseDesignOutput(BaseModel):
	tables: List[DatabaseTable]
	reasoning: str = Field(default="", description="Concise overall schema rationale.")
	confidence: float = Field(default=0.0, description="Overall confidence from 0 to 1")


# Structured output models for API design
class ApiEndpoint(BaseModel):
	name: str = ""
	purpose: str = ""
	base_route: str = Field(description="API base route involving child endpoints")


class ApiDesignOutput(BaseModel):
	api_design: List[ApiEndpoint] = Field(default_factory=list)
	frontend_notes: str = Field(default="", description="Notes for frontend integration, involving workflows and API client design")
	reasoning: str = Field(default="", description="Concise overall API design rationale.")
	confidence: float = Field(default=0.0, description="Overall confidence from 0 to 1")


# Structured output models for infrastructure planning
class InfrastructureDesignOutput(BaseModel):
	cloud: str = ""
	infra_services: List[str] = Field(default_factory=list)
	deployment: str = ""
	reasoning: str = ""
	confidence: float = 0.0