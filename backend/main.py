from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from modules.studio.routes import router as studio_router
from modules.projects.routes import router as projects_router
from config.errors import register_exception_handlers
import uvicorn

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(projects_router, prefix="/projects")
app.include_router(studio_router, prefix="/studio")
register_exception_handlers(app)

@app.get("/")
async def root():
    return {"message": "Welcome to the FastAPI backend!"}

if __name__ == "__main__":
    uvicorn.run(app)