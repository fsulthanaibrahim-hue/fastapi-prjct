from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.dependencies import get_current_user, get_db
from app.models.user import User
from app.schemas.project import ProjectCreate, ProjectResponse
from app.services.project_service import (
    create_project,
    delete_project,
    get_project,
    get_projects,
)

router = APIRouter(
    prefix="/projects",
    tags=["Projects"]
)


@router.post(
    "/",
    response_model=ProjectResponse,
    status_code=status.HTTP_201_CREATED
)
def create_new_project(
    project_data: ProjectCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return create_project(
        db=db,
        project_data=project_data,
        owner_id=current_user.id
    )


@router.get(
    "/",
    response_model=list[ProjectResponse]
)
def list_projects(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return get_projects(
        db=db,
        user_id=current_user.id,
        is_admin=current_user.role == "admin"
    )


@router.get(
    "/{project_id}",
    response_model=ProjectResponse
)
def get_single_project(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    project = get_project(
        db=db,
        project_id=project_id,
        user_id=current_user.id,
        is_admin=current_user.role == "admin"
    )

    if project is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )

    return project


@router.delete(
    "/{project_id}",
    status_code=status.HTTP_204_NO_CONTENT
)
def remove_project(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    project = get_project(
        db=db,
        project_id=project_id,
        user_id=current_user.id,
        is_admin=current_user.role == "admin"
    )

    if project is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )

    delete_project(
        db=db,
        project=project
    )

    return None