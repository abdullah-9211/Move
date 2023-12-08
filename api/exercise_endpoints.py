from fastapi import APIRouter, HTTPException
from exercises.plank.pose_matching import Plank
from exercises.pushup.pose_detection import Pushup
from models.Exercise import Exercise
from models.Workout import Workout
import database.workouts as db


router = APIRouter()

# list of exercises 
completed_exercises = []

@router.post("/analyze")
async def analyze_exercise(exercise_data: dict):
    # Extract data
    
    exercise = exercise_data.get("exercise")
    client_video = exercise_data.get("client_video")
    trainer_video = exercise_data.get("trainer_video")
    duration = exercise_data.get("duration")

    # Get exercise id
    exercise_id = db.get_exercise_id(exercise)

    # Initialize and analyze based on exercise type
    if exercise == "plank":
        plank_instance = Plank(trainer_video, client_video)
        _, _, accuracy = plank_instance.run_process()
        exercise_stats = Exercise(0, exercise_id, None, duration, accuracy)
    elif exercise == "pushup":
        pushup_instance = Pushup(client_video, trainer_video)
        _, _, _, accruacy = pushup_instance.run_process()
        exercise_stats = Exercise(0, exercise_id, pushup_instance.reps, duration, accruacy)
    else:
        raise HTTPException(status_code=404, detail="Exercise not found")

    # Add exercise stats
    completed_exercises.append(exercise_stats)
    # print completed_exercises
    for exercise in completed_exercises:
        print(exercise.exercise_id)
        print(exercise.reps)
        print(exercise.duration)
        print(exercise.accuracy)

    
@router.post("/finish-workout")
async def finish_workout(workout_data: dict):
    plan_id = workout_data.get("plan_id")
    client_id = workout_data.get("client_id")
    total_duration = 0
    total = 0
    
    for exercise in completed_exercises: 
        total_duration += exercise.duration
        total += exercise.accuracy
        
    
    workout = Workout(plan_id, client_id, total_duration, total/len(completed_exercises))
    workout_id = db.add_workout(workout)
    
    for exercise in completed_exercises:
        exercise.workout_id = workout_id
        db.add_exercise(exercise)
        
    completed_exercises.clear()
    return workout_id
    
@router.get("/get-workout-information")
async def get_workout_information():
    #TODO: use workout id to get information of completed workout 
    db.get_workout_with_id(1)