from fastapi import APIRouter, HTTPException

from models.User import User
from models.Goal import Goal
import database.users as db

router = APIRouter()

# ===================================================
#                   User Endpoints
# ===================================================


@router.post("/add_user")
async def add_user(user_data: dict):
    email = user_data.get("email")
    first_name = user_data.get("first_name")
    last_name = user_data.get("last_name")
    phone_number = user_data.get("phone_number")
    age = user_data.get("age")
    password = user_data.get("password")
    gender = user_data.get("gender")
    user_type = user_data.get("user_type")
    goal_id = user_data.get("goal_id")
    
    if goal_id == "None":
        goal_id = None
    new_user = User(email, first_name, last_name, phone_number, age, password, gender, user_type, goal_id)
    user_id = db.add_user(new_user)
    
    return {"user_id": user_id}

@router.post("/add_goal")
async def add_goal(goal_data: dict):
    weight = goal_data.get("weight")
    height = goal_data.get("height")
    goal = goal_data.get("goal")
    
    new_goal = Goal(weight, height, goal)
    goal_id = db.add_goal(new_goal)
    
    return {"goal_id": goal_id}

@router.post("/login")
async def login(login_data: dict):
    email = login_data.get("email")
    password = login_data.get("password")
    
    user = db.login(email, password)
    if user == None:
        return {"user": "None"}
    else:
        return {"user": user}

@router.get("/get_users")
async def get_users():
    return db.get_users()
    
@router.get("/get_user_with_id")
async def get_user_with_id(id: int):
    return db.get_user_with_id(id)

@router.get("/get_goals")
async def get_goals():
    return db.get_goals()

@router.get("/get_goal_with_id")
async def get_goal_with_id(id: int):
    return db.get_goal_with_id(id)

@router.get("/get_user_with_email")
async def get_user_with_email(email: str):
    return db.get_user_with_email(email)


# ===================================================
#                   Trainer Endpoints
# ===================================================

@router.get("/get-trainers")
async def get_all_trainers():
    return db.get_all_trainers()


@router.get("/get-trainer-plans/{trainer_id}")
async def get_trainer_plans(trainer_id: int):
    return db.get_trainer_plans(trainer_id)