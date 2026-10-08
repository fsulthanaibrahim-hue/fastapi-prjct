from sqlalchemy.orm import Session

from app.models.project import Project
from app.schemas.project import ProjectCreate


def create_project(
    db: Session,
    project_data: ProjectCreate,
    owner_id: int
) -> Project:

    project = Project(
        name=project_data.name,
        description=project_data.description,
        owner_id=owner_id
    )

    db.add(project)
    db.commit()
    db.refresh(project)

    return project


def get_projects(
    db: Session,
    user_id: int,
    is_admin: bool = False
) -> list[Project]:

    if is_admin:
        return db.query(Project).all()

    return (
        db.query(Project)
        .filter(Project.owner_id == user_id)
        .all()
    )


def get_project(
        db: Session,
        project_id: int,
        user_id: int,
        is_admin: bool = False
) -> Project | None:

    query = db.query(Project).filter(Project.id == project_id)

    if not is_admin:
        query = query.filter(Project.owner_id == user_id)

    return query.first()


def delete_project(
    db: Session,
    project: Project
) -> None:

    db.delete(project)
    db.commit()