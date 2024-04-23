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
exercises = []
accuracies = []
exercise_translator = {}
filenames = []

# Analyze exercise
@router.post("/analyze")
async def analyze_exercise(exercise_data: dict):
    print(exercise_data)
    
    if len(completed_exercises) == 0:
        all_errors.clear()
        all_error_times.clear()
        exercises.clear()
        accuracies.clear()
        exercise_translator.clear()
    
    # Extract data
    exercise = exercise_data.get("exercise")
    client_video = exercise_data.get("client_video")
    trainer_video = exercise_data.get("trainer_video")
    exercise_id = db.get_exercise_id(exercise)
    plan_id = exercise_data.get("plan_id")
    print(exercise_id, plan_id, trainer_video)

    # Get exercise id
    exercises.append(exercise)
    exercise_translator[exercise] = exercise_id

    # Initialize and analyze based on exercise type
    if exercise == "plank":
        plank_instance = Plank(trainer_video, client_video)
        
        angles = db.get_angles_from_db(plan_id, exercise_id)
        angles = angles[0]['trainer_angles']
        errors, error_times, accuracy, duration, filename = plank_instance.assess_client(angles['elbow_min'], angles['elbow_max'], angles['shoulder_min'], angles['shoulder_max'], angles['hip_min'], angles['hip_max'], angles['knee_min'], angles['knee_max'])
        filenames.append(filename)
        exercise_stats = Exercise(0, exercise_id, None, duration, accuracy)
        all_errors[exercise_id] = errors
        all_error_times[exercise_id] = error_times
    elif exercise == "pushup":
        pushup_instance = Pushup(client_video, trainer_video)
        angles = db.get_angles_from_db(plan_id, exercise_id)
        angles = angles[0]['trainer_angles']
        reps, errors, error_times, accuracy, duration, filename = pushup_instance.assess_client(angles['elbow_state1'], angles['elbow_state2'], angles['elbow_state3'], angles['shoulder_state1'], angles['shoulder_state2'], angles['shoulder_state3'], angles['hip_state1'], angles['hip_state2'], angles['hip_state3'], angles['knee_state1'], angles['knee_state2'], angles['knee_state3'], angles['state_1_threshold'], angles['state_2_threshold'], angles['state_3_threshold'])
        filenames.append(filename)
        exercise_stats = Exercise(0, exercise_id, reps, duration, accuracy)
        all_errors[exercise_id] = errors
        all_error_times[exercise_id] = error_times
    elif exercise == "squat":
        squat_instance = Squat(client_video, trainer_video)
        angles = db.get_angles_from_db(plan_id, exercise_id)
        angles = angles[0]['trainer_angles']
        reps, errors, error_times, accuracy, duration, filename = squat_instance.assess_client(angles['knee_angle_state1'], angles['knee_angle_state2'], angles['knee_angle_state3'], angles['hip_angle_state1'], angles['hip_angle_state2'], angles['hip_angle_state3'], angles['knee_feet_ratio_state1'], angles['feet_shoulder_ratio_state1'], angles['knee_feet_ratio_state2'], angles['feet_shoulder_ratio_state2'], angles['knee_feet_ratio_state3'], angles['feet_shoulder_ratio_state3'], angles['state_1_threshold'], angles['state_2_threshold'], angles['state_3_threshold'])
        filenames.append(filename)
        exercise_stats = Exercise(0, exercise_id, reps, duration, accuracy)
        all_errors[exercise_id] = errors
        all_error_times[exercise_id] = error_times
    elif exercise == "jumping jack":
        jj_instance = JumpingJack(client_video, trainer_video)
        angles = db.get_angles_from_db(plan_id, exercise_id)
        angles = angles[0]['trainer_angles']
        reps, errors, error_times, accuracy, duration, filename = jj_instance.assess_client(angles['shoulder_1_r'], angles['shoulder_2_r'], angles['shoulder_3_r'], angles['hip_1_r'], angles['hip_2_r'], angles['hip_3_r'], angles['knee_1_r'], angles['knee_2_r'], angles['knee_3_r'], angles['shoulder_1_l'], angles['shoulder_2_l'], angles['shoulder_3_l'], angles['hip_1_l'], angles['hip_2_l'], angles['hip_3_l'], angles['knee_1_l'], angles['knee_2_l'], angles['knee_3_l'], angles['state_1_threshold'], angles['state_2_threshold'], angles['state_3_threshold'])
        filenames.append(filename)
        exercise_stats = Exercise(0, exercise_id, reps, duration, accuracy)
        all_errors[exercise_id] = errors
        all_error_times[exercise_id] = error_times
        
    else:
        raise HTTPException(status_code=404, detail="Exercise not found")

    # Add exercise stats
    completed_exercises.append(exercise_stats)
    accuracies.append(exercise_stats.accuracy)
    
    # print completed_exercises
    for exercise in completed_exercises:
        print(exercise.exercise_id)
        print(exercise.reps)
        print(exercise.duration)
        print(exercise.accuracy)
    
    return {"filenames": filenames}
        
