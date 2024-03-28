import cv2
import mediapipe as mp
import numpy as np

mp_drawing = mp.solutions.drawing_utils
mp_pose = mp.solutions.pose

class JumpingJack:
    def __init__(self, client_url, trainer_url):
        self.state1_angle_threshold = [0, 0]
        self.state2_angle_threshold = [0, 0]
        self.state3_angle_threshold = [0, 0]
        
        # Urls
        
        self.client_url = client_url
        self.trainer_url = trainer_url
        
        # Right Side Angles

        self.trainer_shoulder_angle_state1_r = []
        self.trainer_hip_angle_state1_r = []
        self.trainer_knee_angle_state1_r = []

        self.trainer_shoulder_angle_state2_r = []
        self.trainer_hip_angle_state2_r = []
        self.trainer_knee_angle_state2_r= []

        self.trainer_shoulder_angle_state3_r = []
        self.trainer_hip_angle_state3_r = []
        self.trainer_knee_angle_state3_r = []


        # Left Side Angles

        self.trainer_shoulder_angle_state1_l = []
        self.trainer_hip_angle_state1_l = []
        self.trainer_knee_angle_state1_l = []

        self.trainer_shoulder_angle_state2_l = []
        self.trainer_hip_angle_state2_l = []
        self.trainer_knee_angle_state2_l= []

        self.trainer_shoulder_angle_state3_l = []
        self.trainer_hip_angle_state3_l = []
        self.trainer_knee_angle_state3_l = []

        
        self.state = 0
        
        self.leniency = 13
        self.errors = []
        self.error_times = []
        self.error_bool = False
        self.depth_bool = False
        self.visibility_bool = False
        self.reps = 0
        self.client_incorrect = []
        self.trainer_incorrect = []
        self.accuracy = 0
        self.duration = 0
        
        
    def calculate_angle(self, point1, point2, point3):
        point1 = np.array(point1)
        point3 = np.array(point3)
        point2 = np.array(point2)
        
        radians = np.arctan2(point3[1] - point2[1], point3[0] - point2[0]) - np.arctan2(point1[1] - point2[1], point1[0] - point2[0])
        angle = np.abs((radians * 180.0)/np.pi)
        
        if angle > 180.0:
            angle = 360 - angle
            
        return angle
    
    
    
    def set_state_thresholds(self):
        cap = cv2.VideoCapture(self.trainer_url)

        shoulder_angles = []
        i = 0

        with mp_pose.Pose(min_detection_confidence=0.5, min_tracking_confidence=0.5) as pose:
            while cap.isOpened() and i < 110:
                i += 1
                ret, frame = cap.read()
                
                if not ret:
                    break
                
                image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                image.flags.writeable = False
                
                results = pose.process(image)
                image.flags.writeable = True
                
                image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)
                
                try:
                    landmarks = results.pose_landmarks.landmark
                    
                    # Right Keypoints
                    
                    right_elbow = landmarks[mp_pose.PoseLandmark.RIGHT_ELBOW.value].x, landmarks[mp_pose.PoseLandmark.RIGHT_ELBOW.value].y
                    right_shoulder = landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER.value].x, landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER.value].y
                    right_hip = landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value].x, landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value].y
                    
                    
                    # Left Keypoints
                    
                    left_elbow = landmarks[mp_pose.PoseLandmark.LEFT_ELBOW.value].x, landmarks[mp_pose.PoseLandmark.LEFT_ELBOW.value].y
                    left_shoulder = landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value].x, landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value].y
                    left_hip = landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].x, landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].y
                    
                        
                    # Shoulder Angle Calculation
                    
                    right_shoulder_angle = self.calculate_angle(right_hip, right_shoulder, right_elbow)
                    shoulder_angles.append(right_shoulder_angle)
                    
                    left_shoulder_angle = self.calculate_angle(left_hip, left_shoulder, left_elbow)
                    shoulder_angles.append(left_shoulder_angle)
                
                
                except:
                    pass 
                
                
                mp_drawing.draw_landmarks(image, results.pose_landmarks, mp_pose.POSE_CONNECTIONS)
                
                cv2.imshow('Raw Webcam Feed', image)
                
                if cv2.waitKey(10) & 0xFF == ord('q'):
                    break
                
            cap.release()
            cv2.destroyAllWindows()
            
                
        # print min and max angles for elbow

        print("Shoulder Angle: ", min(shoulder_angles), max(shoulder_angles))

        # Set the threshold values for each state

        self.state1_angle_threshold[0] = min(shoulder_angles)
        self.state3_angle_threshold[1] = max(shoulder_angles)

        mid_angle = round((self.state3_angle_threshold[1] + self.state1_angle_threshold[0])/2.0, 1)

        state_mid_1 = round((self.state1_angle_threshold[0] + mid_angle)/2.0, 1)
        state_mid_2 = round((mid_angle + self.state3_angle_threshold[1])/2.0, 1)

        self.state1_angle_threshold[1] = state_mid_1
        self.state2_angle_threshold[0] = state_mid_1
        self.state2_angle_threshold[1] = state_mid_2
        self.state3_angle_threshold[0] = state_mid_2
        
        return self.state1_angle_threshold, self.state2_angle_threshold, self.state3_angle_threshold
        
    
    
    def get_trainer_angles(self):
        cap = cv2.VideoCapture(self.trainer_url)

        r_state = 0
        l_state = 0
        i = 0

        with mp_pose.Pose(min_detection_confidence=0.5, min_tracking_confidence=0.5) as pose:
            while cap.isOpened() and i < 110:
                i += 1
                ret, frame = cap.read()
                
                if not ret:
                    break
                
                image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                image.flags.writeable = False
                
                results = pose.process(image)
                image.flags.writeable = True
                
                image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)
                
                try:
                    landmarks = results.pose_landmarks.landmark
                    
                    # Right Keypoints
                    
                    right_elbow = landmarks[mp_pose.PoseLandmark.RIGHT_ELBOW.value].x, landmarks[mp_pose.PoseLandmark.RIGHT_ELBOW.value].y
                    right_shoulder = landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER.value].x, landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER.value].y
                    right_hip = landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value].x, landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value].y
                    right_knee = landmarks[mp_pose.PoseLandmark.RIGHT_KNEE.value].x, landmarks[mp_pose.PoseLandmark.RIGHT_KNEE.value].y
                    right_ankle = landmarks[mp_pose.PoseLandmark.RIGHT_ANKLE.value].x, landmarks[mp_pose.PoseLandmark.RIGHT_ANKLE.value].y
                    
                    
                    # Left Keypoints
                    
                    left_elbow = landmarks[mp_pose.PoseLandmark.LEFT_ELBOW.value].x, landmarks[mp_pose.PoseLandmark.LEFT_ELBOW.value].y
                    left_shoulder = landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value].x, landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value].y
                    left_hip = landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].x, landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].y
                    left_knee = landmarks[mp_pose.PoseLandmark.LEFT_KNEE.value].x, landmarks[mp_pose.PoseLandmark.LEFT_KNEE.value].y
                    left_ankle = landmarks[mp_pose.PoseLandmark.LEFT_ANKLE.value].x, landmarks[mp_pose.PoseLandmark.LEFT_ANKLE.value].y
                        
                    
                    # Shoulder Angle Calculation and state selection
                    
                    left_shoulder_angle = 0
                    right_shoulder_angle = 0
                    
                    
                    right_shoulder_angle = self.calculate_angle(right_hip, right_shoulder, right_elbow)        
                    left_shoulder_angle = self.calculate_angle(left_hip, left_shoulder, left_elbow)
                    
                    
                    if right_shoulder_angle >= self.state1_angle_threshold[0] and right_shoulder_angle <= self.state1_angle_threshold[1]:
                        r_state = 1
                    elif right_shoulder_angle >= self.state2_angle_threshold[0] and right_shoulder_angle <= self.state2_angle_threshold[1]:
                        r_state = 2
                    elif right_shoulder_angle >= self.state3_angle_threshold[0] and right_shoulder_angle <= self.state3_angle_threshold[1]:
                        r_state = 3
                    else:
                        r_state = 0
                    
                    if left_shoulder_angle >= self.state1_angle_threshold[0] and left_shoulder_angle <= self.state1_angle_threshold[1]:
                        l_state = 1
                    elif left_shoulder_angle >= self.state2_angle_threshold[0] and left_shoulder_angle <= self.state2_angle_threshold[1]:
                        l_state = 2
                    elif left_shoulder_angle >= self.state3_angle_threshold[0] and left_shoulder_angle <= self.state3_angle_threshold[1]:
                        l_state = 3
                    else:
                        l_state = 0
                    
                    
                    if r_state == 1:
                        self.trainer_shoulder_angle_state1_r.append(right_shoulder_angle.round(1))
                    elif r_state == 2:
                        self.trainer_shoulder_angle_state2_r.append(right_shoulder_angle.round(1))
                    elif r_state == 3:
                        self.trainer_shoulder_angle_state3_r.append(right_shoulder_angle.round(1)) 
                    
                    if l_state == 1:
                        self.trainer_shoulder_angle_state1_l.append(left_shoulder_angle.round(1))
                    elif l_state == 2:
                        self.trainer_shoulder_angle_state2_l.append(left_shoulder_angle.round(1))
                    elif l_state == 3:
                        self.trainer_shoulder_angle_state3_l.append(left_shoulder_angle.round(1)) 
                            
                        
                        
                    # Hip Angle Calculation
                    
                    right_hip_angle = 0
                    left_hip_angle = 0
                    
                    right_hip_angle = self.calculate_angle(right_shoulder, right_hip, right_knee)
                    left_hip_angle = self.calculate_angle(left_shoulder, left_hip, left_knee)
                        
                    if r_state == 1:
                        self.trainer_hip_angle_state1_r.append(right_hip_angle.round(1))
                    elif r_state == 2:
                        self.trainer_hip_angle_state2_r.append(right_hip_angle.round(1))
                    elif r_state == 3:
                        self.trainer_hip_angle_state3_r.append(right_hip_angle.round(1))
                    
                    if l_state == 1:
                        self.trainer_hip_angle_state1_l.append(left_hip_angle.round(1))
                    elif l_state == 2:
                        self.trainer_hip_angle_state2_l.append(left_hip_angle.round(1))
                    elif l_state == 3:
                        self.trainer_hip_angle_state3_l.append(left_hip_angle.round(1))
                    
                    
                    # Knee Angle Calculation
                    
                    right_knee_angle = 0
                    left_knee_angle = 0
                    
                    right_knee_angle = self.calculate_angle(right_hip, right_knee, right_ankle)
                    left_knee_angle = self.calculate_angle(left_hip, left_knee, left_ankle)
                                
                    if r_state == 1:
                        self.trainer_knee_angle_state1_r.append(right_knee_angle.round(1))
                    elif r_state == 2:
                        self.trainer_knee_angle_state2_r.append(right_knee_angle.round(1))
                    elif r_state == 3:
                        self.trainer_knee_angle_state3_r.append(right_knee_angle.round(1))
                        
                    if l_state == 1:
                        self.trainer_knee_angle_state1_l.append(left_knee_angle.round(1))
                    elif l_state == 2:
                        self.trainer_knee_angle_state2_l.append(left_knee_angle.round(1))
                    elif l_state == 3:
                        self.trainer_knee_angle_state3_l.append(left_knee_angle.round(1))
                        
                    
                except:
                    pass 
                
                
                mp_drawing.draw_landmarks(image, results.pose_landmarks, mp_pose.POSE_CONNECTIONS)
                
                cv2.imshow('Raw Webcam Feed', image)
                
                if cv2.waitKey(10) & 0xFF == ord('q'):
                    break
                
            cap.release()
            cv2.destroyAllWindows()
            
        return min(self.trainer_shoulder_angle_state1_r), max(self.trainer_shoulder_angle_state1_r), min(self.trainer_shoulder_angle_state2_r), max(self.trainer_shoulder_angle_state2_r), min(self.trainer_shoulder_angle_state3_r), max(self.trainer_shoulder_angle_state3_r), min(self.trainer_hip_angle_state1_r), max(self.trainer_hip_angle_state1_r), min(self.trainer_hip_angle_state2_r), max(self.trainer_hip_angle_state2_r), min(self.trainer_hip_angle_state3_r), max(self.trainer_hip_angle_state3_r), min(self.trainer_knee_angle_state1_r), max(self.trainer_knee_angle_state1_r), min(self.trainer_knee_angle_state2_r), max(self.trainer_knee_angle_state2_r), min(self.trainer_knee_angle_state3_r), max(self.trainer_knee_angle_state3_r), min(self.trainer_shoulder_angle_state1_l), max(self.trainer_shoulder_angle_state1_l), min(self.trainer_shoulder_angle_state2_l), max(self.trainer_shoulder_angle_state2_l), min(self.trainer_shoulder_angle_state3_l), max(self.trainer_shoulder_angle_state3_l), min(self.trainer_hip_angle_state1_l), max(self.trainer_hip_angle_state1_l), min(self.trainer_hip_angle_state2_l), max(self.trainer_hip_angle_state2_l), min(self.trainer_hip_angle_state3_l), max(self.trainer_hip_angle_state3_l), min(self.trainer_knee_angle_state1_l), max(self.trainer_knee_angle_state1_l), min(self.trainer_knee_angle_state2_l), max(self.trainer_knee_angle_state2_l), min(self.trainer_knee_angle_state3_l), max(self.trainer_knee_angle_state3_l)
           
            
    def assess_client(self, shoulder_angle_state1_r, shoulder_angle_state2_r, shoulder_angle_state3_r, hip_angle_state1_r, hip_angle_state2_r, hip_angle_state3_r, knee_angle_state1_r, knee_angle_state2_r, knee_angle_state3_r, shoulder_angle_state1_l, shoulder_angle_state2_l, shoulder_angle_state3_l, hip_angle_state1_l, hip_angle_state2_l, hip_angle_state3_l, knee_angle_state1_l, knee_angle_state2_l, knee_angle_state3_l, state1_angle_threshold, state2_angle_threshold, state3_angle_threshold):
        correct_frames = 0
        incorrect_frames = 0
        
        cap = cv2.VideoCapture(self.client_url)

        self.state = 0
        states_visited = []
        i = 0

        with mp_pose.Pose(min_detection_confidence=0.5, min_tracking_confidence=0.5) as pose:
            while cap.isOpened():
                # cap.set(cv2.CAP_PROP_POS_FRAMES, i)
                # i += 6
                ret, frame = cap.read()
                
                if not ret:
                    break
                
                image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                image.flags.writeable = False
                
                results = pose.process(image)
                image.flags.writeable = True
                
                image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)
                
                try:
                    landmarks = results.pose_landmarks.landmark
                    
                    self.error_bool = False
                    
                    # Get current timestamp of video
                    
                    current_time = cap.get(cv2.CAP_PROP_POS_MSEC)
                    current_time /= 1000.0
                    current_time = round(current_time, 0)
                    
                    # For Right side Points Visibility
                    
                    right_elbow_vis = landmarks[mp_pose.PoseLandmark.RIGHT_ELBOW.value].visibility
                    right_shoulder_vis = landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER.value].visibility
                    right_hip_vis = landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value].visibility
                    right_knee_vis = landmarks[mp_pose.PoseLandmark.RIGHT_KNEE.value].visibility
                    right_wrist_vis = landmarks[mp_pose.PoseLandmark.RIGHT_WRIST.value].visibility
                    right_ankle_vis = landmarks[mp_pose.PoseLandmark.RIGHT_ANKLE.value].visibility
                    
                    right_vis_sum = (right_hip_vis + right_knee_vis + right_ankle_vis + right_elbow_vis + right_wrist_vis + right_shoulder_vis)
                    
                    # For Left side Points Visibility
                    
                    left_elbow_vis = landmarks[mp_pose.PoseLandmark.LEFT_ELBOW.value].visibility
                    left_shoulder_vis = landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value].visibility
                    left_hip_vis = landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].visibility
                    left_knee_vis = landmarks[mp_pose.PoseLandmark.LEFT_KNEE.value].visibility
                    left_wrist_vis = landmarks[mp_pose.PoseLandmark.LEFT_WRIST.value].visibility
                    left_ankle_vis = landmarks[mp_pose.PoseLandmark.LEFT_ANKLE.value].visibility
                    
                    left_vis_sum = (left_hip_vis + left_knee_vis + left_ankle_vis + left_elbow_vis + left_wrist_vis + left_shoulder_vis) 
                    
                    
                    # Right Keypoints
                    
                    right_elbow = landmarks[mp_pose.PoseLandmark.RIGHT_ELBOW.value].x, landmarks[mp_pose.PoseLandmark.RIGHT_ELBOW.value].y
                    right_shoulder = landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER.value].x, landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER.value].y
                    right_wrist = landmarks[mp_pose.PoseLandmark.RIGHT_WRIST.value].x, landmarks[mp_pose.PoseLandmark.RIGHT_WRIST.value].y
                    right_hip = landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value].x, landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value].y
                    right_knee = landmarks[mp_pose.PoseLandmark.RIGHT_KNEE.value].x, landmarks[mp_pose.PoseLandmark.RIGHT_KNEE.value].y
                    right_ankle = landmarks[mp_pose.PoseLandmark.RIGHT_ANKLE.value].x, landmarks[mp_pose.PoseLandmark.RIGHT_ANKLE.value].y
                    
                    # Left Keypoints
                    
                    left_elbow = landmarks[mp_pose.PoseLandmark.LEFT_ELBOW.value].x, landmarks[mp_pose.PoseLandmark.LEFT_ELBOW.value].y
                    left_shoulder = landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value].x, landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value].y
                    left_wrist = landmarks[mp_pose.PoseLandmark.LEFT_WRIST.value].x, landmarks[mp_pose.PoseLandmark.LEFT_WRIST.value].y
                    left_hip = landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].x, landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].y
                    left_knee = landmarks[mp_pose.PoseLandmark.LEFT_KNEE.value].x, landmarks[mp_pose.PoseLandmark.LEFT_KNEE.value].y
                    left_ankle = landmarks[mp_pose.PoseLandmark.LEFT_ANKLE.value].x, landmarks[mp_pose.PoseLandmark.LEFT_ANKLE.value].y
                    
                    
                    # Checking Visibility of Joints
            
                    if abs(right_vis_sum - left_vis_sum) > 1:
                        self.visibility_bool = True
                        if current_time not in self.error_times:
                            self.error_times.append(current_time)
                            self.errors.append("Visibility of Joints not same")
                        self.client_incorrect.append("Make sure all joints are visible, stand facing the camera")
                        self.trainer_incorrect.append("Make sure all joints are visible, stand facing the camera")
                        self.state = 0
                    else:
                        self.visibility_bool = False
                    
                    
                    
                    # Shoulder Angle Calculation
                    
                    r_shoulder_angle = self.calculate_angle(right_hip, right_shoulder, right_elbow)
                    l_shoulder_angle = self.calculate_angle(left_hip, left_shoulder, left_elbow)
                    
                
                    # State Selection
                
                    if (r_shoulder_angle >= state1_angle_threshold[0] and r_shoulder_angle <= state1_angle_threshold[1]) and (l_shoulder_angle >= state1_angle_threshold[0] and l_shoulder_angle <= state1_angle_threshold[1]):
                        self.state = 1
                        states_visited.append(1)
                        
                        if len(states_visited) == 0:
                            states_visited.append(1)
                        elif states_visited.__contains__(1) and states_visited.__contains__(2) and states_visited.__contains__(3):
                            states_visited = []
                            states_visited.append(1)
                            self.depth_bool = False
                            self.reps += 1
                            print("Reps: ", self.reps)
                        elif states_visited.__contains__(1) and states_visited.__contains__(2):
                            states_visited = []
                            if current_time not in self.error_times:
                                self.error_times.append(current_time)
                                self.errors.append("State 3 not visited, hit more depth")
                            self.error_bool = True
                            self.depth_bool = True
                            self.client_incorrect.append("Full range of motion not performed")
                            self.trainer_incorrect.append("Full range of motion not performed")
                            self.reps += 1
                            print("Reps: ", self.reps)
                            
                        
                    elif (r_shoulder_angle >= state2_angle_threshold[0] and r_shoulder_angle <= state2_angle_threshold[1]) and (l_shoulder_angle >= state2_angle_threshold[0] and l_shoulder_angle <= state2_angle_threshold[1]):
                        self.state = 2
                        states_visited.append(2)
                        
                    elif (r_shoulder_angle >= state3_angle_threshold[0] and r_shoulder_angle <= state3_angle_threshold[1]) and (l_shoulder_angle >= state3_angle_threshold[0] and l_shoulder_angle <= state3_angle_threshold[1]):
                        self.state = 3
                        states_visited.append(3)
                    
                    elif ((r_shoulder_angle >= state1_angle_threshold[0] and r_shoulder_angle <= state1_angle_threshold[1]) and (l_shoulder_angle >= state3_angle_threshold[0] and l_shoulder_angle <= state3_angle_threshold[1])) or ((r_shoulder_angle >= state3_angle_threshold[0] and r_shoulder_angle <= state3_angle_threshold[1]) and (l_shoulder_angle >= state1_angle_threshold[0] and l_shoulder_angle <= state1_angle_threshold[1])):
                        
                        self.error_bool = True
                        if current_time not in self.error_times:
                            self.error_times.append(current_time)
                            self.errors.append("Movement of body not in sync")
                        self.client_incorrect.append("Move right and left sides of body in sync")
                        self.trainer_incorrect.append("Move right and left sides of body in sync")
                        self.state = 0
                    
                    elif r_shoulder_angle < (state1_angle_threshold[0] - self.leniency):
                        
                        self.error_bool = True
                        if current_time not in self.error_times:
                            self.error_times.append(current_time)
                            self.errors.append("Right Shoulder Angle too low")
                        self.client_incorrect.append(r_shoulder_angle.round(1))
                        self.trainer_incorrect.append(state1_angle_threshold[0] - self.leniency)
                        self.state = 1
                    
                    elif l_shoulder_angle < (state1_angle_threshold[0] - self.leniency):
                        
                        self.error_bool = True
                        if current_time not in self.error_times:
                            self.error_times.append(current_time)
                            self.errors.append("Left Shoulder Angle too low")
                        self.client_incorrect.append(l_shoulder_angle.round(1))
                        self.trainer_incorrect.append(state1_angle_threshold[0] - self.leniency)
                        self.state = 1
                    
                    elif r_shoulder_angle > (state3_angle_threshold[1] + self.leniency):
                        
                        self.error_bool = True
                        if current_time not in self.error_times:
                            self.error_times.append(current_time)
                            self.errors.append("Right Shoulder Angle too high")
                        self.client_incorrect.append(r_shoulder_angle.round(1))
                        self.trainer_incorrect.append(state3_angle_threshold[1] + self.leniency)
                        self.state = 3
                    
                    elif l_shoulder_angle > (state3_angle_threshold[1] + self.leniency):
                        
                        self.error_bool = True
                        if current_time not in self.error_times:
                            self.error_times.append(current_time)
                            self.errors.append("Left Shoulder Angle too high")
                        self.client_incorrect.append(l_shoulder_angle.round(1))
                        self.trainer_incorrect.append(state3_angle_threshold[1] + self.leniency)
                        self.state = 3
                    
                    
                               
                    # Hip Angle Calculation
                    
                    r_hip_angle = self.calculate_angle(right_shoulder, right_hip, right_knee)
                    l_hip_angle = self.calculate_angle(left_shoulder, left_hip, left_knee)    
                    
                    
                    # Knee Angle Calculation
                    
                    r_knee_angle = self.calculate_angle(right_hip, right_knee, right_ankle)
                    l_knee_angle = self.calculate_angle(left_hip, left_knee, left_ankle)    
                    
                    
                    # Checking Angles according to state
                            
                    trainer_shoulder_min_r = 0
                    trainer_shoulder_max_r = 0
                    
                    trainer_hip_min_r = 0
                    trainer_hip_max_r = 0
                    
                    trainer_knee_min_r = 0
                    trainer_knee_max_r = 0
                    
                    trainer_shoulder_min_l = 0
                    trainer_shoulder_max_l = 0
                    
                    trainer_hip_min_l = 0
                    trainer_hip_max_l = 0
                    
                    trainer_knee_min_l = 0
                    trainer_knee_max_l = 0
                    
                    if self.state == 1:
                        
                        trainer_shoulder_min_r = shoulder_angle_state1_r[0]
                        trainer_shoulder_max_r = shoulder_angle_state1_r[1]
                        
                        trainer_hip_min_r = hip_angle_state1_r[0]
                        trainer_hip_max_r = hip_angle_state1_r[1]
                        
                        trainer_knee_min_r = knee_angle_state1_r[0]
                        trainer_knee_max_r = knee_angle_state1_r[1]
                        
                        trainer_shoulder_min_l = shoulder_angle_state1_l[0]
                        trainer_shoulder_max_l = shoulder_angle_state1_l[1]
                        
                        trainer_hip_min_l = hip_angle_state1_l[0]
                        trainer_hip_max_l = hip_angle_state1_l[1]
                        
                        trainer_knee_min_l = knee_angle_state1_l[0]
                        trainer_knee_max_l = knee_angle_state1_l[1]

                        
                    elif self.state == 2:
                        trainer_shoulder_min_r = shoulder_angle_state2_r[0]
                        trainer_shoulder_max_r = shoulder_angle_state2_r[1]
                        
                        trainer_hip_min_r = hip_angle_state2_r[0]
                        trainer_hip_max_r = hip_angle_state2_r[1]
                        
                        trainer_knee_min_r = knee_angle_state2_r[0]
                        trainer_knee_max_r = knee_angle_state2_r[1]
                        
                        trainer_shoulder_min_l = shoulder_angle_state2_l[0]
                        trainer_shoulder_max_l = shoulder_angle_state2_l[1]
                        
                        trainer_hip_min_l = hip_angle_state2_l[0]
                        trainer_hip_max_l = hip_angle_state2_l[1]
                        
                        trainer_knee_min_l = knee_angle_state2_l[0]
                        trainer_knee_max_l = knee_angle_state2_l[1]

                        
                    elif self.state == 3:
                        trainer_shoulder_min_r = shoulder_angle_state3_r[0]
                        trainer_shoulder_max_r = shoulder_angle_state3_r[1]
                        
                        trainer_hip_min_r = hip_angle_state3_r[0]
                        trainer_hip_max_r = hip_angle_state3_r[1]
                        
                        trainer_knee_min_r = knee_angle_state3_r[0]
                        trainer_knee_max_r = knee_angle_state3_r[1]
                        
                        trainer_shoulder_min_l = shoulder_angle_state3_l[0]
                        trainer_shoulder_max_l = shoulder_angle_state3_l[1]
                        
                        trainer_hip_min_l = hip_angle_state3_l[0]
                        trainer_hip_max_l = hip_angle_state3_l[1]
                        
                        trainer_knee_min_l = knee_angle_state3_l[0]
                        trainer_knee_max_l = knee_angle_state3_l[1]

                        
                    else:
                        trainer_shoulder_min_r = 0
                        trainer_shoulder_max_r = 0
                        
                        trainer_hip_min_r = 0
                        trainer_hip_max_r = 0
                        
                        trainer_knee_min_r = 0
                        trainer_knee_max_r = 0
                        
                        trainer_shoulder_min_l = 0
                        trainer_shoulder_max_l = 0
                        
                        trainer_hip_min_l = 0
                        trainer_hip_max_l = 0
                        
                        trainer_knee_min_l = 0
                        trainer_knee_max_l = 0

                    
                    
                    # Perform checking of errors when user is not in state 0
                    
                    if self.state != 0: 
                        
                                
                        # Right Shoulder angle matching
                        
                        if r_shoulder_angle < (trainer_shoulder_min_r - self.leniency):
                            
                            self.error_bool = True
                            if current_time not in self.error_times:
                                self.error_times.append(current_time)
                                self.errors.append("Right Shoulder Angle too low")
                            self.client_incorrect.append(r_shoulder_angle.round(1))
                            self.trainer_incorrect.append(trainer_shoulder_min_r - self.leniency)
                        elif r_shoulder_angle > (trainer_shoulder_max_r + self.leniency):
                            
                            self.error_bool = True
                            if current_time not in self.error_times:
                                self.error_times.append(current_time)
                                self.errors.append("Right Shoulder Angle too high")
                            self.client_incorrect.append(r_shoulder_angle.round(1))
                            self.trainer_incorrect.append(trainer_shoulder_max_r + self.leniency)
                            
                        # Left Shoulder angle matching
                        
                        if l_shoulder_angle < (trainer_shoulder_min_l - self.leniency):
                            
                            self.error_bool = True
                            if current_time not in self.error_times:
                                self.error_times.append(current_time)
                                self.errors.append("Left Shoulder Angle too low")
                            self.client_incorrect.append(l_shoulder_angle.round(1))
                            self.trainer_incorrect.append(trainer_shoulder_min_l - self.leniency)
                        elif l_shoulder_angle > (trainer_shoulder_max_l + self.leniency):
                            
                            if current_time not in self.error_times:
                                self.error_times.append(current_time)
                                self.errors.append("Left Shoulder Angle too high")
                            self.error_bool = True
                            self.client_incorrect.append(l_shoulder_angle.round(1))
                            self.trainer_incorrect.append(trainer_shoulder_max_l + self.leniency)


                        # Right Hip Angle Matching
                        
                        if r_hip_angle < (trainer_hip_min_r - self.leniency):
                            
                            self.error_bool = True
                            if current_time not in self.error_times:
                                self.error_times.append(current_time)
                                self.errors.append("Right Hip Angle too low")
                            self.client_incorrect.append(r_hip_angle.round(1))
                            self.trainer_incorrect.append(trainer_hip_min_r - self.leniency)
                        elif r_hip_angle > (trainer_hip_max_r + self.leniency):
                            
                            self.error_bool = True
                            if current_time not in self.error_times:
                                self.error_times.append(current_time)
                                self.errors.append("Right Hip Angle too high")
                            self.client_incorrect.append(r_hip_angle.round(1))
                            self.trainer_incorrect.append(trainer_hip_max_r + self.leniency)
                            
                        # Left Hip Angle Matching
                        
                        if l_hip_angle < (trainer_hip_min_l - self.leniency):
                            
                            self.error_bool = True
                            if current_time not in self.error_times:
                                self.error_times.append(current_time)
                                self.errors.append("Left Hip Angle too low")
                            self.client_incorrect.append(l_hip_angle.round(1))
                            self.trainer_incorrect.append(trainer_hip_min_l - self.leniency)
                        elif l_hip_angle > (trainer_hip_max_l + self.leniency):
                            
                            self.error_bool = True
                            if current_time not in self.error_times:
                                self.error_times.append(current_time)
                                self.errors.append("Left Hip Angle too high")
                            self.client_incorrect.append(l_hip_angle.round(1))
                            self.trainer_incorrect.append(trainer_hip_max_l + self.leniency)
                            

                        # Right Knee Angle Matching
                        
                        if r_knee_angle < (trainer_knee_min_r - self.leniency):
                            
                            self.error_bool = True
                            if current_time not in self.error_times:
                                self.error_times.append(current_time)
                                self.errors.append("Right Knee Angle too low")
                            self.client_incorrect.append(r_knee_angle.round(1))
                            self.trainer_incorrect.append(trainer_knee_min_r - self.leniency)
                        elif r_knee_angle > (trainer_knee_max_r + self.leniency):
                            
                            self.error_bool = True
                            if current_time not in self.error_times:
                                self.error_times.append(current_time)
                                self.errors.append("Right Knee Angle too high")   
                            self.client_incorrect.append(r_knee_angle.round(1))
                            self.trainer_incorrect.append(trainer_knee_max_r + self.leniency)
                            
                        # Left Knee Angle Matching
                        
                        if l_knee_angle < (trainer_knee_min_l - self.leniency):
                            
                            self.error_bool = True
                            if current_time not in self.error_times:
                                self.error_times.append(current_time)
                                self.errors.append("Left Knee Angle too low")
                            self.client_incorrect.append(l_knee_angle.round(1))
                            self.trainer_incorrect.append(trainer_knee_min_l - self.leniency)
                        elif l_knee_angle > (trainer_knee_max_l + self.leniency):
                            
                            self.error_bool = True
                            if current_time not in self.error_times:
                                self.error_times.append(current_time)
                                self.errors.append("Left Knee Angle too high")
                            self.client_incorrect.append(l_knee_angle.round(1))
                            self.trainer_incorrect.append(trainer_knee_max_l + self.leniency)
                        
                    
                except:
                    pass 
                
                if self.depth_bool == True:
                    cv2.putText(image, "Increase Depth", (600, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2, cv2.LINE_AA)
                    mp_drawing.draw_landmarks(image, results.pose_landmarks, mp_pose.POSE_CONNECTIONS
                                                , mp_drawing.DrawingSpec(color=(0, 0, 0), thickness=2, circle_radius=2)
                                                , mp_drawing.DrawingSpec(color=(0, 0, 255), thickness=2, circle_radius=2)
                                            )
                else:
                    cv2.putText(image, "Depth Perfect", (600, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2, cv2.LINE_AA)
                    mp_drawing.draw_landmarks(image, results.pose_landmarks, mp_pose.POSE_CONNECTIONS
                                                , mp_drawing.DrawingSpec(color=(0, 0, 0), thickness=2, circle_radius=2)
                                                , mp_drawing.DrawingSpec(color=(0, 255, 0), thickness=2, circle_radius=2)
                                            )
                    
                 
                 
                if self.visibility_bool == True:
                    incorrect_frames += 1.0
                    cv2.putText(image, "Visibility Error", (10, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2, cv2.LINE_AA)
                    mp_drawing.draw_landmarks(image, results.pose_landmarks, mp_pose.POSE_CONNECTIONS
                                                , mp_drawing.DrawingSpec(color=(0, 0, 0), thickness=2, circle_radius=2)
                                                , mp_drawing.DrawingSpec(color=(0, 0, 255), thickness=2, circle_radius=2)
                                            )   
                             
                elif self.error_bool == True:
                    incorrect_frames += 1.0
                    cv2.putText(image, "Error", (10, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2, cv2.LINE_AA)
                    mp_drawing.draw_landmarks(image, results.pose_landmarks, mp_pose.POSE_CONNECTIONS
                                                , mp_drawing.DrawingSpec(color=(0, 0, 0), thickness=2, circle_radius=2)
                                                , mp_drawing.DrawingSpec(color=(0, 0, 255), thickness=2, circle_radius=2)
                                            )
                    
                else:
                    correct_frames += 1.0
                    cv2.putText(image, "No Error", (10, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2, cv2.LINE_AA)
                    mp_drawing.draw_landmarks(image, results.pose_landmarks, mp_pose.POSE_CONNECTIONS
                                                , mp_drawing.DrawingSpec(color=(0, 0, 0), thickness=2, circle_radius=2)
                                                , mp_drawing.DrawingSpec(color=(0, 255, 0), thickness=2, circle_radius=2)
                                            )
                    
                
                
                cv2.imshow('Raw Webcam Feed', image)
                
                if cv2.waitKey(10) & 0xFF == ord('q'):
                    break
                
            fps = cap.get(cv2.CAP_PROP_FPS)
            totalFrames = cap.get(cv2.CAP_PROP_FRAME_COUNT)
            self.duration = totalFrames/fps
            
            cap.release()
            cv2.destroyAllWindows()
        
        self.accuracy = round((correct_frames/(correct_frames + incorrect_frames))*100.0, 1)
        
        return self.reps, self.errors, self.error_times, self.accuracy, int(round(self.duration, 0))
    
            
    def run_process(self):
        thresholds = self.set_state_thresholds()
        angles = self.get_trainer_angles()
        
        shoulder_1_r = angles[0], angles[1]
        shoulder_2_r = angles[2], angles[3]
        shoulder_3_r = angles[4], angles[5]
        
        hip_1_r = angles[6], angles[7]
        hip_2_r = angles[8], angles[9]
        hip_3_r = angles[10], angles[11]
        
        knee_1_r = angles[12], angles[13]
        knee_2_r = angles[14], angles[15]
        knee_3_r = angles[16], angles[17]
        
        shoulder_1_l = angles[18], angles[19]
        shoulder_2_l = angles[20], angles[21]
        shoulder_3_l = angles[22], angles[23]
        
        hip_1_l = angles[24], angles[25]
        hip_2_l = angles[26], angles[27]
        hip_3_l = angles[28], angles[29]
        
        knee_1_l = angles[30], angles[31]
        knee_2_l = angles[32], angles[33]
        knee_3_l = angles[34], angles[35]
        
        return self.assess_client(shoulder_1_r, shoulder_2_r, shoulder_3_r, hip_1_r, hip_2_r, hip_3_r, knee_1_r, knee_2_r, knee_3_r, shoulder_1_l, shoulder_2_l, shoulder_3_l, hip_1_l, hip_2_l, hip_3_l, knee_1_l, knee_2_l, knee_3_l, thresholds[0], thresholds[1], thresholds[2])
    
    
if __name__ == "__main__":
    trainer_url = "./sample_videos/Abdullah_Umar.mp4"
    client_url = "./sample_videos/umar_jack.mp4"

    jj = JumpingJack(client_url, trainer_url)
    
    print(jj.set_state_thresholds())