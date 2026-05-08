from langchain_core.prompts import PromptTemplate

# Prompt template for architecture design
architecture_prompt = PromptTemplate.from_template(
	"""You are a senior system architect.
Design the system architecture from requirements and constraints.
If previous output exists, apply the requested changes and return the full result. Preserve all unchanged components exactly as they are.

Return practical and concise output grounded in the input.

Requirements:
{requirements}

Constraints:
{constraints}

Previous architecture:
{architecture}

Changes requested:
{arch_changes_requested}"""
)

# Prompt template for tech stack selection
tech_prompt = PromptTemplate.from_template(
	"""You are a senior system architect.
Select a suitable tech, which aligns strictly with the architecture design and constraints.
Avoid introducing technologies not justified by requirements.

Return practical and concise output grounded in the input.

Architecture:
{architecture}

Constraints:
{constraints}"""
)
