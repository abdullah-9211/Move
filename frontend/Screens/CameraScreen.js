import React, { useState, useEffect, useRef } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet, Dimensions, Text, TouchableOpacity, View } from 'react-native';
import { Camera } from 'expo-camera';
import { Audio } from 'expo-av';
import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';


const { width: screenWidth } = Dimensions.get('window');

export default function CameraScreen({ route }) {

  const supabase = createClient('https://bwqhkxfnzrvxsiwzyywb.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3cWhreGZuenJ2eHNpd3p5eXdiIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTg4NTU1NjAsImV4cCI6MjAxNDQzMTU2MH0.PjcLzVbrU_kcuiBTaq5zMs-YlkBE9tI2U1OTMgEa-_4');


  const navigation = useNavigation();
  const { workouts } = route.params || { workouts: 1 };
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [isRecording, setIsRecording] = useState(false);
  const [counter, setCounter] = useState(0);
  const cameraRef = useRef(null);
  const exercises = ["Push up", "Plank"];
  const exerciseText = exercises[counter] || "Exercise";
  const [videoUri, setVideoUri] = useState(null);
  const recordingOptions = {
    quality: Camera.Constants.VideoQuality['720p'],
    };

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      
      if (status !== 'granted') {
        console.error('Camera permission not granted');
        return;
      }
    //   const audioStatus = await Camera.requestMicrophonePermissionsAsync();
    
    // if (audioStatus !== 'granted') {
    //   console.error('Audio permission not granted');
    //   return;
    // }


      setHasPermission(true);
    })();
  }, []);

  const startRecording = async () => {
    console.log("Current exercise text: ", exerciseText);
    if (cameraRef.current && !isRecording) {
        setIsRecording(true);
        try {
            const video = await cameraRef.current.recordAsync(recordingOptions);
            console.log('Recording started at', video.uri);
            setVideoUri(video.uri);
            console.log(videoUri)
        } catch (error) {
            console.error('Error starting recording:', error);
            setIsRecording(false);
        }
    }
};



async function uploadFile(file, exercise_name) {
  const { data, error } = await supabase.storage.from('videos').upload(exercise_name + '/user_video/user.mp4', file, {
    contentType: 'video/mp4',
  })
  if (error) {
    console.log(error)
  } else {
    console.log(data)
  }
}

const stopRecording = () => {
    if (cameraRef.current && isRecording) {
        cameraRef.current.stopRecording();
        console.log('Recording stopped');
        setIsRecording(false);
        let exercise_name = "";
        if (counter === 0){
          exercise_name = "pushup";
        }
        else{
          exercise_name = "plank";
        }
        
        uploadFile(videoUri, exercise_name);
        handleFinish();
    }
};

  const handleFinish = () => {
    setCounter((prevCounter) => prevCounter + 1);

    if (counter < workouts - 1) {
      navigation.navigate('CameraScreen', { workouts });
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
      <View style={styles.headerContainer}>
        <View style={{ flex: 1 }} />
        <Text style={styles.exerciseText}>{exerciseText}</Text>
        <TouchableOpacity style={styles.nextButton} onPress={handleFinish}>
          <Text style={styles.text}>skip</Text>
        </TouchableOpacity>
      </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={isRecording ? stopRecording : startRecording}>
            <Text style={styles.text}>{isRecording ? 'Stop Recording' : 'Start Recording'}</Text>
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
  exerciseText: {
    position: 'absolute',
    top: 20, // Adjust this value as needed
    alignSelf: 'center',
    color: 'white',
    marginTop:25,
    fontSize: 20,
    fontWeight: 'bold',
    zIndex: 2, // Ensure text is above camera view
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
});
