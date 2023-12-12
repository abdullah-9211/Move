import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bwqhkxfnzrvxsiwzyywb.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3cWhreGZuenJ2eHNpd3p5eXdiIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTg4NTU1NjAsImV4cCI6MjAxNDQzMTU2MH0.PjcLzVbrU_kcuiBTaq5zMs-YlkBE9tI2U1OTMgEa-_4';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function UploadScreen({ navigation, route }) {
  const { exerciseName, nextExercise } = route.params;
  const [videoUri, setVideoUri] = useState(null);

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

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>{exerciseName}</Text>
      <TouchableOpacity style={styles.button} onPress={pickVideo}>
        <Text style={styles.buttonText}>Upload Video</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleNext}>
        <Text style={styles.buttonText}>Next Exercise</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    color: 'black',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    margin: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
  },
});
