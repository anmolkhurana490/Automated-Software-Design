from langgraph.graph import StateGraph, END
from agent.states import ValidationState
from agent.nodes.validation_nodes import (
  requirements_alignment_node,
  cross_component_node,
  decision_optimization_node,
  scoring_node
)

# ============ Graph Construction ===========

validation_graph = StateGraph(ValidationState)

validation_graph.add_node("requirements_alignment", requirements_alignment_node)
validation_graph.add_node("cross_component_validation", cross_component_node)
validation_graph.add_node("decision_optimization", decision_optimization_node)
validation_graph.add_node("scoring", scoring_node)

validation_graph.set_entry_point("requirements_alignment")
validation_graph.add_edge("requirements_alignment", "cross_component_validation")
validation_graph.add_edge("cross_component_validation", "decision_optimization")
validation_graph.add_edge("decision_optimization", "scoring")
validation_graph.add_edge("scoring", END)

validation_stage = validation_graph.compile()