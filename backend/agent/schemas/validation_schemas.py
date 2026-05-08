from pydantic import BaseModel, Field
from typing import List, Literal

# Validation Output Schemas

class IssueSchema(BaseModel):
    issue_name: str
    description: str = Field(description="Concise explanation of the issue identified in the design")
    component: Literal["architecture", "tech_stack", "services", "database_design", "api_design", "infrastructure"]
    severity: Literal["low", "medium", "high"]

class ValidationOutput(BaseModel):
    issues: List[IssueSchema] = Field(default_factory=list)
    total_checks: int = Field(default=0, description="Total number of validation checks performed across all components.")
    confidence: float = Field(default=0.0, description="Confidence score between 0 and 1, representing the likelihood that the identified issues are valid and relevant to the design.")


# Design Optimization Output Schema
class OptimizationSuggestion(BaseModel):
    title: str
    description: str = Field(description="Concise explanation of the optimization suggestion")
    category: Literal["performance", "scalability", "cost", "maintainability", "developer_experience"]
    impact: Literal["high", "medium", "low"]

class DecisionOptimizationSchema(BaseModel):
	suggestions: List[OptimizationSuggestion] = Field(default_factory=list, max_length=5)
	confidence: float = Field(default=0.0, description="Confidence score between 0 and 1, representing the likelihood of the suggested optimizations being effective and relevant to the design.")