from langchain_core.prompts import PromptTemplate

# Base prompt template for all validations (LLM Critic)
validate_prompt = PromptTemplate.from_template(
    """You are a software architecture evaluator.
Your task is to analyze the given INPUT and identify issues based on the VALIDATION GOAL.
Also, count the total number of validation checks performed across all components to provide context on the thoroughness of the evaluation.

Focus only on meaningful issues. Avoid generic or obvious statements.

{validation_details}

IMPORTANT:
- Do NOT hallucinate missing components.
- Do NOT infer issues that are not directly supported by the provided design details.
- Avoid potential improvements or suggestions if current design is correct.
- Do NOT repeat same issue
- total_checks should include all checks performed across all components and must not count duplicate checks.
- Be precise and technical""")

# ============= Requirements Alignment Prompt Templates ============

# Requirements -> Architecture + Services
req_arch_services_prompt = PromptTemplate.from_template(
	"""VALIDATION GOAL:
Check if the architecture and services align with the specified requirements.

Identify:
- Missing services
- Missing capabilities
- Architectural mismatches
- Incorrect mapping of features
       
INPUT:
Requirements:
{requirements}

Architecture:
{architecture}

Services:
{services}
"""
)

# Constraints -> Architecture + Tech Stack
constr_arch_stack_prompt = PromptTemplate.from_template(
	"""VALIDATION GOAL:
Check if the architecture and tech stack choices align with the specified constraints.

Identify:
- Violations of constraints
- Risky or incompatible decisions

INPUT:
Constraints:
{constraints}

Architecture:
{architecture}

Tech Stack:
{tech_stack}
"""
)


# ============= Cross-Component Validation Prompt Templates ============

# Database Design <-> API Design
db_api_prompt = PromptTemplate.from_template(
	"""VALIDATION GOAL:
Check for consistency between the database design and API design.

Identify:
- Missing fields
- Incorrect data usage
- Mismatch in structure

INPUT:
Database Design:
{database_design}

API Design:
{api_design}
"""
)

# API Design <-> Infrastructure Design
api_infra_prompt = PromptTemplate.from_template(
	"""VALIDATION GOAL:
Check for consistency between the API design and infrastructure design.

Identify:
- Missing scaling support
- Incorrect communication patterns
- Latency or availability risks

INPUT:
API Design:
{api_design}

Infrastructure Design:
{infrastructure}
"""
)


# Design Optimization Prompt Template
decision_optimization_prompt = PromptTemplate.from_template(
	"""You are a senior software architect.
Your task is to suggest design optimizations that can improve the system beyond its current implementation.

Focus on:
- Performance improvements
- Scalability enhancements
- Cost optimization
- Developer productivity
- Maintainability

Constraints:
{constraints}

Architecture:
{architecture}

Tech Stack:
{tech_stack}

Infrastructure:
{infra}

TASK:
- Identify ONLY the most impactful improvements under given constraints and design.
- Focus on issues that significantly affect: performance, scalability, cost, maintainability
- Prioritize optimizations that are simpler to understand and implement.

RULES:
- Return a maximum of 5 suggestions.
- Don't infer optimizations that are not directly supported by the provided design details.
- If some detail is missing, avoid making assumptions of having unoptimized design.
- Avoid already implemented, generic or unnecessary optimizations.
- Each suggestion must be specific to this system and actionable."""
)