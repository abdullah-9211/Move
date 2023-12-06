from fastapi import APIRouter, HTTPException
from exercises.plank.pose_matching import Plank
from exercises.pushup.pose_detection import Pushup
from models.Exercise import Exercise
from models.Workout import Workout
import database.workouts as db


router = APIRouter()

@router.post("/analyze")
async def analyze_exercise(exercise_data: dict):
    exercise = exercise_data.get("exercise")
    client_video = exercise_data.get("client_video")
    trainer_video = exercise_data.get("trainer_video")

    if exercise == "plank":
        # initialize plank 
        plank_instance = Plank(trainer_video, client_video)
        exercise_stats = Exercise(1,1,1,1,1)
        db.add_exercise(exercise_stats)
        
    elif exercise == "pushup":
        # initialize pushup
        pushup_instance = Pushup(trainer_video, client_video)
        workout_stats = Workout(1, 1, 1, 90)
        db.add_exercise(workout_stats)
    else:
        raise HTTPException(status_code=404, detail="Exercise not found")
    
@router.post("/finish-workout")
async def finish_workout(workout_data: dict):
    plan_id = workout_data.get("plan_id")
    client_id = workout_data.get("client_id")
    durations = workout_data.get("durations", [])
    accuracies = workout_data.get("accuracies", [])
    
    total_duration = 0
    # sum durations array
    for duration in durations:
        total_duration += duration
    
    # calculate average accuracy
    total_accuracy = 0
    for accuracy in accuracies:
        total_accuracy += accuracy
    average_accuracy = total_accuracy / len(accuracies)
    workout_stats = Workout(plan_id, client_id, average_accuracy, total_duration)  
    db.add_workout(workout_stats)  
    
@router.get("/get-workout-information")
async def get_workout_information():
    return db.get_workout_with_id(12)

@router.get("/get-workout")
async def get_workout():
    return db.get_workout()