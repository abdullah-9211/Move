from fastapi import APIRouter, HTTPException
from exercises.plank.pose_matching import Plank
from exercises.pushup.pose_detection import Pushup
from models.Exercise import Exercise
from models.Workout import Workout
import database.workouts as db


router = APIRouter()

#===============================================================================
# Exercise analysis and workout completion endpoints
#===============================================================================

# list of exercises 
completed_exercises = []

# Analyze exercise
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
        
        
# Finalize workout and add to database            
@router.post("/finish-workout")
async def finish_workout(workout_data: dict):
    plan_id = workout_data.get("plan_id")
    client_id = workout_data.get("client_id")
    total_duration = 0
    total = 0
    
    if len(completed_exercises) == 0:
        return {"workout": 0, "total_duration": 0, "accuracy": 0}

    for exercise in completed_exercises: 
        total_duration += exercise.duration
        total += exercise.accuracy
        
    accuracy = total/len(completed_exercises)


    workout = Workout(plan_id, client_id, total_duration, accuracy)
    workout_id = db.add_workout(workout)

    for exercise in completed_exercises:
        exercise.workout_id = workout_id
        db.add_exercise(exercise)

    completed_exercises.clear()
    return {"workout": workout_id, "total_duration": total_duration, "accuracy": round(accuracy, 1)}


# =============================================================================
# Workout data fetching endpoints
# =============================================================================

# Get all workout plans
@router.get("/get-all-workouts")
async def get_all_workouts():
    plans = db.get_plans()
    division = {
        'Strength': [],
        'Endurance': [],
        'Toning': [],
        'Weight Loss': [],
        'Yoga': []
    }
    for plan in plans:
        division[plan['workout_type']].append(plan)
    return division


# Get workout plans according to workout type
@router.get("/get-workouts/{plan_type}")
async def get_workouts(plan_type: str):
    return db.get_plan_by_type(plan_type)


# Get exercises of a workout plan
@router.get("/get-exercises/{plan_id}")
async def get_exercises(plan_id: int):
    exercises = db.get_plan_exercises(plan_id)
    return exercises

@router.get("/get-plan-trainer/{trainer_id}")
async def get_plan_trainer(trainer_id: int):
    return db.get_plan_trainer(trainer_id)