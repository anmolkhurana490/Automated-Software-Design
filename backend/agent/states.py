from typing import TypedDict, List, Dict, NotRequired, Literal, NotRequired

# Global state shared across all nodes in the agent's workflow.
# This can be used to store information that needs to be accessed by multiple nodes
# Although state updates in one stage won't automatically update in other stages.
class GlobalState(TypedDict):
    user_input: str

    requirements: NotRequired[Dict]
    constraints: NotRequired[Dict]

    architecture: NotRequired[Dict]
    tech_stack: NotRequired[Dict]

    design_bundle: NotRequired[Dict]

    final_score: float


# ======== Elicitation Graph States ========
class ElicitationState(GlobalState):
    unknowns: NotRequired[List[str]]
    clarified_answers: NotRequired[Dict[str, str]]


# ======== Planning Graph States ========
class PlanningState(GlobalState):
    arch_approved: NotRequired[bool]
    arch_changes_requested: NotRequired[str]


# ========= Design Graph States =========
class DesignState(GlobalState):
    services: NotRequired[Dict[str, Dict]]
    database_schema: NotRequired[Dict[str, Dict]]
    api_endpoints: NotRequired[Dict[str, Dict]]
    infrastructure: NotRequired[Dict[str, Dict]]

    approved: NotRequired[bool]
    rerun_node: NotRequired[Literal["services", "database", "api", "infrastructure", None]]
    changes_requested: NotRequired[str]


# ========= Validation Graph States ========
class ValidationState(GlobalState):
	req_align_report: NotRequired[Dict]
	cross_component_report: NotRequired[Dict]
	decision_optimizations: NotRequired[Dict]
	scoring_report: NotRequired[Dict[str, float]]
     
# ======== Output Graph States ========
class OutputState(GlobalState):
    final_output_report: NotRequired[str]