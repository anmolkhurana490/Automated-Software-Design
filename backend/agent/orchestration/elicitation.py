from langgraph.graph import StateGraph, END
from agent.states import ElicitationState
from agent.nodes.elicitation_nodes import (
  requirement_specs_node,
  clarification_node,
  clarification_router
)

# ======== Graph Construction ========

elicitation_graph = StateGraph(ElicitationState)

elicitation_graph.add_node("requirement_specs", requirement_specs_node)
elicitation_graph.add_node("clarify", clarification_node)

elicitation_graph.add_conditional_edges(
    "requirement_specs",
    clarification_router,
    {
        "clarify": "clarify",
        END: END
    }
)

elicitation_graph.set_entry_point("requirement_specs")
elicitation_graph.add_edge("clarify", "requirement_specs")

elicitation_stage = elicitation_graph.compile()