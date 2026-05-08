# Backend Setup

This backend uses FastAPI.

## Install dependencies

From the `backend` folder, install the Python packages listed in `requirements.txt`:

```bash
pip install -r requirements.txt
```

## Run the server

Start the FastAPI app with Uvicorn:

```bash
uvicorn main:app --reload
```

The API will be available at `http://127.0.0.1:8000`.

## Useful routes

- `GET /` returns a welcome message
- `GET /studio` exposes the studio router
