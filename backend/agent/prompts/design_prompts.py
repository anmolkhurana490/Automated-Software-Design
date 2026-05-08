from langchain_core.prompts import PromptTemplate

# Prompt template for service design
service_prompt = PromptTemplate.from_template(
	"""You are a senior software architect.
Design the system (or update existing) into clear services or module boundaries. Follow the architecture strictly.
If previous output exists, apply the requested changes and return the full result. Preserve all unchanged components exactly as they are.

Return practical and concise output grounded in the input.
Keep confidence between 0 and 1.

Architecture:
{architecture}

Requirements:
{requirements}

Constraints:
{constraints}

Tech Stack:
{tech_stack}

Existing Services:
{existing_services}

Changes Requested:
{changes_requested}"""
)

# Prompt template for database design
db_prompt = PromptTemplate.from_template(
	"""You are a senior backend architect.
Design a complete database schema (or update existing) from services and constraints.
If previous output exists, apply the requested changes and return the full result. Preserve all unchanged components exactly as they are.

For each service's owned_data, create the necessary tables.
Every table needs: a primary key, core fields, and foreign keys where relevant.
Keep it concise — no over-engineering.

Return practical and comprehensive schema grounded in the input.

Services:
{services}

Database Stack:
{db_stack}

Constraints:
{constraints}

Existing Database Schema:
{existing_database_schema}

Changes Requested:
{changes_requested}"""
)

# Prompt template for API design
api_prompt = PromptTemplate.from_template(
	"""You are a senior API designer.
Design APIs (or update existing) from the services and constraints.
If previous output exists, apply the requested changes and return the full result. Preserve all unchanged components exactly as they are.

Return practical and concise output grounded in the input.

Services:
{services}

Constraints:
{constraints}

Existing APIs:
{existing_apis}

Changes Requested:
{changes_requested}"""
)

# Prompt template for infrastructure planning
infra_prompt = PromptTemplate.from_template(
	"""You are a senior cloud architect.
Design infrastructure (or update existing) from tech stack and constraints.
If previous output exists, apply the requested changes and return the full result. Preserve all unchanged components exactly as they are.

Return practical and concise output grounded in the input.

Services:
{services}

Constraints:
{constraints}

Existing Infrastructure:
{existing_infrastructure}

Changes Requested:
{changes_requested}"""
)
