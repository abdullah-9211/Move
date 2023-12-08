# Entrypoint for the application
from fastapi import FastAPI
from database.connection import connect
from api.exercise_endpoints import router as exercise_router
from api.user_endpoints import router as user_router

app = FastAPI()

def get_supabase_client():
    return connect()

app.include_router(exercise_router, prefix="/exercise", tags=["exercise"])
app.include_router(user_router, prefix="/user", tags=["user"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)