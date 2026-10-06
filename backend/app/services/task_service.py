from sqlalchemy.orm import Session

from app.models.task import Task
from app.schemas.task import TaskCreate


def create_task(
    db: Session,
    task_data: TaskCreate
) -> Task:

    task = Task(
        title=task_data.title,
        description=task_data.description,
        status=task_data.status,
        priority=task_data.priority,
        due_date=task_data.due_date,
        project_id=task_data.project_id,
        assigned_to=task_data.assigned_to
    )

    db.add(task)
    db.commit()
    db.refresh(task)

    return task


def get_tasks(
    db: Session,
    project_id: int
) -> list[Task]:

    return (
        db.query(Task)
        .filter(Task.project_id == project_id)
        .all()
    )


def get_task(
    db: Session,
    task_id: int
) -> Task | None:

    return (
        db.query(Task)
        .filter(Task.id == task_id)
        .first()
    )


def update_task(
    db: Session,
    task: Task,
    task_data: TaskCreate
) -> Task:

    task.title = task_data.title
    task.description = task_data.description
    task.status = task_data.status
    task.priority = task_data.priority
    task.due_date = task_data.due_date
    task.project_id = task_data.project_id
    task.assigned_to = task_data.assigned_to

    db.commit()
    db.refresh(task)

    return task


def delete_task(
    db: Session,
    task: Task
) -> None:

    db.delete(task)
    db.commit()


def get_filtered_tasks(
    db: Session,
    project_id: int,
    status: str | None = None,
    priority: str | None = None,
    skip: int = 0,
    limit: int = 10
) -> list[Task]:

    query = (
        db.query(Task)
        .filter(Task.project_id == project_id)
    )

    if status:
        query = query.filter(Task.status == status)

    if priority:
        query = query.filter(Task.priority == priority)

    return (
        query
        .offset(skip)
        .limit(limit)
        .all()
    )


