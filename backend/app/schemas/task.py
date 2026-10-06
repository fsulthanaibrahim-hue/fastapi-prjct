from datetime import date, datetime

from pydantic import BaseModel, ConfigDict


class TaskCreate(BaseModel):
    title: str
    description: str | None = None
    status: str = "todo"
    priority: str = "medium"
    due_date: date | None = None
    project_id: int
    assigned_to: int | None = None


class TaskResponse(BaseModel):
    id: int
    title: str
    description: str | None
    status: str
    priority: str
    due_date: date | None
    project_id: int
    assigned_to: int | None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)