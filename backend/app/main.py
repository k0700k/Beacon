from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse

app = FastAPI(title="Hackathon Starter API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = Path(__file__).resolve().parent
STATIC_DIR = BASE_DIR / "static"
INDEX_FILE = STATIC_DIR / "index.html"
STATIC_ROOT = STATIC_DIR.resolve()


def frontend_available() -> bool:
    return INDEX_FILE.exists()


def frontend_missing_response() -> JSONResponse:
    return JSONResponse(
        status_code=503,
        content={
            "detail": (
                "Frontend build not found yet. Use `npm run dev` in the frontend directory "
                "for development or run `npm run build` to build static assets."
            )
        },
    )


def resolve_static_file(requested_path: str) -> Path | None:
    if not requested_path:
        return None

    candidate = (STATIC_DIR / requested_path).resolve()
    if candidate.is_relative_to(STATIC_ROOT) and candidate.is_file():
        return candidate
    return None


@app.get("/api/health")
def read_health() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/api/message")
def read_message() -> dict[str, list[str] | str]:
    return {
        "headline": "Your hackathon stack is live.",
        "stack": [
            "React + Vite for shipping UI fast",
            "Tailwind CSS for quick styling and iteration",
            "FastAPI for backend routes and integrations",
            "Docker for reliable demos across every laptop",
        ],
        "next_steps": [
            "Wire in auth, payments, or AI APIs",
            "Swap the starter screen with your real product pitch",
            "Add your database before demo day if the project needs persistence",
        ],
    }


@app.get("/", include_in_schema=False)
def serve_root():
    if frontend_available():
        return FileResponse(INDEX_FILE)
    return frontend_missing_response()


@app.get("/{full_path:path}", include_in_schema=False)
def serve_frontend(full_path: str):
    if full_path.startswith("api"):
        return JSONResponse(status_code=404, content={"detail": "Not Found"})

    if not frontend_available():
        return frontend_missing_response()

    asset = resolve_static_file(full_path)
    if asset is not None:
        return FileResponse(asset)

    return FileResponse(INDEX_FILE)
