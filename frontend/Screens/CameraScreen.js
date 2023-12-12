// @ts-ignore
import React, { useState, useEffect, useRef } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet, Dimensions, Text, TouchableOpacity, View } from 'react-native';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
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
const tus = require('tus-js-client');
const { width: screenWidth } = Dimensions.get('window');
const supabaseUrl = 'https://bwqhkxfnzrvxsiwzyywb.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3cWhreGZuenJ2eHNpd3p5eXdiIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTg4NTU1NjAsImV4cCI6MjAxNDQzMTU2MH0.PjcLzVbrU_kcuiBTaq5zMs-YlkBE9tI2U1OTMgEa-_4';
const supabase = createClient(supabaseUrl, supabaseAnonKey);
firebase.initializeApp(firebaseConfig);


export default function CameraScreen({ route }) {
  const navigation = useNavigation();
  const { workouts } = route.params || { workouts: 1 };
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [isRecording, setIsRecording] = useState(false);
  const [videoUri, setVideoUri] = useState(null);
  const cameraRef = useRef(null);
  const [counter, setCounter] = useState(0);
  
  const recordingOptions = {
    quality: Camera.Constants.VideoQuality['720p'],
  };

  useEffect(() => {
    console.log('Video URI updated:', videoUri);
  }, [videoUri]);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();

      if (status !== 'granted') {
        console.error('Camera permission not granted');
        return;
      }

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
      setVideoUri(result.assets[0].uri);
      console.log('Video picked:', result.assets[0].uri);
      uploadFile(result, result.assets[0].uri, 'umar_video.mp4');
    }
  };

  async function uploadFile(file, uri, name) {

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

    var storageRef = ref(getStorage(), "Videos/" + name);
    const uploadTask = uploadBytesResumable(storageRef, blob);

    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
      },
    )

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

  const handleFinish = () => {
    setCounter((prevCounter) => prevCounter + 1);

    if (counter < workouts - 1) {
      navigation.navigate('CameraScreen', { workouts, video: videoUri });
    } else {
      navigation.navigate('Statistics');
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
      <Camera ref={cameraRef} style={styles.camera} type={type} ratio="16:9" audio={true}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={pickVideo}>
            <Text style={styles.text}>Upload Video</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.nextButton} onPress={handleFinish}>
            <Text style={styles.text}>Next</Text>
          </TouchableOpacity>
          {isRecording && <Text style={styles.recordingText}>Recording...</Text>}
        </View>
      </Camera>
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
  nextButton: {
    backgroundColor: '#007BFF',
    padding: 15,
    width: screenWidth - 20,
    justifyContent: 'center',
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
});
