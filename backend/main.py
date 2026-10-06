from fastapi import FastAPI

app = FastAPI(
    title="Task Management API",
    description="API for managing projects and tasks",
    version="1.0.0",
)

@app.get("/")
def home():
    return {
        "message": "Task Management API is running"
    }

@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }
