# Entrypoint for the application
from fastapi import FastAPI
from database.connection import connect
from api.exercise_endpoints import router as exercise_router

app = FastAPI()

def get_supabase_client():
    return connect()

app.include_router(exercise_router, prefix="/exercise", tags=["exercise"])

if __name__ == "__main__":
    url = "./exercises/plank/sample_videos/abdullah_footage.mp4"
    url2 = "./exercises/plank/sample_videos/aizaaz_footage.mp4"
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)