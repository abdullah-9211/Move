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