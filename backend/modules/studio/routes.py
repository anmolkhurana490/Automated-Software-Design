from fastapi import APIRouter, WebSocket, Depends
from fastapi.responses import StreamingResponse
from modules.studio.types import AgentStartData, UserCheckpointData, ExportFormat
from modules.projects.dependencies import validate_project, validate_project_ws
from modules.studio.services import StudioService
from modules.projects.models import ProjectOutput

router = APIRouter(
  dependencies=[Depends(validate_project)]
)

studio_service = StudioService()


@router.get("/{project_id}/session/{session_id}")
async def get_session(session_id: str):
  session_data = await studio_service.get_session_data(session_id)
  return {"status": "success", "data": session_data}


# Get the all session Ids (of agent execution) for a given project ID
@router.get("/{project_id}")
async def get_studio(
  project_id: str,
  projectData: ProjectOutput = Depends(validate_project)
):
  sessionsList = await studio_service.get_project_studio(project_id)
  data = {
    **projectData.model_dump(),
    "sessions": sessionsList
  }
  return {"status": "success", "data": data}


# Start the agent execution for a given project ID
@router.post("/{project_id}/start")
async def start_studio(project_id: str, data: AgentStartData):
  session_id = await studio_service.start_agent(project_id, data.user_input)
  return {"status": "success", "message": "Agent execution started", "data": {"session_id": session_id}}


# Handle User Checkpoint of the agent execution
@router.post("/{project_id}/checkpoint/{session_id}")
async def checkpoint_studio(project_id: str, session_id: str, data: UserCheckpointData):
  await studio_service.checkpoint_agent(project_id, session_id, data)
  return {"status": "success", "message": "Agent resumed from checkpoint"}


# # Edit the agent execution based on user input at a checkpoint
# @router.patch("/{project_id}/edit/{session_id}")
# def edit_studio(project_id: str, session_id: str data: UserInputData):
  # result = studio_service.edit_agent(project_id, session_id: str data.user_input)
#   return result


@router.get("/{project_id}/export/{session_id}/{format}")
async def export_report(project_id: str, session_id: str, format: ExportFormat):
  file_io, filename, media_type = await studio_service.export_report(project_id, session_id, format)

  return StreamingResponse(
    file_io, media_type=media_type,
    headers={"Content-Disposition": f"attachment; filename={filename}"}
  )


ws_router = APIRouter(
  dependencies=[Depends(validate_project_ws)]
)

# Websocket endpoint to stream real-time updates of the agent execution for a given project ID
@ws_router.websocket("/ws/{project_id}")
async def websocket_studio(websocket: WebSocket, project_id: str):
  await studio_service.connect_websocket(websocket, project_id)