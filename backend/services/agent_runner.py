from agent.main_agent import main_agent
from agent.states import GlobalState
from langgraph.types import Command
from langchain_core.runnables import RunnableConfig
from typing import AsyncIterator

AGENT_STAGES = [ "Elicitation", "Planning", "Design", "Validation", "Output" ]

class AgentRunner:
    def __init__(self):
        self.agent = main_agent

    # To start/resume the agent execution and return stream (async agent updates generator)
    async def run_and_stream(
        self,
        session_id: str,
        data: dict | None = None,
        resumeAgent: bool = False
    ):
        config = RunnableConfig({
            "configurable": {"thread_id": session_id}
        })

        input_data = Command(resume=data) if resumeAgent else data
        # print(f"Running agent with session_id: {session_id}, resume: {resumeAgent}, input_data: {input_data}")

        stream = self.agent.astream(
            input_data,
            config=config,
            stream_mode="updates", subgraphs=True
        )
        # print(f"Agent run initiated for session_id: {session_id}, resume: {resumeAgent}")
        
        async for update in self.stream_agent_update(stream):
            yield update
    
    # To process the agent updates stream and yield structured updates for frontend and DB consumption
    async def stream_agent_update(self, stream: AsyncIterator):
        try:
            async for step in stream:
                stage, stage_output = step
                node_name = next(iter(stage_output), None)

                
                if node_name == "__interrupt__":
                    output = stage_output[node_name][0].value
                elif node_name and stage_output[node_name]:
                    output = stage_output[node_name]
                else:
                    output = None

                # print(f"Received agent update - Stage: {stage}, Node: {node_name}, Output: {True if output else None}")

                if node_name in AGENT_STAGES:
                    yield {
                        "type": "complete",
                        "stage": node_name.lower(),
                        "data": {}
                    }
                else:
                    stage_name = stage[0].split(":")[0] if stage else None
                    
                    yield {
                        "type": "checkpoint" if node_name == "__interrupt__" else "update",
                        "stage": stage_name.lower() if stage_name else None,
                        "node": node_name.lower() if node_name else None,
                        "data": output
                    }

                if node_name == "__interrupt__":
                    break
            else:
                yield {
                    "type": "end",
                    "message": "Agent execution paused/completed"
                }

        except Exception as e:
            yield {
                "type": "error",
                "message": str(e)
            }

        return