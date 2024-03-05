// @ts-ignore
import React, { useState, useEffect, useRef } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StyleSheet, Dimensions, Text, TouchableOpacity, View, ActivityIndicator, Modal } from 'react-native';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import 'react-native-url-polyfill/auto';
import axios from 'axios';
import {REACT_APP_API_URL} from "@env"
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import * as firebase from "firebase/app";
import { getStorage } from "firebase/storage";
import {ref, uploadBytesResumable, getDownloadURL} from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBJQ8eu5gLYOgooLU4VKxxDIVYzK1XBjxE",
  authDomain: "move-1699869988043.firebaseapp.com",
  projectId: "move-1699869988043",
  storageBucket: "move-1699869988043.appspot.com",
  messagingSenderId: "630043626016",
  appId: "1:630043626016:web:889775012715c7b7b58a45",
  measurementId: "G-QYD1SXS4VT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const { width: screenWidth } = Dimensions.get('window');
firebase.initializeApp(firebaseConfig);


export default function CameraScreen() {
  
  const navigation = useNavigation();
  const route = useRoute();
  const workouts = route.params?.workouts || { workouts: 1 };
  const user = route.params?.user;
  const trainer = route.params?.trainer;
  const exerciseNames = route.params?.exerciseNames;
  const workout = route.params?.workout;
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [isRecording, setIsRecording] = useState(false);
  const [clientVideoUri, setClientVideoUri] = useState(null);
  const [trainerVideoUri, setTrainerVideoUri] = useState(null);
  const cameraRef = useRef(null);
  const [counter, setCounter] = useState(0); // Initialize counter here
  const [isLoading, setLoading] = useState(false);
  const [exercises, setExercises] = useState(exerciseNames);
  const exerciseText = exercises[counter] || "Exercise";
  
  // const recordingOptions = {
  //   quality: Camera.Constants.VideoQuality['720p'],
  // };

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();

      if (status !== 'granted') {
        console.error('Camera permission not granted');
        return;
      }
      console.log("Exercises: " + workouts);
      console.log("Counter: " + counter);
      console.log(trainer);
      setHasPermission(true);
    })();
  }, []);

  const pickVideo = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permissions required', 'Permission to access media library is required to select a video.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.cancelled) {
      console.log('Video picked:', result.assets[0].uri);
      // timestamp as video name
      const exercise_name = exercises[counter];
      const video_name = user.email + "_" + workout.id + ".mp4";    // NAMING CONVENTION: email_workoutID.mp4
      uploadFile(result, result.assets[0].uri, video_name, exercise_name);
    }
  };

  const analyzeFootage = async (exercise_name, client_url, trainer_url) => {
    setLoading(true);


    try {
      const apiUrl = REACT_APP_API_URL + '/exercise/analyze';
      const requestBody = {
        exercise: exercise_name,
        client_video: client_url,
        trainer_video: trainer_url,
      };
      const response = await axios.post(apiUrl, requestBody);
      console.log(response.data);
      setLoading(false);     
      handleFinish();
    } catch (error) {
      alert('Error analyzing video:', error);
      setLoading(false);
    }
  };


  async function uploadFile(file, uri, name, exercise_name) {

    /* const { data, error } = await supabase.storage
      .from('videos')
      .upload(`plank/user_video/${name}`, uri, {
        contentType: 'video/mp4',
      });

    if (error) {
      console.error('Upload error:', error);
      return;
    }
    console.log('Upload successful:', data); */

    const response = await fetch(uri);
    const blob = await response.blob();

    var storageRef = ref(getStorage(), "Videos/" + exercise_name + "/user/" + name);
    const uploadTask = uploadBytesResumable(storageRef, blob);

    setLoading(true);

    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
      },
    )

    // NAMING CONVENTION: email_workoutID.mp4

    await uploadTask.then(() => {
      console.log('Uploaded a blob or file!');
      getDownloadURL(ref(getStorage(), "Videos/" + exercise_name + "/user/" + name)).then((url1) => {
        console.log("Client Video URL: ", url1);
        getDownloadURL(ref(getStorage(), "Videos/" + exercise_name + "/trainer/" + trainer["email"] + "_" + workout["id"] + ".mp4")).then((url2) => {
          console.log("Trainer Video URL: ", url2);
          analyzeFootage(exercise_name, url1, url2);
        });
      });
    });

  }

  const handleNext = () => {
    navigation.push('CameraScreen', { exerciseName: nextExercise });
  };

  const startRecording = async () => {
    console.log("Current exercise text: ", exerciseText);
    if (cameraRef.current && !isRecording) {
      setIsRecording(true);

      try {
        const video = await cameraRef.current.recordAsync(recordingOptions);
        console.log('Recording started at', video.uri);
        setVideoUri(video.uri);
      } catch (error) {
        console.error('Error starting recording:', error);
        setIsRecording(false);
      }
    }
  };

  const stopRecording = async () => {
    if (cameraRef.current && isRecording) {
      cameraRef.current.stopRecording();
      console.log('Recording stopped');
      setIsRecording(false);
    }
  };

  const finishWorkout = async () => {
    setLoading(true);
    try{
      const apiUrl = REACT_APP_API_URL + '/exercise/finish-workout';
      const requestBody = {
        plan_id: workout.id,
        client_id: user.id,
        trainer_id: workout.plan_trainer,
      };
      const response = await axios.post(apiUrl, requestBody);
      console.log(response.data);
      setLoading(false);
      navigation.navigate('Statistics', {user: user, duration: response.data.total_duration, accuracy: response.data.accuracy, workout: response.data.workout});
    } catch (error) {
      alert('Error finishing workout:', error);
      setLoading(false);
    }
  };

  const handleFinish = () => {
    setCounter((prevCounter) => prevCounter + 1);
    console.log("Counter: " + counter + " -- Workouts: " + workouts);

    if (counter < workouts - 1) {
      navigation.navigate('CameraScreen', { workouts:workouts, user: user, trainer: trainer, exerciseNames: exerciseNames, workout: workout});
    } else {
      finishWorkout();
    }
  };

  if (hasPermission === null) {
    return <View />;
  }

  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  const toggleCameraType = () => {
    setType((currentType) =>
      currentType === Camera.Constants.Type.back
        ? Camera.Constants.Type.front
        : Camera.Constants.Type.back
    );
  };

  return (
    <View style={styles.container}>
      {isLoading && (
                <Modal transparent={true} animationType="fade">
                <View style={styles.modal}>
                    <ActivityIndicator size="large" color="#fff" />
                </View>
                </Modal>
      )}
        <View style={styles.headerContainer}>
        <View style={{ flex: 1 }} />
        <Text style={styles.exerciseText}>{exerciseText}</Text>
        <TouchableOpacity style={styles.nextButton} onPress={handleFinish}>
          <Text style={styles.text}>skip</Text>
        </TouchableOpacity>
      </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={pickVideo}>
            <Text style={styles.text}>Upload Video</Text>
          </TouchableOpacity>
          
          {isRecording && <Text style={styles.recordingText}>Recording...</Text>}
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#900020',
    padding: 15,
    marginBottom: 10,
    width: screenWidth - 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  exerciseText: {
    position: 'absolute',
    top: 20, // Adjust this value as needed
    alignSelf: 'center',
    color: 'black',
    marginTop:25,
    fontSize: 20,
    fontWeight: 'bold',
    zIndex: 2, // Ensure text is above camera view
  },
  nextButton: {
    backgroundColor: '#900020',
    padding: 15,
    margin:25,
    width: 100,
    
    justifyContent: 'flex-end',
    alignItems: 'center',
    borderRadius: 10,
  },
  text: {
    color: 'white',
    fontSize: 18,
  },
  recordingText: {
    color: 'red',
    fontSize: 18,
    marginTop: 10,
  },
  modal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
});
