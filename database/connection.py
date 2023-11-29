from supabase import create_client
from models.Workout import Workout

SUPABASE_URL = "https://bwqhkxfnzrvxsiwzyywb.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3cWhreGZuenJ2eHNpd3p5eXdiIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTg4NTU1NjAsImV4cCI6MjAxNDQzMTU2MH0.PjcLzVbrU_kcuiBTaq5zMs-YlkBE9tI2U1OTMgEa-_4"

def connect():
    return create_client(SUPABASE_URL, SUPABASE_KEY)

