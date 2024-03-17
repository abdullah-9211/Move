from fastapi import APIRouter, HTTPException
from exercises.plank.pose_matching import Plank
from exercises.pushup.pose_detection import Pushup
from exercises.squat.pose_detection import Squat
from exercises.jumping_jack.pose_detection import JumpingJack
from models.Exercise import Exercise
from models.Workout import Workout
import database.workouts as db
import database.users as user_db


router = APIRouter()

#===============================================================================
# Exercise analysis and workout completion endpoints
#===============================================================================

# list of exercises 
completed_exercises = []
all_errors = {}
all_error_times = {}
exercises = {}

# Analyze exercise
@router.post("/analyze")
async def analyze_exercise(exercise_data: dict):
    
    # Extract data
    exercise = exercise_data.get("exercise")
    client_video = exercise_data.get("client_video")
    trainer_video = exercise_data.get("trainer_video")

    # Get exercise id
    exercise_id = db.get_exercise_id(exercise)
    exercises[exercise] = exercise_id

    # Initialize and analyze based on exercise type
    if exercise == "plank":
        plank_instance = Plank(trainer_video, client_video)
        errors, error_times, accuracy, duration = plank_instance.run_process()
        exercise_stats = Exercise(0, exercise_id, None, duration, accuracy)
        all_errors[exercise_id] = errors
        all_error_times[exercise_id] = error_times
    elif exercise == "pushup":
        pushup_instance = Pushup(client_video, trainer_video)
        reps, errors, error_times, accuracy, duration = pushup_instance.run_process()
        exercise_stats = Exercise(0, exercise_id, reps, duration, accuracy)
        all_errors[exercise_id] = errors
        all_error_times[exercise_id] = error_times
    elif exercise == "squat":
        squat_instance = Squat(client_video, trainer_video)
        reps, errors, error_times, accuracy, duration = squat_instance.run_process()
        exercise_stats = Exercise(0, exercise_id, reps, duration, accuracy)
        all_errors[exercise_id] = errors
        all_error_times[exercise_id] = error_times
    elif exercise == "jumping jack":
        jj_instance = JumpingJack(client_video, trainer_video)
        reps, errors, error_times, accuracy, duration = jj_instance.run_process()
        exercise_stats = Exercise(0, exercise_id, reps, duration, accuracy)
        all_errors[exercise_id] = errors
        all_error_times[exercise_id] = error_times
        
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
    trainer_id = workout_data.get("trainer_id")
    total_duration = 0
    total = 0
    
    if len(completed_exercises) == 0:
        return {"workout": 0, "total_duration": 0, "accuracy": 0}

    for exercise in completed_exercises: 
        total_duration += exercise.duration
        total += exercise.accuracy
        
    accuracy = total/len(completed_exercises)

        
    subscribed_ids = user_db.get_subscribed_ids(trainer_id)
    if client_id not in subscribed_ids:
        user_db.add_subscription(client_id, trainer_id)

    workout = Workout(plan_id, client_id, total_duration, accuracy)
    workout_id = db.add_workout(workout)

    for exercise in completed_exercises:
        exercise.workout_id = workout_id
        db.add_exercise(exercise)
        for i in range(len(all_errors[exercise.exercise_id])):
            db.add_errors(workout_id, exercise.exercise_id, all_errors[exercise.exercise_id][i], all_error_times[exercise.exercise_id][i])

    completed_exercises.clear()
        
    return {"workout": workout_id, "total_duration": total_duration, "accuracy": round(accuracy, 1), "errors": all_errors, "error_times": all_error_times, "exercises": exercises}


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