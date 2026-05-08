from agent.llm import call_structured_llm
from agent.states import ElicitationState
from agent.prompts.elicitation_prompts import requirement_specs_prompt
from agent.schemas.elicitation_schemas import RequirementSpecification
from langgraph.graph import END
from langgraph.types import interrupt
from typing import Dict, List

# Helper function to infer unknowns from empty fields in requirements/constraints
def unkowns_inference(data: Dict, unknowns: List[Dict[str, str]]):
    unknown_fields = {item["field"] for item in unknowns}
    
    for key, value in data.items():
        if (not value or (isinstance(value, list) and len(value) == 0)) and key not in unknown_fields:
            input_type = "list" if isinstance(value, list) else "string"
            unknowns.append({
				"field": key,
				"input_type": input_type
			})

# Node function for requirement extraction
def requirement_specs_node(state: ElicitationState) -> Dict:
    user_input = state["user_input"]
    clarified_answers = state.get("clarified_answers", {})
    
    prompt = requirement_specs_prompt.format(
        user_input=user_input,
        clarified_answers=clarified_answers
    )

    result = call_structured_llm(RequirementSpecification, prompt)
    requirements = result.get("requirements", {})
    constraints = result.get("constraints", {})
    unknowns = result.get("unknowns", [])

    # Fallback: infer missing keys if the model returns an empty unknowns list.
    unkowns_inference(requirements, unknowns)
    unkowns_inference(constraints, unknowns)
    
	# Clear unknowns if we had clarified answers, to avoid infinite clarification loops - Only 1 round of clarification
    new_unknowns = unknowns if not clarified_answers else []

    return {
        "requirements": requirements,
        "constraints": constraints,
        "unknowns": new_unknowns,
        "clarified_answers": {}
    }

# Node function for generating clarification questions
def clarification_node(state: ElicitationState) -> Dict:
	unknowns = state.get("unknowns", [])

	if len(unknowns) == 0:
		return {
			"clarified_answers": {}  # No clarification needed
		}

	# Use the questions to prompt the user for answers.
	answers = interrupt({"clarification_details": unknowns})

	return {
		"clarified_answers": answers
	}

# ======== Elicitation Router Nodes =========
def clarification_router(state: ElicitationState):
    unknowns = state.get("unknowns", [])
    # If there are unknowns, go to the clarification node.
    if len(unknowns) > 0:
        return "clarify"
    
    # If there are no unknowns, we can end elicitation or move to the next phase.
    return END