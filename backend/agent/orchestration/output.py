from langgraph.graph import StateGraph, END
from agent.states import OutputState
from agent.nodes.output_nodes import output_assembler_node

# =========== Graph Construction ===========
output_graph = StateGraph(OutputState)

output_graph.add_node("output_assembly", output_assembler_node)
output_graph.set_entry_point("output_assembly")
output_graph.add_edge("output_assembly", END)

output_stage = output_graph.compile()