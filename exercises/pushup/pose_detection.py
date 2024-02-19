import cv2
import mediapipe as mp
import numpy as np

mp_drawing = mp.solutions.drawing_utils
mp_pose = mp.solutions.pose

class Pushup:
    def __init__(self, client_url, trainer_url):
        self.state1_angle_threshold = [0, 0]
        self.state2_angle_threshold = [0, 0]
        self.state3_angle_threshold = [0, 0]
        
        self.client_url = client_url
        self.trainer_url = trainer_url
        
        self.trainer_elbow_angle_state1 = []
        self.trainer_shoulder_angle_state1 = []
        self.trainer_hip_angle_state1 = []
        self.trainer_knee_angle_state1 = []
        self.trainer_elbow_angle_state2 = []
        self.trainer_shoulder_angle_state2 = []
        self.trainer_hip_angle_state2 = []
        self.trainer_knee_angle_state2 = []
        self.trainer_elbow_angle_state3 = []
        self.trainer_shoulder_angle_state3 = []
        self.trainer_hip_angle_state3 = []
        self.trainer_knee_angle_state3 = []
        
        self.state = 0
        
        self.leniency = 21
        self.errors = []
        self.error_times = []
        self.error_bool = False
        self.depth_bool = False
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

        elbow_angles = []

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
                    
                    right_elbow = landmarks[mp_pose.PoseLandmark.RIGHT_ELBOW.value].x, landmarks[mp_pose.PoseLandmark.RIGHT_ELBOW.value].y
                    right_shoulder = landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER.value].x, landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER.value].y
                    right_wrist = landmarks[mp_pose.PoseLandmark.RIGHT_WRIST.value].x, landmarks[mp_pose.PoseLandmark.RIGHT_WRIST.value].y
                    
                    right_vis_sum = (right_hip_vis + right_knee_vis + right_ankle_vis + right_elbow_vis + right_wrist_vis + right_shoulder_vis)
                    
                    # Left Keypoints
                    
                    left_elbow = landmarks[mp_pose.PoseLandmark.LEFT_ELBOW.value].x, landmarks[mp_pose.PoseLandmark.LEFT_ELBOW.value].y
                    left_shoulder = landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value].x, landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value].y
                    left_wrist = landmarks[mp_pose.PoseLandmark.LEFT_WRIST.value].x, landmarks[mp_pose.PoseLandmark.LEFT_WRIST.value].y  
                    
                    # Elbow Angle Calculation
                    
                    if right_vis_sum >= left_vis_sum:
                        elbow_angle = self.calculate_angle(right_shoulder, right_elbow, right_wrist)
                        elbow_angles.append(elbow_angle.round(1))
                    else:
                        elbow_angle = self.calculate_angle(left_shoulder, left_elbow, left_wrist)
                        elbow_angles.append(elbow_angle.round(1))
                        
                except:
                    pass 
                
                
                mp_drawing.draw_landmarks(image, results.pose_landmarks, mp_pose.POSE_CONNECTIONS)
                
                cv2.imshow('Raw Webcam Feed', image)
                
                if cv2.waitKey(10) & 0xFF == ord('q'):
                    break
                
            cap.release()
            cv2.destroyAllWindows()
            
        # Set the threshold values for each state

        self.state3_angle_threshold[0] = min(elbow_angles)
        self.state1_angle_threshold[1] = max(elbow_angles)

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
                    
                        
                    
                    # Elbow Angle Calculation and state selection
                    
                    elbow_angle = 0
                    
                    if right_vis_sum >= left_vis_sum:
                        elbow_angle = self.calculate_angle(right_shoulder, right_elbow, right_wrist)
                    else:
                        elbow_angle = self.calculate_angle(left_shoulder, left_elbow, left_wrist)  
                    
                    
                    if elbow_angle >= self.state1_angle_threshold[0] and elbow_angle <= self.state1_angle_threshold[1]:
                        self.state = 1
                    elif elbow_angle >= self.state2_angle_threshold[0] and elbow_angle <= self.state2_angle_threshold[1]:
                        self.state = 2
                    elif elbow_angle >= self.state3_angle_threshold[0] and elbow_angle <= self.state3_angle_threshold[1]:
                        self.state = 3
                    else:
                        self.state = 0
                            
                    if self.state == 1:
                        self.trainer_elbow_angle_state1.append(elbow_angle.round(1))
                    elif self.state == 2:
                        self.trainer_elbow_angle_state2.append(elbow_angle.round(1))
                    elif self.state == 3:
                        self.trainer_elbow_angle_state3.append(elbow_angle.round(1))
                    
                        
                    # Shoulder Angle Calculation
                    
                    shoulder_angle = 0
                    
                    if right_vis_sum >= left_vis_sum:
                        shoulder_angle = self.calculate_angle(right_hip, right_shoulder, right_elbow)
                    else:
                        shoulder_angle = self.calculate_angle(left_hip, left_shoulder, left_elbow)
                        
                    if self.state == 1:
                        self.trainer_shoulder_angle_state1.append(shoulder_angle.round(1))
                    elif self.state == 2:
                        self.trainer_shoulder_angle_state2.append(shoulder_angle.round(1))
                    elif self.state == 3:
                        self.trainer_shoulder_angle_state3.append(shoulder_angle.round(1)) 
                    
                        
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
                    
                    # Knee Angle Calculation
                    
                    knee_angle = 0
                    
                    if right_vis_sum >= left_vis_sum:
                        knee_angle = self.calculate_angle(right_hip, right_knee, right_ankle)
                    else:
                        knee_angle = self.calculate_angle(left_hip, left_knee, left_ankle)
                                
                    if self.state == 1:
                        self.trainer_knee_angle_state1.append(knee_angle.round(1))
                    elif self.state == 2:
                        self.trainer_knee_angle_state2.append(knee_angle.round(1))
                    elif self.state == 3:
                        self.trainer_knee_angle_state3.append(knee_angle.round(1))
                    
                    
                except:
                    pass 
                
                
                mp_drawing.draw_landmarks(image, results.pose_landmarks, mp_pose.POSE_CONNECTIONS)
                
                cv2.imshow('Raw Webcam Feed', image)
                
                if cv2.waitKey(10) & 0xFF == ord('q'):
                    break
                
            cap.release()
            cv2.destroyAllWindows()
            
        return min(self.trainer_elbow_angle_state1), max(self.trainer_elbow_angle_state1), min(self.trainer_elbow_angle_state2), max(self.trainer_elbow_angle_state2), min(self.trainer_elbow_angle_state3), max(self.trainer_elbow_angle_state3), min(self.trainer_shoulder_angle_state1), max(self.trainer_shoulder_angle_state1), min(self.trainer_shoulder_angle_state2), max(self.trainer_shoulder_angle_state2), min(self.trainer_shoulder_angle_state3), max(self.trainer_shoulder_angle_state3), min(self.trainer_hip_angle_state1), max(self.trainer_hip_angle_state1), min(self.trainer_hip_angle_state2), max(self.trainer_hip_angle_state2), min(self.trainer_hip_angle_state3), max(self.trainer_hip_angle_state3), min(self.trainer_knee_angle_state1), max(self.trainer_knee_angle_state1), min(self.trainer_knee_angle_state2), max(self.trainer_knee_angle_state2), min(self.trainer_knee_angle_state3), max(self.trainer_knee_angle_state3)
            
            
    def assess_client(self, elbow_state1, elbow_state2, elbow_state3, shoulder_state1, shoulder_state2, shoulder_state3, hip_state1, hip_state2, hip_state3, knee_state1, knee_state2, knee_state3, state_1_threshold, state_2_threshold, state_3_threshold):
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
                    
                    
                    
                    # Elbow Angle Calculation
                    
                    
                    if right_vis_sum >= left_vis_sum:
                        elbow_angle = self.calculate_angle(right_shoulder, right_elbow, right_wrist)
                    else:
                        elbow_angle = self.calculate_angle(left_shoulder, left_elbow, left_wrist)
                    
                
                # State Selection
                
                    if elbow_angle >= state_1_threshold[0] and elbow_angle <= state_1_threshold[1]:
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
                        
                    elif elbow_angle >= state_2_threshold[0] and elbow_angle <= state_2_threshold[1]:
                        self.state = 2
                        states_visited.append(2)
                        
                    elif elbow_angle >= state_3_threshold[0] and elbow_angle <= state_3_threshold[1]:
                        self.state = 3
                        states_visited.append(3)
                    else:
                        self.state = 0
                        states_visited.append(0)
                    
                            
                    # Shoulder Angle Calculation
                    
                    if right_vis_sum >= left_vis_sum:
                        shoulder_angle = self.calculate_angle(right_hip, right_shoulder, right_elbow)
                    else:
                        shoulder_angle = self.calculate_angle(left_hip, left_shoulder, left_elbow)
                
                               
                    # Hip Angle Calculation
                    
                    if right_vis_sum >= left_vis_sum:
                        hip_angle = self.calculate_angle(right_shoulder, right_hip, right_knee)
                    else:
                        hip_angle = self.calculate_angle(left_shoulder, left_hip, left_knee)
                        
                    
                    
                    # Knee Angle Calculation
                    
                    
                    if right_vis_sum >= left_vis_sum:
                        knee_angle = self.calculate_angle(right_hip, right_knee, right_ankle)
                    else:
                        knee_angle = self.calculate_angle(left_hip, left_knee, left_ankle)
                    
                    
                    # Checking Angles according to state
                    
                    trainer_elbow_min = 0
                    trainer_elbow_max = 0
                    
                    trainer_shoulder_min = 0
                    trainer_shoulder_max = 0
                    
                    trainer_hip_min = 0
                    trainer_hip_max = 0
                    
                    trainer_knee_min = 0
                    trainer_knee_max = 0
                    
                    if self.state == 1:
                        trainer_elbow_min = elbow_state1[0]
                        trainer_elbow_max = elbow_state1[1]
                        
                        trainer_shoulder_min = shoulder_state1[0]
                        trainer_shoulder_max = shoulder_state1[1]
                        
                        trainer_hip_min = hip_state1[0]
                        trainer_hip_max = hip_state1[1]
                        
                        trainer_knee_min = knee_state1[0]
                        trainer_knee_max = knee_state1[1]

                        
                    elif self.state == 2:
                        trainer_elbow_min = elbow_state2[0]
                        trainer_elbow_max = elbow_state2[1]
                        
                        trainer_shoulder_min = shoulder_state2[0]
                        trainer_shoulder_max = shoulder_state2[1]
                        
                        trainer_hip_min = hip_state2[0]
                        trainer_hip_max = hip_state2[1]
                        
                        trainer_knee_min = knee_state2[0]
                        trainer_knee_max = knee_state2[1]
                        
                    elif self.state == 3:
                        trainer_elbow_min = elbow_state3[0]
                        trainer_elbow_max = elbow_state3[1]
                        
                        trainer_shoulder_min = shoulder_state3[0]
                        trainer_shoulder_max = shoulder_state3[1]
                        
                        trainer_hip_min = hip_state3[0]
                        trainer_hip_max = hip_state3[1]
                        
                        trainer_knee_min = knee_state3[0]
                        trainer_knee_max = knee_state3[1]
                        
                    else:
                        trainer_elbow_min = 0
                        trainer_elbow_max = 0
                        
                        trainer_shoulder_min = 0
                        trainer_shoulder_max = 0
                        
                        trainer_hip_min = 0
                        trainer_hip_max = 0
                        
                        trainer_knee_min = 0
                        trainer_knee_max = 0
                    
                    
                    # Perform checking of errors when user is not in state 0
                    
                    if self.state != 0: 
                        
                        # Elbow angle matching
                    
                        if elbow_angle < (trainer_elbow_min - self.leniency):
                            self.errors.append("Bend less, elbow too low")
                            self.error_times.append(current_time)
                            self.error_bool = True
                            self.client_incorrect.append(elbow_angle.round(1))
                            self.trainer_incorrect.append(trainer_elbow_min - self.leniency)
                        elif elbow_angle > (trainer_elbow_max + self.leniency):
                            self.errors.append("Bend elbow more, too straight")
                            self.error_times.append(current_time)
                            self.error_bool = True
                            self.client_incorrect.append(elbow_angle.round(1))
                            self.trainer_incorrect.append(trainer_elbow_max + self.leniency)
                        
                        
                        
                        # Shoulder angle matching
                        
                        if shoulder_angle < (trainer_shoulder_min - self.leniency):
                            self.errors.append("Elbows too close to body, spread them apart more")
                            self.error_times.append(current_time)
                            self.error_bool = True
                            self.client_incorrect.append(shoulder_angle.round(1))
                            self.trainer_incorrect.append(trainer_shoulder_min - self.leniency)
                        elif shoulder_angle > (trainer_shoulder_max + self.leniency):
                            self.errors.append("Elbows too far apart, bring closer to body")
                            self.error_times.append(current_time)
                            self.error_bool = True
                            self.client_incorrect.append(shoulder_angle.round(1))
                            self.trainer_incorrect.append(trainer_shoulder_max + self.leniency)
                        
                        
                        
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
        
        elbow_state1 = (angles[0], angles[1])
        elbow_state2 = (angles[2], angles[3])
        elbow_state3 = (angles[4], angles[5])
        
        shoulder_state1 = (angles[6], angles[7])
        shoulder_state2 = (angles[8], angles[9])
        shoulder_state3 = (angles[10], angles[11])
        
        hip_state1 = (angles[12], angles[13])
        hip_state2 = (angles[14], angles[15])
        hip_state3 = (angles[16], angles[17])
        
        knee_state1 = (angles[18], angles[19])
        knee_state2 = (angles[20], angles[21])
        knee_state3 = (angles[22], angles[23])
        
        return self.assess_client(elbow_state1, elbow_state2, elbow_state3, shoulder_state1, shoulder_state2, shoulder_state3, hip_state1, hip_state2, hip_state3, knee_state1, knee_state2, knee_state3, thresholds[0], thresholds[1], thresholds[2])
        
    
if __name__ == "__main__":
    client_url = "./sample_videos/leena_footage.mp4"
    trainer_url = "./sample_videos/abdullahumarig1@gmail.com_2.mp4"
    
    pushup = Pushup(client_url, trainer_url)

    print(pushup.run_process())