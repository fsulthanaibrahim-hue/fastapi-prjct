from app.database.database import SessionLocal
from app.models.user import User
from app.core.security import hash_password


db = SessionLocal()

admin = User(
    name="Admin",
    email="admin@example.com",
    hashed_password=hash_password("Admin@123"),
    role="admin",
)

db.add(admin)
db.commit()
db.refresh(admin)

print("Admin created successfully!")
print("Email:", admin.email)
print("Role:", admin.role)

db.close()