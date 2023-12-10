import React, { useState, useEffect, useRef } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet, Dimensions, Text, TouchableOpacity, View } from 'react-native';
import { Camera } from 'expo-camera';
import * as FileSystem from 'expo-file-system';
import { Audio } from 'expo-av';


const { width: screenWidth } = Dimensions.get('window');

export default function CameraScreen({ route }) {
  const navigation = useNavigation();
  const { workouts } = route.params || { workouts: 1 };
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [isRecording, setIsRecording] = useState(false);
  const [counter, setCounter] = useState(0);
  const cameraRef = useRef(null);
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
    if (cameraRef.current) {
      try {
        const { uri } = await cameraRef.current.recordAsync({
          quality: Camera.Constants.VideoQuality['720p'],
        });
        console.log('Recording started:', uri);
        setIsRecording(true);
      } catch (error) {
        console.error('Error starting recording:', error);
      }
    }
  };

  const stopRecording = () => {
    if (cameraRef.current) {
      cameraRef.current.stopRecording();
      setIsRecording(false);
      console.log('Recording stopped');
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
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={isRecording ? stopRecording : startRecording}>
            <Text style={styles.text}>{isRecording ? 'Stop Recording' : 'Start Recording'}</Text>
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
