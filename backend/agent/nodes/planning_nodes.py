from agent.llm import call_llm, call_structured_llm
from agent.states import PlanningState
from agent.prompts.planning_prompts import architecture_prompt, tech_prompt
from agent.schemas.planning_schemas import ArchitectureOutput, TechStackOutput
from langgraph.types import interrupt
from typing import Dict


# Node function for architecture design
def architecture_node(state: PlanningState) -> Dict:
	prompt = architecture_prompt.format(
		requirements=state.get("requirements", {}),
		constraints=state.get("constraints", {}),
		architecture=state.get("architecture", {}),
		arch_changes_requested=state.get("arch_changes_requested", ""),
	)
	result = call_structured_llm(ArchitectureOutput, prompt)

	return {
		"architecture": result,
		"arch_approved": None,
		"arch_changes_requested": None,
	}


# ========== User Checkpoint Node ==========
def user_checkpoint_node(state: PlanningState) -> Dict:
	arch_patterns = ["monolith", "modular_monolith", "microservices"]

	checkpoint_details = [
		{
			"field": "approval",
			"message": "Do you approve this architecture?",
			"input_type": "boolean",
			"required": True
		},
		{
			"field": "changes_requested",
			"message": "If not approved, please suggest changes or pick an alternative.",
			"input_type": "text",
			"options": arch_patterns,
			"required": False
		}
	]

	checkpoint_response = interrupt({"checkpoint_details": checkpoint_details})

	if not checkpoint_response.get("approval", True) and checkpoint_response.get("changes_requested", ""):
		return {
			"arch_approved": False,
			"arch_changes_requested": checkpoint_response.get("changes_requested", "")
		}

	return {
		"arch_approved": True,
		"arch_changes_requested": None
	}


# Node function for tech stack selection
def tech_node(state: PlanningState) -> Dict:
	prompt = tech_prompt.format(
		architecture=state.get("architecture", {}),
		constraints=state.get("constraints", {}),
	)
	result = call_structured_llm(TechStackOutput, prompt)

	return {
		"tech_stack": result,
	}


# =========== Planning Router Nodes ===========
def planning_checkpoint_router(state: PlanningState):
	if state.get("arch_approved", True):
		return "approved"
	else:
		return "changes"
