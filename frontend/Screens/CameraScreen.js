import React, { useState, useEffect, useRef } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet, Dimensions, Text, TouchableOpacity, View } from 'react-native';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { Audio } from 'expo-av';
import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import * as ScreenOrientation from 'expo-screen-orientation';


const { width: screenWidth } = Dimensions.get('window');
const supabaseUrl = 'https://bwqhkxfnzrvxsiwzyywb.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3cWhreGZuenJ2eHNpd3p5eXdiIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTg4NTU1NjAsImV4cCI6MjAxNDQzMTU2MH0.PjcLzVbrU_kcuiBTaq5zMs-YlkBE9tI2U1OTMgEa-_4';
const supabase = createClient(supabaseUrl, supabaseAnonKey);
const { data, error } = await supabase
  
  .upload('user.mp4', decode(base64FileData),{
    contentType: 'video/mp4'
  })

export default function CameraScreen({ route }) {
  const navigation = useNavigation();
  const { workouts } = route.params || { workouts: 1 };
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.front);
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
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_LEFT);

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
      uploadFile(result.assets[0].uri, 'user_video.mp4');
    }
  };

  async function uploadFile(uri, name) {

    const { data, error } = await supabase.storage
      .from('videos')
      .upload(`plank/user_video/${name}`, uri, {
        contentType: 'video/mp4',
      });

    if (error) {
      console.error('Upload error:', error);
      return;
    }
    console.log('Upload successful:', data);
  }

  const handleNext = () => {
    navigation.push('CameraScreen', { exerciseName: nextExercise });
  };

        // while (videoUri === null){
        //   console.log("Waiting for videoUri");
        // }
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
        
        try {
          handleFinish();
          await uploadFile(videoUri, exercise_name);
          console.log('Upload successful', videoUri);
          
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

    if (counter < workouts - 2) {
      navigation.navigate('CameraScreen', { workouts , video: videoUri});
    } 
    else {
      navigation.navigate('CameraScreen2', { workouts , video: videoUri});
    }
    // else {
    //   navigation.navigate('Statistics');
    // }
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
    flexDirection: 'row',
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
