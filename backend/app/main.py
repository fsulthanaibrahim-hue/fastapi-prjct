from fastapi import Depends, FastAPI
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.dependencies import get_db, get_current_user
from app.models.user import User
from app.routers.auth import router as auth_router
from app.routers.tasks import router as tasks_router
from app.routers.projects import router as projects_router


app = FastAPI(
    title="Task Management API",
    description="API for managing projects and tasks",
    version="1.0.0"
)


app.include_router(auth_router)
app.include_router(tasks_router)
app.include_router(projects_router)


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