# Finalize workout and add to database            
@router.post("/finish-workout")
async def finish_workout(workout_data: dict):
    plan_id = workout_data.get("plan_id")
    client_id = workout_data.get("client_id")
    trainer_id = workout_data.get("trainer_id")
    total_duration = 0
    total = 0
    
    if len(completed_exercises) == 0:
        return {"workout": 0, "total_duration": 0, "accuracy": 0, "errors": {}, "error_times": {}, "exercises": [], "exerciseNum": len(exercises), "exercise_translator": {}, "accuracies": []}

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
    temp_filenames = filenames
    filenames.clear()
    return {"workout": workout_id, "total_duration": total_duration, "accuracy": round(accuracy, 1), "errors": all_errors, "error_times": all_error_times, "exercises": exercises, "exerciseNum": len(exercises), "exercise_translator": exercise_translator, "accuracies": accuracies, filenames: temp_filenames}


@router.post("/get-trainer-angles")
def get_trainer_angles(video_data: dict):
    trainer_id = video_data.get("trainer_id")
    plan_id = video_data.get("plan_id")
    exercise = video_data.get("exercise_name")
    trainer_video = video_data.get("exercise_video")
    exercise_id = db.get_exercise_id(exercise)
    
    if exercise == "plank":
        plank_instance = Plank(trainer_video, "")
        angles = plank_instance.get_trainer_angles()
        
        
        angles_data = {
            "elbow_min": angles[0],
            "elbow_max": angles[1],
            "shoulder_min": angles[2],
            "shoulder_max": angles[3],
            "hip_min": angles[4],
            "hip_max": angles[5],
            "knee_min": angles[6],
            "knee_max": angles[7]
        }
        
        data = {
            "trainer_angles": angles_data,
            "trainer_id": trainer_id,
            "plan_id": plan_id,
            "exercise_id": exercise_id,
        }
        return db.add_trainer_angles(data)
        
    elif exercise == "pushup":
        pushup_instance = Pushup("", trainer_video)
        
        thresholds = pushup_instance.set_state_thresholds()
        angles = pushup_instance.get_trainer_angles()
        
        elbow_state1 = (angles[0], angles[1])
        elbow_state2 = (angles[2], angles[3])
        elbow_state3 = (angles[4], angles[5])
        
        shoulder_state1 = (angles[6], angles[7])
        shoulder_state2 = (angles[8], angles[9])
        shoulder_state3 = (angles[10], angles[11])
        
        hip_state1 = (angles[12], angles[13])
        hip_state2 = (angles[14], angles[15])
        hip_state3 = (angles[16], angles[17])
        
        knee_state1 = (angles[18], angles[19])
        knee_state2 = (angles[20], angles[21])
        knee_state3 = (angles[22], angles[23])
        
        angles_data = {
            "elbow_state1": elbow_state1,
            "elbow_state2": elbow_state2,
            "elbow_state3": elbow_state3,
            "shoulder_state1": shoulder_state1,
            "shoulder_state2": shoulder_state2,
            "shoulder_state3": shoulder_state3,
            "hip_state1": hip_state1,
            "hip_state2": hip_state2,
            "hip_state3": hip_state3,
            "knee_state1": knee_state1,
            "knee_state2": knee_state2,
            "knee_state3": knee_state3,
            "state_1_threshold": thresholds[0],
            "state_2_threshold": thresholds[1],
            "state_3_threshold": thresholds[2]
        }
            
        
        data = {
            "trainer_angles": angles_data,
            "trainer_id": trainer_id,
            "plan_id": plan_id,
            "exercise_id": exercise_id,
        }
        return db.add_trainer_angles(data)
        
        
    elif exercise == "squat":
        squat_instance = Squat("", trainer_video)
        
        thresholds = squat_instance.set_state_thresholds()
        angles = squat_instance.get_trainer_angles()
        
        knee_angle_state1 = angles[0], angles[1]
        knee_angle_state2 = angles[2], angles[3]
        knee_angle_state3 = angles[4], angles[5]
        
        hip_angle_state1 = angles[6], angles[7]
        hip_angle_state2 = angles[8], angles[9]
        hip_angle_state3 = angles[10], angles[11]
        
        knee_feet_ratio_state1 = angles[12], angles[13]
        feet_shoulder_ratio_state1 = angles[14], angles[15]
        
        knee_feet_ratio_state2 = angles[16], angles[17]
        feet_shoulder_ratio_state2 = angles[18], angles[19]
        
        knee_feet_ratio_state3 = angles[20], angles[21]
        feet_shoulder_ratio_state3 = angles[22], angles[23]
        
        angles_data = {
            "knee_angle_state1": knee_angle_state1,
            "knee_angle_state2": knee_angle_state2,
            "knee_angle_state3": knee_angle_state3,
            "hip_angle_state1": hip_angle_state1,
            "hip_angle_state2": hip_angle_state2,
            "hip_angle_state3": hip_angle_state3,
            "knee_feet_ratio_state1": knee_feet_ratio_state1,
            "feet_shoulder_ratio_state1": feet_shoulder_ratio_state1,
            "knee_feet_ratio_state2": knee_feet_ratio_state2,
            "feet_shoulder_ratio_state2": feet_shoulder_ratio_state2,
            "knee_feet_ratio_state3": knee_feet_ratio_state3,
            "feet_shoulder_ratio_state3": feet_shoulder_ratio_state3,
            "state_1_threshold": thresholds[0],
            "state_2_threshold": thresholds[1],
            "state_3_threshold": thresholds[2]
        }
        
        data = {
            "trainer_angles": angles_data,
            "trainer_id": trainer_id,
            "plan_id": plan_id,
            "exercise_id": exercise_id,
        }
        return db.add_trainer_angles(data)
        
        
    elif exercise == "jumping jack":
        jj_instance = JumpingJack("", trainer_video)
        
        thresholds = jj_instance.set_state_thresholds()
        angles = jj_instance.get_trainer_angles()
        
        shoulder_1_r = angles[0], angles[1]
        shoulder_2_r = angles[2], angles[3]
        shoulder_3_r = angles[4], angles[5]
        
        hip_1_r = angles[6], angles[7]
        hip_2_r = angles[8], angles[9]
        hip_3_r = angles[10], angles[11]
        
        knee_1_r = angles[12], angles[13]
        knee_2_r = angles[14], angles[15]
        knee_3_r = angles[16], angles[17]
        
        shoulder_1_l = angles[18], angles[19]
        shoulder_2_l = angles[20], angles[21]
        shoulder_3_l = angles[22], angles[23]
        
        hip_1_l = angles[24], angles[25]
        hip_2_l = angles[26], angles[27]
        hip_3_l = angles[28], angles[29]
        
        knee_1_l = angles[30], angles[31]
        knee_2_l = angles[32], angles[33]
        knee_3_l = angles[34], angles[35]
        
        angles_data = {
            "shoulder_1_r": shoulder_1_r,
            "shoulder_2_r": shoulder_2_r,
            "shoulder_3_r": shoulder_3_r,
            "hip_1_r": hip_1_r,
            "hip_2_r": hip_2_r,
            "hip_3_r": hip_3_r,
            "knee_1_r": knee_1_r,
            "knee_2_r": knee_2_r,
            "knee_3_r": knee_3_r,
            "shoulder_1_l": shoulder_1_l,
            "shoulder_2_l": shoulder_2_l,
            "shoulder_3_l": shoulder_3_l,
            "hip_1_l": hip_1_l,
            "hip_2_l": hip_2_l,
            "hip_3_l": hip_3_l,
            "knee_1_l": knee_1_l,
            "knee_2_l": knee_2_l,
            "knee_3_l": knee_3_l,
            "state_1_threshold": thresholds[0],
            "state_2_threshold": thresholds[1],
            "state_3_threshold": thresholds[2]
        }
        
        data = {
            "trainer_angles": angles_data,
            "trainer_id": trainer_id,
            "plan_id": plan_id,
            "exercise_id": exercise_id,
        }
        return db.add_trainer_angles(data)
        
        
    else:
        raise HTTPException(status_code=404, detail="Exercise not found")


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


@router.post("/add_plan")
async def add_plan(plan_data: dict):
    return db.add_plan(plan_data)

@router.post("/add_plan_exercises")
async def add_plan_exercises(plan_exercises: dict):
    return db.add_plan_exercises(plan_exercises)

@router.get("/get_category_workouts/{category}")
async def get_category_workouts(category: str):
    return db.get_category_workouts(category)