from database.connection import connect
from models import User, Goal

# Add user to db
def add_user(user: User):
    client = connect()
    try:
        response = client.table("Users").insert([{"email": user.email, "first_name": user.first_name, "last_name": user.last_name, "phone_number": user.phone, "age": user.age, "password": user.password, "gender": user.gender, "user_type": user.user_type, "goal_id": user.goal_id, "profile_picture": user.profile_picture}]).execute()
        client.auth.sign_up({"email": user.email, "password": user.password})
        response = dict(response)
        return response["data"][0]["id"]
    except Exception as e:
        print("\n\nError inserting user into database: ", e)

# Add goal to DB        
def add_goal(goal: Goal):
    client = connect()
    try:
        response = client.table("Goals").insert([{"weight": goal.weight, "height": goal.height, "goal": goal.goal_txt}]).execute()
        response = dict(response)
        return response["data"][0]["id"]
    except Exception as e:
        print("\n\nError inserting goal into database: ", e)

# Login functionality that matches password with email
def login(email: str, password: str):
    client = connect()
    try:
        res = client.table("Users").select("*").eq("email", email).execute()
        res = dict(res)
        if len(res["data"]) == 0:
            return None
        user = res["data"][0]
        if user["password"] == password:
            # client.auth.sign_in_with_password({"email": email, "password": password})
            if user["user_type"] == 'user':
                res = client.table("Goals").select("*").eq("id", user["goal_id"]).execute()
                res = dict(res)
                user["goal"] = res["data"][0]
            
            return user
        else:
            return None
    except Exception as e:
        print("\n\nError logging in, Exception Thrown: \n\n", e)        

# Get all users from db
def get_users():
    client = connect()
    print("Good connect") 
    try:
        res = client.table("Users").select("*").execute()
        res = dict(res)
        return res["data"]
    except Exception as e:
        print("\n\nError retrieving users, Exception Thrown: \n\n", e)
  
# Get specific user with id        
def get_user_with_id(id):
    client = connect() 
    try:
        res = client.table("Users").select("*").eq("id", id).execute()
        res = dict(res)
        return res["data"][0]
    except Exception as e:
        print("\n\nError retrieving user, Exception Thrown: \n\n", e)

# Get specific user with email        
def get_user_with_email(email: str):
    client = connect() 
    try:
        res = client.table("Users").select("*").eq("email", email).execute()
        res = dict(res)
        return res["data"][0]
    except Exception as e:
        print("\n\nError retrieving user, Exception Thrown: \n\n", e)
  
# Get all goals from db        
def get_goals():
    client = connect() 
    try:
        res = client.table("Goals").select("*").execute()    
        res = dict(res)
        return res["data"]
    except Exception as e:
        print("\n\nError retrieving goals, Exception Thrown: \n\n", e)

# Get specific goal with id        
def get_goal_with_id(id):
    client = connect() 
    try:
        res = client.table("Goals").select("*").eq("id", id).execute()
        res = dict(res)
        return res["data"][0]
    except Exception as e:
        print("\n\nError retrieving goal, Exception Thrown: \n\n", e)

# Get all trainers from db        
def get_all_trainers():
    client = connect()
    try:
        res = client.table("Users").select("*").eq("user_type", "trainer").execute()
        res = dict(res)
        return res["data"]
    except Exception as e:
        print("\n\nError retrieving trainers, Exception Thrown: \n\n", e)
        

def get_trainer_plans(trainer_id):
    client = connect()
    try:
        res = client.table("Workout Plan").select("*").eq("plan_trainer", trainer_id).execute()
        res = dict(res)
        return res["data"]
    except Exception as e:
        print("\n\nError retrieving trainers, Exception Thrown: \n\n", e)
        
        
def get_subscribed(trainer_id):
    client = connect()
    try:
        res = client.table("Trainers Subscribed").select("user_id").eq("trainer_id", trainer_id).execute()
        res = dict(res)
        users = []
        for u in res["data"]:
            user = get_user_with_id(u["user_id"])
            res2 = client.table("Goals").select("*").eq("id", user["goal_id"]).execute()
            res2 = dict(res2)
            user["goal"] = res2["data"][0]
            users.append(user)
        return users
    except Exception as e:
        print("\nError retrieving workouts. Exception Thrown:\n", e)
        
def get_subscribed_ids(trainer_id):
    client = connect()
    try:
        res = client.table("Trainers Subscribed").select("user_id").eq("trainer_id", trainer_id).execute()
        res = dict(res)
        return res["data"]
    except Exception as e:
        print("\nError retrieving workouts. Exception Thrown:\n", e)
        
        
def add_subscription(client_id, trainer_id):
    client = connect()
    try:
        response = client.table("Trainers Subscribed").insert([{"user_id": client_id, "trainer_id": trainer_id}]).execute()
        response = dict(response)
        return response["data"][0]["user_id"]
    except Exception as e:
        print("\n\nError inserting subscription into database: ", e)
        
        
def get_user_profile_info(user_id):
    client = connect()
    try:
        return_dict = {}
        res = client.table("Workout History").select("workout_id", "created_at", "plan_id", "client_id", "duration", "accuracy", "Workout Plan(id, plan_name, plan_trainer, plan_image)").eq("client_id", user_id).execute()
        res = dict(res)
        return_dict["Workouts Performed"] = res["data"]
        return_dict["Number of Workouts"] = len(res["data"])
        
        res = client.table("Trainers Subscribed").select("*").eq("user_id", user_id).execute()
        res = dict(res)
        return_dict["Number of Subscribed"] = len(res["data"])
        return return_dict
    except Exception as e:
        print("\n\nError retrieving user profile info, Exception Thrown: \n\n", e)
        
def get_workout_stats(workout_id):
    client = connect()
    try:
        return_dict = {}
        all_errors = {}
        all_error_times = {}
        exercises = []
        accuracies = []
        exercise_translator = {}
        res = client.table("Workout Exercises Stats").select("exercise_id", "duration", "accuracy", "Exercise(exercise_name)").eq("workout_id", workout_id).execute()
        res = dict(res)
        

        for exercise in res["data"]:
            exercises.append(exercise["Exercise"]["exercise_name"])
            accuracies.append(exercise["accuracy"])
            exercise_translator[exercise["Exercise"]["exercise_name"]] = exercise["exercise_id"]
            exercise_errors = client.table("Workout Exercise Errors").select("error_time", "error").eq("workout_id", workout_id).eq("exercise_id", exercise["exercise_id"]).execute()
            all_errors[exercise["exercise_id"]] = []
            all_error_times[exercise["exercise_id"]] = []
            exercise_errors = dict(exercise_errors)
            for error in exercise_errors["data"]:
                all_errors[exercise["exercise_id"]].append(error["error"])
                all_error_times[exercise["exercise_id"]].append(error["error_time"])
                
        return_dict["errors"] = all_errors
        return_dict["error_times"] = all_error_times
        return_dict["exercises"] = exercises
        return_dict["exerciseNum"] = len(exercises)
        return_dict["exercise_translator"] = exercise_translator
        return_dict["accuracies"] = accuracies
        return return_dict

        
    except Exception as e:
        print("\n\nError retrieving user profile info, Exception Thrown: \n\n", e)