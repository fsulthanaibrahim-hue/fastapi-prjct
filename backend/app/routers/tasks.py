from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.dependencies import get_current_user, get_db
from app.models.task import Task
from app.models.user import User
from app.schemas.task import TaskCreate, TaskResponse
from app.services.task_service import (
    create_task,
    delete_task,
    get_filtered_tasks,
    get_task,
    get_tasks,
    is_project_owner,
    update_task,
)

router = APIRouter(
    prefix="/tasks",
    tags=["Tasks"]
)


def check_task_access(
    db: Session,
    task: Task,
    current_user: User
) -> None:

    if current_user.role == "admin":
        return

    if not is_project_owner(
        db=db,
        project_id=task.project_id,
        user_id=current_user.id
    ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have access to this task"
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

    if current_user.role != "admin":
        if not is_project_owner(
            db=db,
            project_id=task_data.project_id,
            user_id=current_user.id
        ):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You can only create tasks in your own projects"
            )

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

    if current_user.role != "admin":
        if not is_project_owner(
            db=db,
            project_id=project_id,
            user_id=current_user.id
        ):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have access to this project"
            )

    return get_tasks(
        db=db,
        project_id=project_id
    )


@router.get(
    "/project/{project_id}/filter",
    response_model=list[TaskResponse]
)
def filter_project_tasks(
    project_id: int,
    task_status: str | None = Query(
        default=None,
        description="Filter by task status"
    ),
    priority: str | None = Query(
        default=None,
        description="Filter by task priority"
    ),
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=10, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    if current_user.role != "admin":
        if not is_project_owner(
            db=db,
            project_id=project_id,
            user_id=current_user.id
        ):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have access to this project"
            )

    skip = (page - 1) * limit

    return get_filtered_tasks(
        db=db,
        project_id=project_id,
        task_status=task_status,
        priority=priority,
        skip=skip,
        limit=limit
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

    check_task_access(
        db=db,
        task=task,
        current_user=current_user
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

    check_task_access(
        db=db,
        task=task,
        current_user=current_user
    )

    if current_user.role != "admin":
        if not is_project_owner(
            db=db,
            project_id=task_data.project_id,
            user_id=current_user.id
        ):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You can only move tasks to your own projects"
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

    check_task_access(
        db=db,
        task=task,
        current_user=current_user
    )

    delete_task(
        db=db,
        task=task
    )

    return None
