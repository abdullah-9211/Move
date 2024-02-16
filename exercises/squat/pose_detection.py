import cv2
import mediapipe as mp
import math
import numpy as np

mp_drawing = mp.solutions.drawing_utils
mp_pose = mp.solutions.pose

class Squat:
    def __init__(self, client_url, trainer_url):
        self.state1_angle_threshold = [0, 0]
        self.state2_angle_threshold = [0, 0]
        self.state3_angle_threshold = [0, 0]
        
        self.client_url = client_url
        self.trainer_url = trainer_url
        
        self.trainer_hip_angle_state1 = []
        self.trainer_knee_angle_state1 = []
        self.trainer_knee_feet_ratio_state1 = []
        self.trainer_feet_shoulder_ratio_state1 = []

        self.trainer_hip_angle_state2 = []
        self.trainer_knee_angle_state2 = []
        self.trainer_knee_feet_ratio_state2 = []
        self.trainer_feet_shoulder_ratio_state2 = []
        
        self.trainer_hip_angle_state3 = []
        self.trainer_knee_angle_state3 = []
        self.trainer_knee_feet_ratio_state3 = []
        self.trainer_feet_shoulder_ratio_state3 = []

        
        self.state = 0
        
        self.leniency = 8
        self.knee_feet_leniency = 0.25
        self.feet_shoulder_leniency = 0.25
        self.errors = []
        self.error_times = []
        self.error_bool = False
        self.depth_bool = False
        self.reps = 0
        self.client_incorrect = []
        self.trainer_incorrect = []
        self.accuracy = 0
        
        
    def calculate_angle(self, point1, point2, point3):
        point1 = np.array(point1)
        point3 = np.array(point3)
        point2 = np.array(point2)
        
        radians = np.arctan2(point3[1] - point2[1], point3[0] - point2[0]) - np.arctan2(point1[1] - point2[1], point1[0] - point2[0])
        angle = np.abs((radians * 180.0)/np.pi)
        
        if angle > 180.0:
            angle = 360 - angle
            
        return angle
    
    
    def calculate_distance(self, point1, point2):
        distance = math.sqrt((point2[0] - point1[0])**2 + (point2[1] - point1[1])**2)
        return distance
    
    
    
    def set_state_thresholds(self):
        cap = cv2.VideoCapture(self.trainer_url)

        knee_angles = []

        with mp_pose.Pose(min_detection_confidence=0.5, min_tracking_confidence=0.5) as pose:
            while cap.isOpened():
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
                    
                    # For Right side Points Visibility
                    
                    right_elbow_vis = landmarks[mp_pose.PoseLandmark.RIGHT_ELBOW.value].visibility
                    right_shoulder_vis = landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER.value].visibility
                    right_hip_vis = landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value].visibility
                    right_knee_vis = landmarks[mp_pose.PoseLandmark.RIGHT_KNEE.value].visibility
                    right_wrist_vis = landmarks[mp_pose.PoseLandmark.RIGHT_WRIST.value].visibility
                    right_ankle_vis = landmarks[mp_pose.PoseLandmark.RIGHT_ANKLE.value].visibility
                    
                    
                    # For Left side Points Visibility
                    
                    left_elbow_vis = landmarks[mp_pose.PoseLandmark.LEFT_ELBOW.value].visibility
                    left_shoulder_vis = landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value].visibility
                    left_hip_vis = landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].visibility
                    left_knee_vis = landmarks[mp_pose.PoseLandmark.LEFT_KNEE.value].visibility
                    left_wrist_vis = landmarks[mp_pose.PoseLandmark.LEFT_WRIST.value].visibility
                    left_ankle_vis = landmarks[mp_pose.PoseLandmark.LEFT_ANKLE.value].visibility
                    
                    left_vis_sum = (left_hip_vis + left_knee_vis + left_ankle_vis + left_elbow_vis + left_wrist_vis + left_shoulder_vis) 
                    
                    # Right Keypoints
                    
                    right_hip = landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value].x, landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value].y
                    right_knee = landmarks[mp_pose.PoseLandmark.RIGHT_KNEE.value].x, landmarks[mp_pose.PoseLandmark.RIGHT_KNEE.value].y
                    right_ankle = landmarks[mp_pose.PoseLandmark.RIGHT_ANKLE.value].x, landmarks[mp_pose.PoseLandmark.RIGHT_ANKLE.value].y
                    
                    right_vis_sum = (right_hip_vis + right_knee_vis + right_ankle_vis + right_elbow_vis + right_wrist_vis + right_shoulder_vis)
                    
                    # Left Keypoints
                    
                    left_hip = landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].x, landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].y
                    left_knee = landmarks[mp_pose.PoseLandmark.LEFT_KNEE.value].x, landmarks[mp_pose.PoseLandmark.LEFT_KNEE.value].y
                    left_ankle = landmarks[mp_pose.PoseLandmark.LEFT_ANKLE.value].x, landmarks[mp_pose.PoseLandmark.LEFT_ANKLE.value].y
                    
                    # Knee Angle Calculation
                    
                    if right_vis_sum >= left_vis_sum:
                        knee_angle = self.calculate_angle(right_hip, right_knee, right_ankle)
                        knee_angles.append(knee_angle.round(1))
                    else:
                        knee_angle = self.calculate_angle(left_hip, left_knee, left_ankle)
                        knee_angles.append(knee_angle.round(1))
                        
                except:
                    pass 
                
                
                mp_drawing.draw_landmarks(image, results.pose_landmarks, mp_pose.POSE_CONNECTIONS)
                
                cv2.imshow('Raw Webcam Feed', image)
                
                if cv2.waitKey(10) & 0xFF == ord('q'):
                    break
                
            cap.release()
            cv2.destroyAllWindows()
            
        # Set the threshold values for each state

        self.state3_angle_threshold[0] = min(knee_angles)
        self.state1_angle_threshold[1] = max(knee_angles)

        mid_angle = round((self.state3_angle_threshold[0] + self.state1_angle_threshold[1])/2.0, 1)

        state_mid_1 = round((self.state3_angle_threshold[0] + mid_angle)/2.0, 1)
        state_mid_2 = round((mid_angle + self.state1_angle_threshold[1])/2.0, 1)

        self.state3_angle_threshold[1] = state_mid_1
        self.state2_angle_threshold[0] = state_mid_1
        self.state2_angle_threshold[1] = state_mid_2
        self.state1_angle_threshold[0] = state_mid_2
        
        return self.state1_angle_threshold, self.state2_angle_threshold, self.state3_angle_threshold
        
    
    
    def get_trainer_angles(self):
        cap = cv2.VideoCapture(self.trainer_url)

        self.state = 0

        with mp_pose.Pose(min_detection_confidence=0.5, min_tracking_confidence=0.5) as pose:
            while cap.isOpened():
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
                    

                    # Knee Feet Ratio Calculation

                    knee_distance = self.calculate_distance(left_knee, right_knee)
                    feet_distance = self.calculate_distance(left_ankle, right_ankle)
                    

                    
                    trainer_knee_feet_ratio = knee_distance/feet_distance 
                    
                    
                    # Feet Shoulder Ratio Calculation
                    
                    feet_distance = self.calculate_distance(left_ankle, right_ankle)
                    shoulder_distance = self.calculate_distance(left_shoulder, right_shoulder)
                    
                    trainer_feet_shoulder_ratio = feet_distance/shoulder_distance
                    
                      
                    
                    # Knee Angle Calculation and state selection
                    
                    knee_angle = 0
                    
                    if right_vis_sum >= left_vis_sum:
                        knee_angle = self.calculate_angle(right_hip, right_knee, right_ankle)
                    else:
                        knee_angle = self.calculate_angle(left_hip, left_knee, left_ankle)  
                    
                    
                    if knee_angle >= self.state1_angle_threshold[0] and knee_angle <= self.state1_angle_threshold[1]:
                        self.state = 1
                    elif knee_angle >= self.state2_angle_threshold[0] and knee_angle <= self.state2_angle_threshold[1]:
                        self.state = 2
                    elif knee_angle >= self.state3_angle_threshold[0] and knee_angle <= self.state3_angle_threshold[1]:
                        self.state = 3
                    else:
                        self.state = 0
                    
                           
                    if self.state == 1:
                        self.trainer_knee_angle_state1.append(knee_angle.round(1))
                        self.trainer_knee_feet_ratio_state1.append(trainer_knee_feet_ratio)
                        self.trainer_feet_shoulder_ratio_state1.append(trainer_feet_shoulder_ratio)
                    elif self.state == 2:
                        self.trainer_knee_angle_state2.append(knee_angle.round(1))
                        self.trainer_knee_feet_ratio_state2.append(trainer_knee_feet_ratio)
                        self.trainer_feet_shoulder_ratio_state2.append(trainer_feet_shoulder_ratio)
                    elif self.state == 3:
                        self.trainer_knee_angle_state3.append(knee_angle.round(1))
                        self.trainer_knee_feet_ratio_state3.append(trainer_knee_feet_ratio)
                        self.trainer_feet_shoulder_ratio_state3.append(trainer_feet_shoulder_ratio)
                    
                    
                        
                    # Hip Angle Calculation
                    
                    hip_angle = 0
                    
                    if right_vis_sum >= left_vis_sum:
                        hip_angle = self.calculate_angle(right_shoulder, right_hip, right_knee)
                    else:
                        hip_angle = self.calculate_angle(left_shoulder, left_hip, left_knee)
                        
                    if self.state == 1:
                        self.trainer_hip_angle_state1.append(hip_angle.round(1))
                    elif self.state == 2:
                        self.trainer_hip_angle_state2.append(hip_angle.round(1))
                    elif self.state == 3:
                        self.trainer_hip_angle_state3.append(hip_angle.round(1))
                                

                    
                except:
                    pass 
                
                
                mp_drawing.draw_landmarks(image, results.pose_landmarks, mp_pose.POSE_CONNECTIONS)
                
                cv2.imshow('Raw Webcam Feed', image)
                
                if cv2.waitKey(10) & 0xFF == ord('q'):
                    break
                
            cap.release()
            cv2.destroyAllWindows()
            
        
        return min(self.trainer_knee_angle_state1), max(self.trainer_knee_angle_state1), min(self.trainer_knee_angle_state2), max(self.trainer_knee_angle_state2), min(self.trainer_knee_angle_state3), max(self.trainer_knee_angle_state3), min(self.trainer_hip_angle_state1), max(self.trainer_hip_angle_state1), min(self.trainer_hip_angle_state2), max(self.trainer_hip_angle_state2), min(self.trainer_hip_angle_state3), max(self.trainer_hip_angle_state3), min(self.trainer_knee_feet_ratio_state1), max(self.trainer_knee_feet_ratio_state1), min(self.trainer_feet_shoulder_ratio_state1), max(self.trainer_feet_shoulder_ratio_state1), min(self.trainer_knee_feet_ratio_state2), max(self.trainer_knee_feet_ratio_state2), min(self.trainer_feet_shoulder_ratio_state2), max(self.trainer_feet_shoulder_ratio_state2), min(self.trainer_knee_feet_ratio_state3), max(self.trainer_knee_feet_ratio_state3), min(self.trainer_feet_shoulder_ratio_state3), max(self.trainer_feet_shoulder_ratio_state3)   
           
           
            
    def assess_client(self, knee_angle_state1, knee_angle_state2, knee_angle_state3, hip_angle_state1, hip_angle_state2, hip_angle_state3, knee_feet_ratio_state1, feet_shoulder_ratio_state1, knee_feet_ratio_state2, feet_shoulder_ratio_state2, knee_feet_ratio_state3, feet_shoulder_ratio_state3, state1_angle_threshold, state2_angle_threshold, state3_angle_threshold):
        correct_frames = 0
        incorrect_frames = 0
        
        cap = cv2.VideoCapture(self.client_url)

        self.state = 0
        states_visited = []

        with mp_pose.Pose(min_detection_confidence=0.5, min_tracking_confidence=0.5) as pose:
            while cap.isOpened():
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
                    current_time = round(current_time, 1)
                    
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
                    
                    
                    
                    # Knee Angle Calculation and state selection
                    
                    knee_angle = 0
                    
                    if right_vis_sum >= left_vis_sum:
                        knee_angle = self.calculate_angle(right_hip, right_knee, right_ankle)
                    else:
                        knee_angle = self.calculate_angle(left_hip, left_knee, left_ankle)  
                    
                
                # State Selection
                
                    if knee_angle >= state1_angle_threshold[0] and knee_angle <= state1_angle_threshold[1]:
                        self.state = 1
                        states_visited.append(1)
                        
                        if len(states_visited) == 0:
                            states_visited.append(1)
                        elif states_visited.__contains__(1) and states_visited.__contains__(2) and states_visited.__contains__(3):
                            states_visited = []
                            states_visited.append(1)
                            self.depth_bool = False
                            self.reps += 1
                        elif states_visited.__contains__(1) and states_visited.__contains__(2):
                            states_visited = []
                            self.errors.append("Hit more depth, full range of motion not performed")
                            self.error_times.append(current_time)
                            # self.error_bool = True
                            self.depth_bool = True
                            self.state = 0
                            self.client_incorrect.append("Full range of motion not performed")
                            self.trainer_incorrect.append("Full range of motion not performed")
                            self.reps += 1
                        
                    elif knee_angle >= state2_angle_threshold[0] and knee_angle <= state2_angle_threshold[1]:
                        self.state = 2
                        states_visited.append(2)
                        
                    elif knee_angle >= state3_angle_threshold[0] and knee_angle <= state3_angle_threshold[1]:
                        self.state = 3
                        states_visited.append(3)
                    else:
                        self.state = 0
                        states_visited.append(0)
                    
                    
                    # Knee Feet Ratio Calculation
            
                    knee_distance = self.calculate_distance(left_knee, right_knee)
                    feet_distance = self.calculate_distance(left_ankle, right_ankle)
                    user_knee_feet_ratio = knee_distance/feet_distance
                    
                    # Feet Shoulder Ratio Calculation
                    
                    feet_distance = self.calculate_distance(left_ankle, right_ankle)
                    shoulder_distance = self.calculate_distance(left_shoulder, right_shoulder)
                    
                    user_feet_shoulder_ratio = feet_distance/shoulder_distance    
                    
                               
                    # Hip Angle Calculation
                    
                    if right_vis_sum >= left_vis_sum:
                        hip_angle = self.calculate_angle(right_shoulder, right_hip, right_knee)
                    else:
                        hip_angle = self.calculate_angle(left_shoulder, left_hip, left_knee)
                        
                    
                    
                    # Checking Angles according to state
                    
                    trainer_hip_min = 0
                    trainer_hip_max = 0
                    
                    trainer_knee_min = 0
                    trainer_knee_max = 0
                    
                    trainer_feet_shoulder_ratio_min = 0
                    trainer_feet_shoulder_ratio_max = 0
                    
                    trainer_knee_feet_ratio_min = 0
                    trainer_knee_feet_ratio_max = 0
                    
                    if self.state == 1:
                        trainer_hip_min = hip_angle_state1[0]
                        trainer_hip_max = hip_angle_state1[1]
                        
                        trainer_knee_min = knee_angle_state1[0]
                        trainer_knee_max = knee_angle_state1[1]
                        
                        trainer_knee_feet_ratio_min = knee_feet_ratio_state1[0]
                        trainer_knee_feet_ratio_max = knee_feet_ratio_state1[1]
                        
                        trainer_feet_shoulder_ratio_min = feet_shoulder_ratio_state1[0]
                        trainer_feet_shoulder_ratio_max = feet_shoulder_ratio_state1[1]

                        
                    elif self.state == 2:
                        trainer_hip_min = hip_angle_state2[0]
                        trainer_hip_max = hip_angle_state2[1]
                        
                        trainer_knee_min = knee_angle_state2[0]
                        trainer_knee_max = knee_angle_state2[1]
                        
                        trainer_knee_feet_ratio_min = knee_feet_ratio_state2[0]
                        trainer_knee_feet_ratio_max = knee_feet_ratio_state2[1]
                        
                        trainer_feet_shoulder_ratio_min = feet_shoulder_ratio_state2[0]
                        trainer_feet_shoulder_ratio_max = feet_shoulder_ratio_state2[1]

                        
                    elif self.state == 3:
                        trainer_hip_min = hip_angle_state3[0]
                        trainer_hip_max = hip_angle_state3[1]
                        
                        trainer_knee_min = knee_angle_state3[0]
                        trainer_knee_max = knee_angle_state3[1]
                        
                        trainer_knee_feet_ratio_min = knee_feet_ratio_state3[0]
                        trainer_knee_feet_ratio_max = knee_feet_ratio_state3[1]
                        
                        trainer_feet_shoulder_ratio_min = feet_shoulder_ratio_state3[0]
                        trainer_feet_shoulder_ratio_max = feet_shoulder_ratio_state3[1]

                        
                    else:
                        trainer_hip_min = 0
                        trainer_hip_max = 0
                        
                        trainer_knee_min = 0
                        trainer_knee_max = 0
                        
                        trainer_knee_feet_ratio_min = 0
                        trainer_knee_feet_ratio_max = 0
                        
                        trainer_feet_shoulder_ratio_min = 0
                        trainer_feet_shoulder_ratio_max = 0

                    
                    
                    # Perform checking of errors when user is not in state 0
                    
                    if self.state != 0: 
                        
                        
                        # Hip Angle Matching
                        
                        if hip_angle < (trainer_hip_min - self.leniency):
                            self.errors.append("Lower Hips, too lifted")
                            self.error_times.append(current_time)
                            self.error_bool = True
                            self.client_incorrect.append(hip_angle.round(1))
                            self.trainer_incorrect.append(trainer_hip_min - self.leniency)
                        elif hip_angle > (trainer_hip_max + self.leniency):
                            self.errors.append("Raise Hips, too low")
                            self.error_times.append(current_time)
                            self.error_bool = True
                            self.client_incorrect.append(hip_angle.round(1))
                            self.trainer_incorrect.append(trainer_hip_max + self.leniency)


                        # Knee Angle Matching
                        
                        if knee_angle < (trainer_knee_min - self.leniency):
                            self.errors.append("Knees too bent, straighten them")
                            self.error_times.append(current_time)
                            self.error_bool = True
                            self.client_incorrect.append(knee_angle.round(1))
                            self.trainer_incorrect.append(trainer_knee_min - self.leniency)
                        elif knee_angle > (trainer_knee_max + self.leniency):
                            self.errors.append("Knees too straight, bend them more")
                            self.error_times.append(current_time)
                            self.error_bool = True
                            self.client_incorrect.append(knee_angle.round(1))
                            self.trainer_incorrect.append(trainer_knee_max + self.leniency)
                        
                        # Knee Feet Ratio Matching
                
                        if user_knee_feet_ratio < (trainer_knee_feet_ratio_min - self.knee_feet_leniency):
                            self.errors.append("Knees too open")
                            self.error_bool = True
                            self.client_incorrect.append(user_knee_feet_ratio)
                            self.trainer_incorrect.append(trainer_knee_feet_ratio_min - self.knee_feet_leniency)
                        elif user_knee_feet_ratio > (trainer_knee_feet_ratio_max + self.knee_feet_leniency):
                            self.errors.append("Knees too close to one another")
                            self.error_bool = True
                            self.client_incorrect.append(user_knee_feet_ratio)
                            self.trainer_incorrect.append(trainer_knee_feet_ratio_max + self.knee_feet_leniency)
                            
                            
                        # Feet Shoulder Ratio Matching
                        
                        if user_feet_shoulder_ratio < (trainer_feet_shoulder_ratio_min - self.feet_shoulder_leniency):
                            self.errors.append("Feet too close to one another")
                            self.error_bool = True
                            self.client_incorrect.append(user_feet_shoulder_ratio)
                            self.trainer_incorrect.append(trainer_feet_shoulder_ratio_min - self.feet_shoulder_leniency)
                        elif user_feet_shoulder_ratio > (trainer_feet_shoulder_ratio_max + self.feet_shoulder_leniency):
                            self.errors.append("Feet too open")
                            self.error_bool = True
                            self.client_incorrect.append(user_feet_shoulder_ratio)
                            self.trainer_incorrect.append(trainer_feet_shoulder_ratio_max + self.feet_shoulder_leniency)
                        
                    
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
                    
                            
                if self.error_bool == True:
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
                
            cap.release()
            cv2.destroyAllWindows()
        
        self.accuracy = round((correct_frames/(correct_frames + incorrect_frames))*100.0, 1)
        
        return self.reps, self.errors, self.error_times, self.accuracy
            
    def run_process(self):
        thresholds = self.set_state_thresholds()
        angles = self.get_trainer_angles()
        
        knee_angle_state1 = angles[0], angles[1]
        knee_angle_state2 = angles[2], angles[3]
        knee_angle_state3 = angles[4], angles[5]
        
        hip_angle_state1 = angles[6], angles[7]
        hip_angle_state2 = angles[8], angles[9]
        hip_angle_state3 = angles[10], angles[11]
        
        knee_feet_ratio_state1 = angles[12], angles[13]
        feet_shoulder_ratio_state1 = angles[14], angles[15]
        
        knee_feet_ratio_state2 = angles[16], angles[17]
        feet_shoulder_ratio_state2 = angles[18], angles[19]
        
        knee_feet_ratio_state3 = angles[20], angles[21]
        feet_shoulder_ratio_state3 = angles[22], angles[23]
        
        self.reps, self.errors, self.error_times, self.accuracy = self.assess_client(knee_angle_state1, knee_angle_state2, knee_angle_state3, hip_angle_state1, hip_angle_state2, hip_angle_state3, knee_feet_ratio_state1, feet_shoulder_ratio_state1, knee_feet_ratio_state2, feet_shoulder_ratio_state2, knee_feet_ratio_state3, feet_shoulder_ratio_state3, thresholds[0], thresholds[1], thresholds[2])
        
        return self.reps, self.errors, self.error_times, self.accuracy
    
    
if __name__ == "__main__":
    client_url = "./sample_videos/raheel_potrait.mp4"
    trainer_url = "./sample_videos/abdullah_potrait.mp4"

    squat = Squat(client_url, trainer_url)
    
    print(squat.run_process())