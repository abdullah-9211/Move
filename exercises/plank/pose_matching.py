import cv2
import mediapipe as mp
import numpy as np
mp_drawing = mp.solutions.drawing_utils
mp_pose = mp.solutions.pose

class Plank:
    def __init__(self, trainer_video_url, client_video_url):
        self.trainer_elbow_angle = []
        self.trainer_shoulder_angle = []
        self.trainer_hip_angle = []
        self.trainer_knee_angle = []
        self.trainer_video_url = trainer_video_url
        self.client_video_url = client_video_url
        self.leniency = 23
        self.errors = []
        self.error_times = []
        self.error_bool = False
        self.elbow_angle = 0
        self.shoulder_angle = 0
        self.hip_angle = 0
        self.knee_angle = 0
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
    
    def get_trainer_angles(self):
        cap = cv2.VideoCapture(self.trainer_video_url)
        i = 0

        with mp_pose.Pose(min_detection_confidence=0.5, min_tracking_confidence=0.5) as pose:
            while cap.isOpened() or i < 150:
                # cap.set(cv2.CAP_PROP_POS_FRAMES, i)
                i += 10
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
                    right_hip = landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value].x, landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value].y
                    right_knee = landmarks[mp_pose.PoseLandmark.RIGHT_KNEE.value].x, landmarks[mp_pose.PoseLandmark.RIGHT_KNEE.value].y
                    right_ankle = landmarks[mp_pose.PoseLandmark.RIGHT_ANKLE.value].x, landmarks[mp_pose.PoseLandmark.RIGHT_ANKLE.value].y
                    
                    right_vis_sum = (right_hip_vis + right_knee_vis + right_ankle_vis + right_elbow_vis + right_wrist_vis + right_shoulder_vis)
                    
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
                        self.trainer_elbow_angle.append(elbow_angle.round(1))
                    else:
                        elbow_angle = self.calculate_angle(left_shoulder, left_elbow, left_wrist)
                        self.trainer_elbow_angle.append(elbow_angle.round(1))
                         
                        
                    # Shoulder Angle Calculation
                    
                    if right_vis_sum >= left_vis_sum:
                        shoulder_angle = self.calculate_angle(right_hip, right_shoulder, right_elbow)
                        self.trainer_shoulder_angle.append(shoulder_angle.round(1))
                    else:
                        shoulder_angle = self.calculate_angle(left_hip, left_shoulder, left_elbow)
                        self.trainer_shoulder_angle.append(shoulder_angle.round(1))
                
                        
                        
                    # Hip Angle Calculation
                    
                    if right_vis_sum >= left_vis_sum:
                        hip_angle = self.calculate_angle(right_shoulder, right_hip, right_knee)
                        self.trainer_hip_angle.append(hip_angle.round(1))
                    else:
                        hip_angle = self.calculate_angle(left_shoulder, left_hip, left_knee)
                        self.trainer_hip_angle.append(hip_angle.round(1))
                        
                    
                    # Knee Angle Calculation
                    
                    
                    if right_vis_sum >= left_vis_sum:
                        knee_angle = self.calculate_angle(right_hip, right_knee, right_ankle)
                        self.trainer_knee_angle.append(knee_angle.round(1))
                    else:
                        knee_angle = self.calculate_angle(left_hip, left_knee, left_ankle)
                        self.trainer_knee_angle.append(knee_angle.round(1))
                                
                    
                    
                except:
                    pass 
                
                
                mp_drawing.draw_landmarks(image, results.pose_landmarks, mp_pose.POSE_CONNECTIONS)
                
                cv2.imshow('Raw Webcam Feed', image)
                
                if cv2.waitKey(10) & 0xFF == ord('q'):
                    break
                
            cap.release()
            cv2.destroyAllWindows()
            
        return min(self.trainer_elbow_angle), max(self.trainer_elbow_angle), min(self.trainer_shoulder_angle), max(self.trainer_shoulder_angle), min(self.trainer_hip_angle), max(self.trainer_hip_angle), min(self.trainer_knee_angle), max(self.trainer_knee_angle)
            
    def assess_client(self, elbow_min, elbow_max, shoulder_min, shoulder_max, hip_min, hip_max, knee_min, knee_max):
        
        correct_frames = 0
        incorrect_frames = 0

        # getting max and min of all trainer angles for assessment
        
        trainer_elbow_max = elbow_max
        trainer_elbow_min = elbow_min

        trainer_shoulder_max = shoulder_max
        trainer_shoulder_min = shoulder_min

        trainer_hip_max = hip_max
        trainer_hip_min = hip_min

        trainer_knee_max = knee_max
        trainer_knee_min = knee_min
        
        
        cap = cv2.VideoCapture(self.client_video_url)
        i = 0
        with mp_pose.Pose(min_detection_confidence=0.5, min_tracking_confidence=0.5) as pose:
            while cap.isOpened():
                cap.set(cv2.CAP_PROP_POS_FRAMES, i)
                i += 6
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
                    
                    
                    
                    # Elbow Angle Calculation
                    
                    if right_vis_sum >= left_vis_sum:
                        elbow_angle = self.calculate_angle(right_shoulder, right_elbow, right_wrist)
                    else:
                        elbow_angle = self.calculate_angle(left_shoulder, left_elbow, left_wrist)
                    
                
                            
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
                    
                    
                    # Elbow angle matching
                    
                    if elbow_angle < (trainer_elbow_min - self.leniency):
                        if current_time not in self.error_times:
                            self.errors.append("Push forearms away from shoulders, angle too small")
                            self.error_times.append(current_time)
                        self.error_bool = True
                    elif elbow_angle > (trainer_elbow_max + self.leniency):
                        if current_time not in self.error_times:
                            self.errors.append("Bring forearms closer to shoulders, separation too much")
                            self.error_times.append(current_time)
                        self.error_bool = True
                    
                    
                    # Shoulder angle matching
                    
                    if shoulder_angle < (trainer_shoulder_min - self.leniency):
                        if current_time not in self.error_times:
                            self.errors.append("Push body backwards, too much forward lean")
                            self.error_times.append(current_time)
                        self.error_bool = True
                    elif shoulder_angle > (trainer_shoulder_max + self.leniency):
                        if current_time not in self.error_times:
                            self.errors.append("Push body forwards, too much backward lean")
                            self.error_times.append(current_time)
                        self.error_bool = True
                    
                    
                    # Hip Angle Matching
                    
                    if hip_angle < (trainer_hip_min - self.leniency):
                        if current_time not in self.error_times:
                            self.errors.append("Bring hips lower")
                            self.error_times.append(current_time)
                        self.error_bool = True
                    elif hip_angle > (trainer_hip_max + self.leniency):
                        if current_time not in self.error_times:
                            self.errors.append("Push hips upwards")
                            self.error_times.append(current_time)
                        self.error_bool = True

                    # Knee Angle Matching
                    
                    if knee_angle < (trainer_knee_min - self.leniency):
                        if current_time not in self.error_times:
                            self.errors.append("Straighten legs, too much bend")
                            self.error_times.append(current_time)
                        self.error_bool = True
                    elif knee_angle > (trainer_knee_max + self.leniency):
                        if current_time not in self.error_times:
                            self.errors.append("Bend legs, too much straightening")
                            self.error_times.append(current_time)
                        self.error_bool = True
                    
                except:
                    pass 
                
                
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

        self.accuracy = round((correct_frames / (correct_frames + incorrect_frames)) * 100.0, 1)
        
        return self.errors, self.error_times, self.accuracy, int(round(self.duration, 0))
        
    
    def run_process(self):
        elbow_min, elbow_max, shoulder_min, shoulder_max, hip_min, hip_max, knee_min, knee_max = self.get_trainer_angles()
        
        self.errors, self.error_times, self.accuracy, self.duration = self.assess_client(elbow_min, elbow_max, shoulder_min, shoulder_max, hip_min, hip_max, knee_min, knee_max)
        
        return self.errors, self.error_times, self.accuracy, self.duration
        

if "__main__" == __name__:
    
    plank = Plank("sample_videos/bilal_footage.mp4", "sample_videos/aizaaz_footage.mp4")

    print(plank.run_process())
    
    # errors = []
    # error_times = []
    # accuracy = 0
    
    # errors, error_times, accuracy = plank.run_process()
    
    # print("\nErrors:-\n")
    # for i in range(len(errors)):
    #     print(errors[i], "at", error_times[i], "seconds")
        
    # print("\nAccuracy of user:-", accuracy, "%\n")
