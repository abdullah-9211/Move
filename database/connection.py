from supabase import create_client
from models.Workout import Workout

SUPABASE_URL = "https://trnbkhpzdbzeyvhzfxni.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRybmJraHB6ZGJ6ZXl2aHpmeG5pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDc1OTQ3OTQsImV4cCI6MjAyMzE3MDc5NH0.2ggtI5cUFsSkz5rkJ6Ah7HeUqbgvK36SXWXpYQcSn4E"

def connect():
    return create_client(SUPABASE_URL, SUPABASE_KEY)