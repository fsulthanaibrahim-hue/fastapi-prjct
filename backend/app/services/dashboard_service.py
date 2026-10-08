from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.project import Project
from app.models.task import Task


def get_dashboard_data(
    db: Session,
    user_id: int
):
    total_projects = (
        db.query(Project)
        .filter(Project.owner_id == user_id)
        .count()
    )

    project_ids = (
        db.query(Project.id)
        .filter(Project.owner_id == user_id)
        .subquery()
    )

    total_tasks = (
        db.query(Task)
        .filter(Task.project_id.in_(project_ids))
        .count()
    )

    todo_tasks = (
        db.query(Task)
        .filter(
            Task.project_id.in_(project_ids),
            Task.status == "todo"
        )
        .count()
    )

    in_progress_tasks = (
        db.query(Task)
        .filter(
            Task.project_id.in_(project_ids),
            Task.status == "in_progress"
        )
        .count()
    )

    completed_tasks = (
        db.query(Task)
        .filter(
            Task.project_id.in_(project_ids),
            Task.status == "completed"
        )
        .count()
    )

    high_priority_tasks = (
        db.query(Task)
        .filter(
            Task.project_id.in_(project_ids),
            Task.priority == "high"
        )
        .count()
    )

    return {
        "total_projects": total_projects,
        "total_tasks": total_tasks,
        "todo_tasks": todo_tasks,
        "in_progress_tasks": in_progress_tasks,
        "completed_tasks": completed_tasks,
        "high_priority_tasks": high_priority_tasks,
    }