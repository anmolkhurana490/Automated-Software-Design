from services.agent_runner import AgentRunner
from services.websocket import WebSocketManager
from modules.studio.dao import StudioDao
from modules.studio.models import StageUpdate
from config.constants import MAX_SESSIONS_PER_PROJECT
from config.errors import NotFoundException, UnprocessableEntityException
from modules.studio.types import UserCheckpointData, ExportFormat
from utils.file_utils import generate_text_file, generate_pdf_file
from typing import AsyncGenerator
import asyncio

class StudioService:
	def __init__(self):
		# Initialize any necessary resources or configurations for the StudioService
		self.agent_runner = AgentRunner()
		self.ws_manager = WebSocketManager()
		self.studio_dao = StudioDao()
		self._background_tasks = set()


	async def get_session_data(self, session_id: str):
		session_data = await self.studio_dao.get_session_by_id(session_id)

		if not session_data:
			raise NotFoundException(f"Session not found")

		return session_data


	async def get_project_studio(self, project_id: str):
		# retrieving the current state of the agent execution for the given project ID
		return await self.studio_dao.get_project_sessions(project_id, max_sessions=MAX_SESSIONS_PER_PROJECT)


	async def start_agent(self, project_id: str, user_input: str):
		# check max sessions for the project
		session_count = await self.studio_dao.count_project_sessions(project_id)
		if session_count >= MAX_SESSIONS_PER_PROJECT:
			raise UnprocessableEntityException(f"Sessions Limit Exceeded")

		# create new studio doc in DB
		session_id = await self.studio_dao.create_session(project_id, user_input)

		# start the agent execution and stream updates to the frontend
		stream = self.agent_runner.run(
			session_id=session_id,
			data={"user_input": user_input}
		)
		generator = self.agent_runner.stream_agent_update(stream)

		# Run the agent execution in the background
		task = asyncio.create_task(self.handle_agent_updates(project_id, session_id, generator))

		# Keep ensure the background task reference to prevent it from being garbage collected
		# ensure the task doesn't get cancelled before it completes
		self._background_tasks.add(task)
		task.add_done_callback(self._background_tasks.discard)

		return session_id

	async def checkpoint_agent(self, project_id: str, session_id: str, responseData: UserCheckpointData):
		# update the session in the database with the new checkpoint response data
		updateData = StageUpdate(
			stage=responseData.stage,
			status="in_progress",
			output={"response": responseData.response, "user_answered": True}
		)
		updated_session = await self.studio_dao.update_session(project_id, session_id, updateData)

		if not updated_session:
			raise NotFoundException(f"Session not found")

		# resume the agent execution from the checkpoint with the updated response data
		stream = self.agent_runner.run(
			session_id=str(session_id),
			data=responseData.response,
			resumeAgent=True
		)

		generator = self.agent_runner.stream_agent_update(stream)

		# Run the agent execution in the background
		task = asyncio.create_task(self.handle_agent_updates(project_id, session_id, generator))

		# Keep ensure the background task reference to prevent it from being garbage collected
		# ensure the task doesn't get cancelled before it completes
		self._background_tasks.add(task)
		task.add_done_callback(self._background_tasks.discard)

	# def edit_agent(self, session_id: str, user_input: str):
	# 	# for editing the agent's execution based on user input
	# 	print(f"Editing agent for session {session_id} with new input: {user_input}")
	# 	return {"message": "Agent execution updated"}
	# 	pass


	# helper method to send updates to the frontend via WebSocket and store updates in the database
	async def handle_agent_updates(self, project_id: str, session_id: str, generator: AsyncGenerator):
		async for update in generator:
			# Store the update in the database
			print(f"Received update for session {session_id}: {update}")

			output = update.get("data", {})
			stage = update.get("stage", "").lower()

			if output is None or not stage:
				continue

			updateData = StageUpdate(
				stage=stage,
				status="completed" if update.get("type", "") == "complete" else "in_progress",
				output=output
			)
			await self.studio_dao.update_session(project_id, session_id, updateData)
			
			# Send the update to the frontend via WebSocket
			await self.ws_manager.broadcast_data(project_id, update)
			# print(f"Sent update to WebSocket for session {session_id}: {update}")


	async def export_report(self, project_id: str, session_id: str, format: ExportFormat):
		session_data = await self.studio_dao.get_session_by_id(session_id)

		if not session_data:
			raise NotFoundException(f"Session not found")
		
		final_report: str = session_data.output.output.get("final_output_report", "")

		if not final_report:
			raise UnprocessableEntityException(f"Report not available for this session")

		# Generate the report content based on the session data and requested format
		if format == "md":
			file_io = generate_text_file(final_report)
		else:
			file_io = generate_pdf_file(final_report)

		filename = f"report_{session_id}.{format}"
		media_type = "text/markdown" if format == "md" else "application/pdf"

		return file_io, filename, media_type

	# Websocket connection management methods
	async def connect_websocket(self, websocket, session_id: str):
		await self.ws_manager.connect(session_id, websocket)

		while True:
			try:
				# Keep the connection alive by waiting for messages from the client
				# although in this case we don't expect to receive messages, this will help detect disconnections
				await websocket.receive_text()
			except Exception as e:
				# print(f"WebSocket connection error for session {session_id}: {e}")
				self.ws_manager.disconnect(session_id)
				break