from fastapi import WebSocket
from fastapi.websockets import WebSocketState
from typing import Dict, List

class WebSocketManager:
    def __init__(self):
        self.active_connection: Dict[str, WebSocket] = {}

    async def connect(self, session_id: str, websocket: WebSocket):
        await websocket.accept()
        
        print(f"WebSocket connected for session {session_id}")
        self.active_connection[session_id] = websocket

    def disconnect(self, session_id: str):
        if session_id in self.active_connection:
            del self.active_connection[session_id]

        print(f"WebSocket disconnected for session {session_id}")

    async def broadcast_data(self, session_id: str, data: dict):
        if session_id not in self.active_connection:
            return
        
        ws = self.active_connection[session_id]

        try:
            if ws.client_state == WebSocketState.CONNECTED:
                await ws.send_json(data)
            else:
                print(f"WebSocket for session {session_id} is not connected. Unable to send data.")
                self.disconnect(session_id)
        except Exception as e:
            print(f"Error sending data to WebSocket for session {session_id}: {e}")
            self.disconnect(session_id)