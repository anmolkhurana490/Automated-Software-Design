from langgraph.graph import StateGraph, END
from agent.states import GlobalState
from agent.orchestration.elicitation import elicitation_stage
from agent.orchestration.planning import planning_stage
from agent.orchestration.design import design_stage
from agent.orchestration.validation import validation_stage
from agent.orchestration.output import output_stage
from langgraph.checkpoint.memory import MemorySaver
from langgraph.checkpoint.serde.jsonplus import JsonPlusSerializer

# ========== Main Graph Construction ==========
main_graph = StateGraph(GlobalState)

main_graph.add_node("Elicitation", elicitation_stage)
main_graph.add_node("Planning", planning_stage)
main_graph.add_node("Design", design_stage)
main_graph.add_node("Validation", validation_stage)
main_graph.add_node("Output", output_stage)

main_graph.set_entry_point("Elicitation")
main_graph.add_edge("Elicitation", "Planning")
main_graph.add_edge("Planning", "Design")
main_graph.add_edge("Design", "Validation")
main_graph.add_edge("Validation", "Output")
main_graph.add_edge("Output", END)

memory = MemorySaver(serde=JsonPlusSerializer())
main_agent = main_graph.compile(checkpointer=memory)