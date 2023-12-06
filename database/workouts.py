from database.connection import connect
from models import Workout, Exercise

def add_exercise(exercise: Exercise):
    client = connect()
    try:
        response = client.table("Workout Exercises Stats").insert([{"workout_id": exercise.workout_id, "exercise_id": exercise.exercise_id, "reps": exercise.reps, "duration": exercise.duration, "accuracy": exercise.accuracy}]).execute()
        if response["status_code"] != 201:
            raise Exception("\n\nError inserting workout")
        else:
            return response["data"][0]["id"]
    except Exception as e:
        print("\n\nError inserting workout into database: ", e)
        
def add_workout(workout: Workout):
    client = connect()
    try:
        response = client.table("Workout History").insert([{"plan_id": workout.plan_id, "client_id": workout.client_id, "duration": workout.duration, "accuracy": workout.accuracy}]).execute()
        if response["status_code"] != 201:
            raise Exception("\n\nError inserting workout")
        else:
            return response["data"][0]["id"]
    except Exception as e:
        print("\n\nError inserting workout into database: ", e)
        

def get_workout():
    client = connect() 
    try:
        res = client.table("workouts").select("*").execute()
        if res["status_code"] != 201:
            raise Exception("\n\nError retrieving workout information")
        else:
            # embed response in workout class and return in response body
            return 
    except Exception as e:
        print("\n\nError retrieving workouts, Exception Thrown: \n\n", e)
        
def get_workout_with_id(id):
    client = connect() 
    try:
        res = client.table("workouts").select("*").eq("workout_id", id).execute()
        if res["status_code"] != 201:
            raise Exception("\n\nError retrieving workout information")
        else:
            # embed response in workout class and return in response body
            return 
    except Exception as e:
        print("\n\nError retrieving workouts, Exception Thrown: \n\n", e)