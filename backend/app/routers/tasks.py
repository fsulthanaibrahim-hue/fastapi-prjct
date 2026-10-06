from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.dependencies import get_current_user, get_db
from app.models.task import Task
from app.models.user import User
from app.schemas.task import TaskCreate, TaskResponse
from app.services.task_service import (
    create_task,
    delete_task,
    get_task,
    get_tasks,
    update_task,
)


router = APIRouter(
    prefix="/tasks",
    tags=["Tasks"]
)


@router.post(
    "/",
    response_model=TaskResponse,
    status_code=status.HTTP_201_CREATED
)
def create_new_task(
    task_data: TaskCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return create_task(
        db=db,
        task_data=task_data
    )


@router.get(
    "/project/{project_id}",
    response_model=list[TaskResponse]
)
def list_project_tasks(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return get_tasks(
        db=db,
        project_id=project_id
    )


@router.get(
    "/{task_id}",
    response_model=TaskResponse
)
def get_single_task(
    task_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    task = get_task(
        db=db,
        task_id=task_id
    )

    if task is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    return task


@router.put(
    "/{task_id}",
    response_model=TaskResponse
)
def update_existing_task(
    task_id: int,
    task_data: TaskCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    task = get_task(
        db=db,
        task_id=task_id
    )

    if task is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    return update_task(
        db=db,
        task=task,
        task_data=task_data
    )


@router.delete(
    "/{task_id}",
    status_code=status.HTTP_204_NO_CONTENT
)
def remove_task(
    task_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    task = get_task(
        db=db,
        task_id=task_id
    )

    if task is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    delete_task(
        db=db,
        task=task
    )

    return None