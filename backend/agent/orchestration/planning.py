from langgraph.graph import StateGraph, END
from agent.states import PlanningState
from agent.nodes.planning_nodes import architecture_node, user_checkpoint_node, tech_node, planning_checkpoint_router

# ========== Graph Construction ==========

planning_graph = StateGraph(PlanningState)

planning_graph.add_node("Architecture Planning", architecture_node)
planning_graph.add_node("User Checkpoint", user_checkpoint_node)
planning_graph.add_node("Tech Stack Selection", tech_node)

planning_graph.add_conditional_edges(
    "User Checkpoint",
    planning_checkpoint_router,
    {
        "changes": "Architecture Planning",
        "approved": "Tech Stack Selection"
    }
)

planning_graph.set_entry_point("Architecture Planning")
planning_graph.add_edge("Architecture Planning", "User Checkpoint")
planning_graph.add_edge("Tech Stack Selection", END)

planning_stage = planning_graph.compile()
