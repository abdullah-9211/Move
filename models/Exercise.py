class Exercise: 
    def __init__(self, workout_id, exercise_id, reps, duration, accuracy):
        self.workout_id = workout_id
        self.exercise_id = exercise_id
        self.reps = reps
        self.duration = duration
        self.accuracy = accuracy
        
        
    def get_workout_id(self):
        return self.workout_id
    
    def set_workout_id(self, workout_id):
        self.workout_id = workout_id