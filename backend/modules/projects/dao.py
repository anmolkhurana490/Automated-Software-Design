from config.mongo_config import db
from modules.projects.models import ProjectCreate, ProjectOutput
from modules.projects.types import ProjectCreateData, ProjectUpdateData, validate_object_id
from datetime import datetime

class ProjectDao:
  def __init__(self):
    self.projects = db["projects"]

  async def get_project_by_id(self, project_id: str):
    project_obj_id = validate_object_id(project_id, "Invalid project ID")
    project = await self.projects.find_one({"_id": project_obj_id})

    if not project:
      return None

    return ProjectOutput.from_mongo(project)
  
  async def count_user_projects(self, user_id: str):
    count = await self.projects.count_documents({"user_id": user_id})
    return count
  
  async def get_projects_by_user(self, user_id: str, limit: int, skip: int):
    cursor = (
      self.projects.find({"user_id": user_id})
      .sort("created_at", -1)
      .skip(skip).limit(limit)
    )
    result = await cursor.to_list(length=limit)

    projectList = [ProjectOutput.from_mongo(project) for project in result]
    return projectList

  async def create_project(self, user_id: str, project_data: ProjectCreateData):
    new_project = ProjectCreate(**project_data.model_dump(), user_id=user_id)
    new_project_dict = new_project.model_dump()

    result = await self.projects.insert_one(new_project_dict)
    new_project_dict["_id"] = result.inserted_id

    return ProjectOutput.from_mongo(new_project_dict)

  async def update_project(self, project_id: str, project_data: ProjectUpdateData):
    project_obj_id = validate_object_id(project_id, "Invalid project ID")

    update_fields = project_data.model_dump(exclude_unset=True)
    update_fields["updated_at"] = datetime.now()

    updated_project = await self.projects.find_one_and_update(
      {"_id": project_obj_id},
      {"$set": update_fields},
      return_document=True # Return updated document
    )

    if not updated_project:
      return None

    return ProjectOutput.from_mongo(updated_project)

  async def delete_project(self, project_id: str):
    project_obj_id = validate_object_id(project_id, "Invalid project ID")
    result = await self.projects.find_one_and_delete({"_id": project_obj_id})
    return result is not None