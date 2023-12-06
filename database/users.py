from database.connection import connect
from models import User, Goal

def add_user(user: User):
    client = connect()
    try:
        response = client.table("Users").insert([{"email": user.email, "first_name": user.first_name, "last_name": user.last_name, "phone_number": user.phone, "dob": user.dob, "password": user.password, "gender": user.gender, "user_type": user.user_type, "goal_id": user.goal_id}]).execute()
        response = dict(response)
        return response["data"][0]["id"]
    except Exception as e:
        print("\n\nError inserting user into database: ", e)
        
def add_goal(goal: Goal):
    client = connect()
    try:
        response = client.table("Goals").insert([{"weight": goal.weight, "height": goal.height, "goal": goal.goal_txt}]).execute()
        response = dict(response)
        return response["data"][0]["id"]
    except Exception as e:
        print("\n\nError inserting goal into database: ", e)
        

def get_users():
    client = connect()
    print("Good connect") 
    try:
        res = client.table("Users").select("*").execute()
        res = dict(res)
        return res["data"]
    except Exception as e:
        print("\n\nError retrieving users, Exception Thrown: \n\n", e)
  
        
def get_user_with_id(id):
    client = connect() 
    try:
        res = client.table("Users").select("*").eq("id", id).execute()
        res = dict(res)
        return res["data"][0]
    except Exception as e:
        print("\n\nError retrieving user, Exception Thrown: \n\n", e)
        
def get_user_with_email(email: str):
    client = connect() 
    try:
        res = client.table("Users").select("*").eq("email", email).execute()
        res = dict(res)
        return res["data"][0]
    except Exception as e:
        print("\n\nError retrieving user, Exception Thrown: \n\n", e)
  
        
def get_goals():
    client = connect() 
    try:
        res = client.table("Goals").select("*").execute()    
        res = dict(res)
        return res["data"]
    except Exception as e:
        print("\n\nError retrieving goals, Exception Thrown: \n\n", e)
        
def get_goal_with_id(id):
    client = connect() 
    try:
        res = client.table("Goals").select("*").eq("id", id).execute()
        res = dict(res)
        return res["data"][0]
    except Exception as e:
        print("\n\nError retrieving goal, Exception Thrown: \n\n", e)