import random
from database.connection import connect
from models import Workout, Exercise

# Get exercise id  based on exercise name
"""
PARAMS - exercise_name: str
RETURNS - id: int
"""
def get_exercise_id(exercise_name):
    client = connect() 
    try: 
        reponse = client.table("Exercise").select("id").eq("exercise_name", exercise_name).execute()
        reponse  = dict(reponse)

        return reponse["data"][0]["id"]
    except Exception as e:
        print("\n\nError retrieving exercise id, Exception Thrown: \n\n", e)


# Add exercise  
"""
PARAMS - exercise: Exercise
RETURNS - workout_id: int
"""
def add_exercise(exercise: Exercise):
    client = connect()
    try:
        response = client.table("Workout Exercises Stats").insert([{
            "workout_id": exercise.workout_id,
            "exercise_id": exercise.exercise_id,
            "reps": exercise.reps, 
            "duration": exercise.duration,
            "accuracy": exercise.accuracy
            }
        ]).execute()
        response = dict(response)
        return response["data"][0]["workout_id"], response["data"][0]["exercise_id"]
    except Exception as e:
        print("\n\nError inserting workout into database: ", e)

# Add workout 
"""
PARAMS - workout: Workout
RETURNS - workout_id: int    
"""
def add_workout(workout: Workout):
    client = connect()
    try:
        response = client.table("Workout History").insert([
            {
                "plan_id": workout.plan_id,
                "client_id": workout.client_id,
                "duration": workout.duration,
                "accuracy": workout.accuracy
            }
        ]).execute()

        response = dict(response)
        return response["data"][0]["workout_id"]
    except Exception as e:
        print("\nError inserting workout into database:", e)


def add_plan(plan):
    client = connect()
    try:
        
        plan_images = [
            'https://www.mindpumpmedia.com/hubfs/Exercise%20for%20more%20than%20just%20aesthetics.png',
            'https://e0.pxfuel.com/wallpapers/995/141/desktop-wallpaper-fitness-yoga-aesthetic.jpg',
            'https://media.istockphoto.com/id/1151770135/photo/athletic-woman-exercising-push-ups-in-a-health-club.jpg?s=612x612&w=0&k=20&c=c28WRyEbYfWmf0BGG6fyWo1Hwe0JxRIswfsywAsZhKI=',
            'https://www.aestheticjunction.com/wp-content/uploads/2014/01/portfolio1.jpg',
            'https://wallpapercave.com/wp/wp7661163.jpg'
        ]
        
        response = client.table("Workout Plan").insert([{
            "plan_trainer": plan["plan_trainer"],
            "workout_type": plan["workout_type"],
            "plan_name": plan["plan_name"],
            "plan_image": plan_images[random.randint(0, len(plan_images) - 1)],
        }]).execute()
        response = dict(response)
        return {"plan_id": response["data"][0]["id"]}
    except Exception as e:
        print("\nError inserting workout plan into database:", e)


def add_plan_exercises(exercise_data):
    client = connect()
    try:
        for exercise in exercise_data["exercise_data"]:
            if exercise["exercise_type"] == 'reps':
                response = client.table("Workout Plan Exercises").insert([{
                    "plan_id": exercise["plan_id"],
                    "exercise_id": get_exercise_id(exercise["exercise_name"]),
                    "reps": exercise["exercise_amount"],
                }]).execute()
            else:
                response = client.table("Workout Plan Exercises").insert([{
                    "plan_id": exercise["plan_id"],
                    "exercise_id": get_exercise_id(exercise["exercise_name"]),
                    "duration": exercise["exercise_amount"],
                }]).execute()
            response = dict(response)
            
        return response["data"][0]["plan_id"]
        
    except Exception as e:
        print("\nError inserting workout plan exercises into database:", e)

# Get workout plans of a trainer
"""
PARAMS - trainer_id: int
RETURNS - workout: Workout
"""

def get_workout_plans(trainer_id):
    client = connect()
    try:
        response = client.table("Workout Plan").select("*").eq("plan_trainer", trainer_id).execute()
        response = dict(response)
        return response["data"]
    except Exception as e:
        print("\nError retrieving workout plans from database:", e)


def get_plans():
    client = connect() 
    try:
        res = client.table("Workout Plan").select("*").execute()
        res = dict(res)
        return res["data"]
    except Exception as e:
        print("\nError retrieving workouts. Exception Thrown:\n", e)

        
def get_plan_by_type(plan_type):
    client = connect()
    try:
        res = client.table("Workout Plan").select("*").eq("workout_type", plan_type).execute()
        res = dict(res)
        return res["data"]
    except Exception as e:
        print("\nError retrieving workouts. Exception Thrown:\n", e)
        
        
def get_plan_exercises(plan_id):
    client = connect()
    try:
        workout_plan_exercises_table = "Workout Plan Exercises"
        res = client.table(workout_plan_exercises_table).select('exercise_id', 'plan_id', 'reps', 'duration', 'Exercise(exercise_name)').eq("plan_id", plan_id).execute()
        res = dict(res)
        
        total_duration = 0
        
        for exercise in res["data"]:
            if exercise["duration"] is not None:
                total_duration += exercise["duration"]
            else:
                total_duration += exercise["reps"] * 2
                
        res["data"][0]["total_duration"] = total_duration
        return res["data"]
        
    except Exception as e:
        print("\nError retrieving workouts. Exception Thrown:\n", e)
        

def get_plan_trainer(trainer_id):
    client = connect()
    try:
        res = client.table("Users").select("*").eq("id", trainer_id).execute()
        res = dict(res)
        return res["data"]
    except Exception as e:
        print("\nError retrieving workouts. Exception Thrown:\n", e)
        

def add_errors(workout_id, exercise_id, errors, error_times):
    client = connect()
    try:
        response = client.table("Workout Exercise Errors").insert([{
            "workout_id": workout_id,
            "exercise_id": exercise_id,
            "error": errors,
            "error_time": error_times
        }]).execute()
        response = dict(response)
        return response["data"][0]["workout_id"]
    except Exception as e:
        print("\n\nError inserting errors into database: ", e)
        
        
def get_category_workouts(category):
    client = connect()
    try:
        res = client.table("Workout Plan").select("*", "Users(*)").eq("workout_type", category).execute()
        res = dict(res)
        
        trainers = []
        for plan in res["data"]:
            trainer = plan["Users"]
            if trainer not in trainers:
                trainers.append(trainer)
                
        if len(res["data"]) > 5:
            res["data"] = random.sample(res["data"], 5)
        
        res["data"][0]["trainers"] = trainers
        
        return res["data"]
    except Exception as e:
        print("\nError retrieving workouts. Exception Thrown:\n", e)