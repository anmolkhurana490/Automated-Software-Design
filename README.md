# ArchFlow

ArchFlow is an agentic software design studio that turns requirements into production-ready architecture. It pairs a FastAPI backend with a Next.js frontend to guide project creation, planning, validation, and studio workflows.

## Stack

- Frontend: Next.js, React, Tailwind CSS
- Backend: FastAPI, Python
- Data & orchestration: project and design agents, stage-based workflows, WebSocket support

## Project Layout

- `frontend/` - polished web UI and studio experience
- `backend/` - API, agents, orchestration, and services

## Quick Start

1. Start the backend: `cd backend && uvicorn main:app --reload`
2. Start the frontend: `cd frontend && npm install && npm run dev`
3. Open `http://localhost:3000`

## What It Does

- Collects requirements and shapes them into a design bundle
- Recommends architecture, planning, and validation steps
- Provides a studio flow for managing projects and generated output

## Highlights

- Clean, branded ArchFlow experience
- Modular agent pipeline
- Fast iteration for software architecture design
