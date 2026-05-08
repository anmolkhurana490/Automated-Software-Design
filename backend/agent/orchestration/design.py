from langgraph.graph import StateGraph, END
from agent.states import DesignState
from agent.nodes.design_nodes import (
    services_design_node,
    db_node,
    api_node,
    infra_node,
    user_checkpoint_node,
    design_aggregation_node,
    post_checkpoint_router,
    post_node_router,
)

# =========== Graph Construction ===========

design_graph = StateGraph(DesignState)

design_graph.add_node("services_design", services_design_node)
design_graph.add_node("database_design", db_node)
design_graph.add_node("api_design", api_node)
design_graph.add_node("infrastructure_planning", infra_node)

# Dummy nodes for parallel design nodes before user checkpoint
design_graph.add_node("db_parallel_design", lambda state: {})
design_graph.add_node("api_parallel_design", lambda state: {})
design_graph.add_node("infra_parallel_design", lambda state: {})

design_graph.add_node("user_checkpoint", user_checkpoint_node)
design_graph.add_node("design_aggregation", design_aggregation_node)

design_graph.set_entry_point("services_design")

design_graph.add_edge("services_design", "database_design")
design_graph.add_edge("services_design", "api_design")
design_graph.add_edge("services_design", "infrastructure_planning")

# User checkpoint after all parallel design nodes execute to allow review and potential rerun (parallel execution)
design_graph.add_edge(
    ["db_parallel_design", "api_parallel_design", "infra_parallel_design"],
    "user_checkpoint"
)

# When any node reruns, it goes to user checkpoint (single execution path in case of rerun)
design_graph.add_conditional_edges(
    "database_design", post_node_router,
    {
        "rerun": "user_checkpoint",
        "design_parallel": "db_parallel_design",
    }
)
design_graph.add_conditional_edges(
    "api_design", post_node_router,
    {
        "rerun": "user_checkpoint",
        "design_parallel": "api_parallel_design",
    }
)
design_graph.add_conditional_edges(
    "infrastructure_planning", post_node_router,
    {
        "rerun": "user_checkpoint",
        "design_parallel": "infra_parallel_design",
    }
)

design_graph.add_edge("design_aggregation", END)

design_graph.add_conditional_edges(
    "user_checkpoint",
    post_checkpoint_router,
    {
        "services": "services_design",
        "database": "database_design",
        "api": "api_design",
        "infrastructure": "infrastructure_planning",
        "aggregation": "design_aggregation",  # If user approves and wants to proceed to aggregation
    }
)

design_stage = design_graph.compile()
