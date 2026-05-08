from modules.studio.models import AgentSessionCreate, AgentSessionOutput, StageUpdate
from modules.studio.types import validate_object_id
from config.mongo_config import db
from datetime import datetime
from bson import ObjectId

class StudioDao:
  def __init__(self):
    self.sessions = db['agent_sessions']

  async def get_session_by_id(self, session_id: str):
    session_obj_id = validate_object_id(session_id, "Invalid session ID")
    session = await self.sessions.find_one({"_id": session_obj_id})

    if not session:
      return None
    
    return AgentSessionOutput.from_mongo(session)
  
  async def count_project_sessions(self, project_id: str):
    count = await self.sessions.count_documents({"project_id": project_id})
    return count

  async def get_project_sessions(self, project_id: str, max_sessions: int = 0):
    cursor = self.sessions.find({"project_id": project_id}).sort("created_at")
    result = await cursor.to_list(max_sessions)

    sessionList = [str(session["_id"]) for session in result]
    return sessionList

  async def create_session(self, project_id: str, user_input: str):
    new_session = AgentSessionCreate(
      project_id=project_id,
      user_input=user_input
    )
    new_session_dict = new_session.model_dump()

    result = await self.sessions.insert_one(new_session_dict)
    return str(result.inserted_id)
  
  async def update_session(self, project_id: str, session_id: str, update_data: StageUpdate):
    session_obj_id = validate_object_id(session_id, "Invalid session ID")

    stage = update_data.stage
    status = update_data.status

    update_output_fields = {f"{stage}.output.{key}": value for key, value in update_data.output.items()}

    update_fields = {
      **update_output_fields,
      f"{stage}.status": status,
      f"{stage}.updated_at": datetime.now(),
      f"{stage}.completed_at": datetime.now() if status == "completed" else None
    }

    result = await self.sessions.find_one_and_update(
      {"_id": session_obj_id, "project_id": project_id},
      {"$set": update_fields}
    )

    return result is not None
  
  async def delete_session(self, session_id: str):
    session_obj_id = validate_object_id(session_id, "Invalid session ID")
    result = await self.sessions.find_one_and_delete({"_id": session_obj_id})
    return result is not None
  
  async def delete_project_sessions(self, project_id: str):
    result = await self.sessions.delete_many({"project_id": project_id})
    return result.deleted_count