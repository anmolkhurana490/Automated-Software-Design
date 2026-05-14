from fastapi import Depends
from modules.auth.dependencies import get_current_user_id, get_current_user_id_ws
from modules.projects.services import ProjectService

async def validate_project(
  project_id: str,
  user_id: str = Depends(get_current_user_id),
):
  """Dependency to validate that a project exists and belongs to the user."""
  project_service = ProjectService()
  return await project_service.validate_project_ownership(project_id, user_id)


async def validate_project_ws(
  project_id: str,
  user_id: str = Depends(get_current_user_id_ws),
):
  """Dependency to validate that a project exists for websocket connections."""
  project_service = ProjectService()
  return await project_service.validate_project_ownership(project_id, user_id)