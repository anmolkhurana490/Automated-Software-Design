from config.errors import BadRequestException, NotFoundException
from modules.projects.types import ProjectCreateData, ProjectUpdateData
from modules.projects.dao import ProjectDao
from modules.studio.dao import StudioDao


class ProjectService:
  def __init__(self):
    self.project_dao = ProjectDao()
    self.studio_dao = StudioDao()

  # =========== Validate Project Ownership ============
  async def validate_project_ownership(self, project_id: str, user_id: str):
    """Check if the project exists and belongs to the user."""
    project = await self.project_dao.get_project_by_id(project_id)

    if not project:
      raise NotFoundException("Project not found")
    
    if project.user_id != user_id:
      raise BadRequestException("Unauthorized access to this project")

  # ============ Get Single Project ============
  async def get_project_data(self, project_id: str):
    """Retrieve a project by ID with user authorization check."""
    project_data = await self.project_dao.get_project_by_id(project_id)
    return project_data
  
  # ============ Get All Projects for User ============
  async def get_user_projects(self, user_id: str, limit: int, skip: int):
    """Fetch all projects belonging to a user with pagination support."""
    count_projects = await self.project_dao.count_user_projects(user_id)
    if count_projects == 0:
      return {"total": 0, "projects": []}
    
    projects = await self.project_dao.get_projects_by_user(user_id, limit, skip)
    return {
      "total": count_projects,
      "projects": projects
    }

  # ============ Create Project ============
  async def create_project(self, user_id: str, project_data: ProjectCreateData):
    """Create a new project for the specified user."""
    created_project = await self.project_dao.create_project(user_id, project_data)
    return created_project

  # ============ Update Project ============
  async def update_project(self, project_id: str, project_data: ProjectUpdateData):
    """Update a project with authorization check to ensure user owns the project."""

    # Perform the update
    updated_project = await self.project_dao.update_project(project_id, project_data)
    return updated_project

  # ============ Delete Project ============
  async def delete_project(self, project_id: str):
    """Delete a project and all associated sessions with authorization check."""
    
    # Delete the project itself
    await self.project_dao.delete_project(project_id)

    # Cascade delete: remove all sessions associated with this project
    await self.studio_dao.delete_project_sessions(project_id)

    return True