# Entrypoint for the application
from fastapi import FastAPI
from database.connection import connect

app = FastAPI()

def get_supabase_client():
    return connect()