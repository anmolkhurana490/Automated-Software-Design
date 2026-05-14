from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import uvicorn
import os

from config.errors import register_exception_handlers
from modules.auth.routes import router as auth_router
from modules.studio.routes import router as studio_router, ws_router as studio_ws_router
from modules.projects.routes import router as projects_router

load_dotenv()

app = FastAPI()

FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/auth")
app.include_router(projects_router, prefix="/projects")
app.include_router(studio_router, prefix="/studio")
app.include_router(studio_ws_router, prefix="/studio")
register_exception_handlers(app)

@app.get("/")
async def root():
    return {
        "name": "ArchFlow",
        "message": "Agentic Design Studio - Transform requirements into production-ready architecture",
        "version": "2.4.0",
        "status": "running"
    }

if __name__ == "__main__":
    uvicorn.run(app)