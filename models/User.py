class User:
    def __init__(self, email, first_name, last_name, phone, dob, password, gender, user_type, goal_id):
        self.email = email
        self.first_name = first_name
        self.last_name = last_name
        self.phone = phone
        self.dob = dob
        self.password = password
        self.gender = gender
        if user_type == "trainer":
            self.user_type = "trainer"
        elif user_type == "client":
            self.user_type = "client"
            self.goal_id = goal_id
        else:
            raise Exception("User type must be either 'trainer' or 'client'")