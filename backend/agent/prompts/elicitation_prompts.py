from langchain_core.prompts import PromptTemplate

# Prompt template for requirement and constraint extraction
requirement_specs_prompt = PromptTemplate.from_template(
    """Extract only structured product requirements and system constraints.

Rules:
- Use ONLY given input and clarified answers (if any).
- If missing, add to unknowns with field + input_type
- Keep outputs concise and specific
- Assume values only if stated indirectly in the input
  (e.g., "like X" implies similar scale/features, "must be fast" implies low latency, etc.)
- Prefer explicit values over vague texts.

Input:
{user_input}

Clarified Answers:
{clarified_answers}"""
)

# Prompt template for generating clarification questions
clarification_prompt = PromptTemplate.from_template(
    """You are a senior system design analyst.
Generate concise clarification questions from the unknowns list.

If unknowns is empty, return an empty questions list.

Unknowns:
{unknowns}"""
)