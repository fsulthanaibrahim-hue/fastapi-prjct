from fastapi import Depends, FastAPI
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.dependencies import get_db, get_current_user, require_admin
from app.models.user import User
from app.routers.auth import router as auth_router
from app.routers.tasks import router as tasks_router
from app.routers.projects import router as projects_router
from app.routers.dashboard import router as dashboard_router
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI(
    title="Task Management API",
    description="API for managing projects and tasks",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(auth_router)
app.include_router(tasks_router)
app.include_router(projects_router)
app.include_router(dashboard_router)


@app.get("/")
def root():
    return {
        "message": "Task Management API is running"
    }


@app.get("/db-test")
def database_test(db: Session = Depends(get_db)):
    db.execute(text("SELECT 1"))

    return {
        "message": "Database connection successful"
    }

@app.get("/me")
def get_my_profile(
    current_user: User = Depends(get_current_user)
):
    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "role": current_user.role
    }


@app.get("/admin-test")
def admin_test(current_user: User = Depends(require_admin)):
    return {
        "message": "Welcome Admin!",
        "user_id": current_user.id,
        "role": current_user.role
    }

