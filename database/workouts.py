from database.connection import connect
from models.Workout import Workout

def add_workout(workout: Workout):
    client = connect()
    try:
        response = client.table("workouts").insert([{"plan_id": workout.plan_id, "client_id": workout.client_id, "duration": workout.duration, "accuracy": workout.accuracy}]).execute()
        if response["status_code"] != 201:
            raise Exception("\n\nError inserting workout")
        else:
            return response["data"][0]["id"]
    except Exception as e:
        print("\n\nError inserting workout into database: ", e)
        