from agent.llm import call_llm, call_structured_llm
from agent.states import DesignState
from agent.prompts.design_prompts import service_prompt, db_prompt, api_prompt, infra_prompt
from agent.prompts.design_prompts import service_prompt, db_prompt, api_prompt, infra_prompt
from agent.schemas.design_schemas import (
	ServicesDesignOutput,
	DatabaseDesignOutput,
	ApiDesignOutput,
	InfrastructureDesignOutput,
)
from langgraph.types import interrupt
from typing import Dict


# Node function for service
def services_design_node(state: DesignState) -> Dict:
	prompt = service_prompt.format(
		architecture=state.get("architecture", {}),
		tech_stack=state.get("tech_stack", {}),
		requirements=state.get("requirements", {}),
		constraints=state.get("constraints", {}),
		existing_services=state.get("services", {}),
		changes_requested=state.get("changes_requested", ""),
	)
	result = call_structured_llm(ServicesDesignOutput, prompt)

	return {
		"services": result,
		"approved": None,  # Reset approval for next steps
		"rerun_node": None,  # Reset rerun node
		"changes_requested": None,  # Reset changes requested
	}


# Node function for database design
def db_node(state: DesignState) -> Dict:
	db_stack = state.get("tech_stack", {}).get("database", {})

	prompt = db_prompt.format(
		services=state.get("services", {}),
		db_stack={
			"name": db_stack.get("name", "unknown"),
			"type": db_stack.get("type", "relational"),  # Default to relational if not specified
			"orm": db_stack.get("orm", "unknown")
		},
		constraints=state.get("constraints", {}),
		existing_database_schema=state.get("database_schema", {}),
		changes_requested=state.get("changes_requested", "")
	)
	result = call_structured_llm(DatabaseDesignOutput, prompt)

	return {
		"database_schema": result,
	}


# Node function for API design
def api_node(state: DesignState) -> Dict:
	prompt = api_prompt.format(
		services=state.get("services", {}),
		constraints=state.get("constraints", {}),
		existing_apis=state.get("api_endpoints", {}),
		changes_requested=state.get("changes_requested", "")
	)

	result = call_structured_llm(ApiDesignOutput, prompt)

	return {
		"api_endpoints": result
	}


# Node function for infrastructure planning
def infra_node(state: DesignState) -> Dict:
	prompt = infra_prompt.format(
		services=state.get("services", {}),
		constraints=state.get("constraints", {}),
		existing_infrastructure=state.get("infrastructure", {}),
		changes_requested=state.get("changes_requested", "")
	)

	result = call_structured_llm(InfrastructureDesignOutput, prompt)

	return {
		"infrastructure": result,
	}


# ======== User Checkpoint Node =========
def user_checkpoint_node(state: DesignState) -> Dict:
	# This node can be used to pause the graph execution and allow the user to review the current design state
	
	rerun_node_options = ["services", "database", "api", "infrastructure"]

	checkpoint_details = [
		{
			"field": "approval",
			"message": "Do you approve all the current design states?",
			"input_type": "boolean",
			"required": True
		},
		{
			"field": "changes_requested",
			"message": "If not approved, please describe the changes you want to request. Provide a brief description.",
			"input_type": "text",
			"required": False
		},
		{
			"field": "rerun_node",
			"message": "If not approved, which node do you want to rerun?",
			"input_type": "text",
			"options": rerun_node_options,
			"required": False
		}
	]

	checkpoint_response = interrupt({"checkpoint_details": checkpoint_details})

	if not checkpoint_response.get("approval", True) and checkpoint_response.get("changes_requested", ""):
		return {
			"approved": False,
			"rerun_node": checkpoint_response.get("rerun_node", None),
			"changes_requested": checkpoint_response.get("changes_requested", "")
		}

	return {
		"approved": True,
		"rerun_node": None,
		"changes_requested": None,
	}


# ========= Design Aggregation Node =========
def design_aggregation_node(state: DesignState) -> Dict:
	# This node aggregates the final design decisions into a comprehensive design bundle that can be used for implementation or documentation
	design_bundle = {
		"services": state.get("services", {}),
		"database_schema": state.get("database_schema", {}),
		"api_endpoints": state.get("api_endpoints", {}),
		"infrastructure": state.get("infrastructure", {}),
	}

	return {
		"design_bundle": design_bundle
	}


# ======== Design Router Node =========
def post_checkpoint_router(state: DesignState):
	if state.get("approved") is False and state.get("rerun_node", None):
		# If not approved, route to rerun node back
		return state.get("rerun_node")

	# If approved or no rerun requested, proceed to next steps or end
	return "aggregation"


def post_node_router(state: DesignState):
	if state.get("approved") is False:
		# rerun node - single node execution after user checkpoint
		return "rerun"

	# parallel node execution after user checkpoint - wait for all nodes to complete
	return "design_parallel"
