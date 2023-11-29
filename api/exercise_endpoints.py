from fastapi import APIRouter, HTTPException
from exercises.plank.pose_matching import Plank
from exercises.pushup.pose_detection import Pushup
from models.Workout import Workout
from database.workouts import add_workout

router = APIRouter()

@router.post("/analyze")
async def analyze_exercise(exercise_data: dict):
    exercise = exercise_data.get("exercise")
    client_video = exercise_data.get("client_video")
    trainer_video = exercise_data.get("trainer_video")

    if exercise == "plank":
        # initialize plank 
        plank_instance = Plank(trainer_video, client_video)
        workout_stats = Workout(1, 1, 1, 90)
        add_workout(workout_stats)
        
    elif exercise == "pushup":
        # initialize pushup
        pushup_instance = Pushup(trainer_video, client_video)
        workout_stats = Workout(1, 1, 1, 90)
        add_workout(workout_stats)
    else:
        raise HTTPException(status_code=404, detail="Exercise not found")