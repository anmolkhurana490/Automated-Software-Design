from fastapi import APIRouter, Depends
from modules.auth.dependencies import get_current_user_id
from modules.projects.dependencies import validate_project
from modules.projects.services import ProjectService
from modules.projects.types import ProjectCreateData, ProjectUpdateData, GetProjectsQueryParams

router = APIRouter(
  dependencies=[Depends(get_current_user_id)]
)
project_service = ProjectService()

@router.get("/{project_id}")
async def get_project(
  project_id: str,
  _: None = Depends(validate_project)
):
  project_data = await project_service.get_project_data(project_id)
  return {"status": "success", "data": project_data}

@router.get("")
async def get_user_projects(
  user_id: str = Depends(get_current_user_id),
  query: GetProjectsQueryParams = Depends()
):
  projects = await project_service.get_user_projects(user_id, query.limit, query.skip)
  return {"status": "success", "data": projects}

@router.post("")
async def create_project(
  data: ProjectCreateData,
  user_id: str = Depends(get_current_user_id)
):
  project_data = await project_service.create_project(user_id, data)
  return {"status": "success", "data": project_data}

@router.patch("/{project_id}")
async def update_project(
  project_id: str,
  data: ProjectUpdateData,
  _: None = Depends(validate_project)
):
  project_data = await project_service.update_project(project_id, data)
  return {"status": "success", "data": project_data}

@router.delete("/{project_id}")
async def delete_project(
  project_id: str,
  _: None = Depends(validate_project)
):
  await project_service.delete_project(project_id)
  return {"status": "success", "message": "Project deleted successfully"}