// @ts-ignore
import React, { useState, useEffect, useRef } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StyleSheet, Dimensions, Text, Pressable, TouchableOpacity, View, ImageBackground, ActivityIndicator, Modal } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { Octicons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
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


export default function UploadVideo() {
  
  const navigation = useNavigation();
  const route = useRoute();
  const workouts = route.params?.workouts || { workouts: 1 };
  const user = route.params?.user;
  const trainer = route.params?.trainer;
  const exerciseNames = route.params?.exerciseNames;
  const workout = route.params?.workout;
  const [hasPermission, setHasPermission] = useState(null);
  const [counter, setCounter] = useState(0); // Initialize counter here
  const [loading, setLoading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [exercises, setExercises] = useState(exerciseNames);
  const exerciseText = exercises[counter] || "Exercise";
  const [uploadProgress, setUploadProgress] = useState(0);

  
  // const recordingOptions = {
  //   quality: Camera.Constants.VideoQuality['720p'],
  // };

  useEffect(() => {
    (async () => {
      
      console.log("Exercises: " + workouts);
      console.log("Counter: " + counter);
      console.log(trainer);
      setHasPermission(true);
    })();
  }, []);

  const [loaded] = useFonts({
    'QuickSandBold': require('../assets/fonts/Quicksand-SemiBold.ttf'),
    'QuickSand': require('../assets/fonts/Quicksand-Regular.ttf'),
    'BakbakOne': require('../assets/fonts/BakbakOne-Regular.ttf'),
  });

  if (!loaded) {
    return null;
  }
  
  

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

    if (!result.canceled) {
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

    const response = await fetch(uri);
    const blob = await response.blob();

    var storageRef = ref(getStorage(), "Videos/" + exercise_name + "/user/" + name);
    const uploadTask = uploadBytesResumable(storageRef, blob);

    setLoading(true);

    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress.toFixed(1));
        console.log('Upload is ' + progress + '% done');
      },
    )

    // NAMING CONVENTION: email_workoutID.mp4

    await uploadTask.then(() => {
      console.log('Uploaded a blob or file!');
      setUploaded(true);
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
    navigation.push('UploadVideo', { exerciseName: nextExercise });
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
      navigation.navigate('Statistics', {user: user, duration: response.data.total_duration, accuracy: response.data.accuracy, workout: response.data.workout, exercises: response.data.exercises, numExercises: response.data.exerciseNum, errors: response.data.errors, error_times: response.data.error_times, exercise_translator: response.data.exercise_translator, accuracies: response.data.accuracies});
    } catch (error) {
      alert('Error finishing workout:', error);
      setLoading(false);
    }
  };

  const handleFinish = () => {
    setCounter((prevCounter) => prevCounter + 1);
    console.log("Counter: " + counter + " -- Workouts: " + workouts);

    if (counter < workouts - 1) {
      setUploaded(false);
      navigation.navigate('UploadVideo', { workouts:workouts, user: user, trainer: trainer, exerciseNames: exerciseNames, workout: workout});
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


  
  
    return (

      <View style = {{flex: 1, justifyContent: "flex-start", backgroundColor:"#FFFFFF"}}>
             <ImageBackground
      source={{ uri: 'https://www.aestheticjunction.com/wp-content/uploads/2014/01/portfolio1.jpg' }}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <LinearGradient
        colors={['rgba(0,0,0,0.2)','rgba(0,0,0,0.5)', 'rgba(255,255,255,01)']}
        style={styles.gradient}
      >
        <View style={{ flex: 1, justifyContent: "flex-start", backgroundColor: "transparent" }}>
          <View>

          </View>
          <View style={{ flex: 1, alignItems: "flex-start", justifyContent: "flex-end" }}>
            
          </View>

        </View>
        <View style={{ flex: 1, alignItems: "flex-start", justifyContent: "flex-end" }}>
            <Text style={styles.headingtext}>
              {exerciseText}
            </Text>
    </View>
      </LinearGradient>
      
    </ImageBackground>
    
    <View 
					style = {{
						backgroundColor: "#d9d9d9",
						marginBottom: 16,
					}}>
					<View 
						style = {{
							width: 125, 
                            //width: (screenwidth/no. of exercises) * no. of exercises completed
							height: 4,
							backgroundColor: "#900020",
							borderTopRightRadius: 16,
							borderBottomRightRadius: 16,
						}}>
					</View>
				</View>

                <View 
					style = {{
						flexDirection: "row",
						alignItems: "center",
						backgroundColor: "#ffffff",
                        paddingBottom:5,
                        borderBottomColor: "#d9d9d9",
                        borderBottomWidth:1,
						paddingHorizontal: 17,
						marginBottom: 20,
					}}>
					<MaterialIcons name="arrow-circle-up" size={24} color="#000000" style={{margin:10, marginTop:11}}/>
          <Pressable onPress={pickVideo}>
					<Text 
						style = {{
							color: "#000000",
							fontSize: 16,
							fontFamily: "QuickSand"
						}}>
						{"Upload video"}
					</Text>
          </Pressable>
					<View 
						style = {{
							flex: 1,
							alignSelf: "stretch",
						}}>
					</View>
          {uploaded &&
            (<Octicons name="check-circle" size={24} color={"#900020"} style = {{
                  marginRight:5,
                    }}/>)
          }
          {!uploaded &&
            (<Octicons name="check-circle" size={24} color={"#D9D9D9"} style = {{
                  marginRight:5,
                    }}/>)
          }
				</View>
        {loading && (
                <Modal transparent={true} animationType="fade">
                <View style={styles.modal}>
                <Text style={styles.uploadingText}>
                    {uploaded ? 'Analyzing video...' : `Uploading video... ${uploadProgress}%`}
                  </Text>
                    <ActivityIndicator size="large" color="#fff" />
                </View>
                </Modal>
      )}
                <View style={{marginLeft:5}}>
                <Text 
					style = {{
						color: "#000000",
						fontSize: 16,
						fontFamily: "QuickSandBold",
						marginBottom: 12,
						marginLeft: 15,
					}}>
					{"Trainers message"}
				</Text>
				<Text 
					style = {{
						color: "#000000",
						fontSize: 14,
                        fontFamily: "QuickSand",
						marginBottom: 164,
						marginHorizontal: 43,
						width: 289,
					}}>
					{"Instructional message from trainer about the workout..."}
				</Text>
                </View>
            <View style={{margin:0}}>
            
                
                <Pressable style={{flex:1, justifyContent: "flex-end"}} onPress={handleFinish}>
                  <View style={styles.button}>
                  
                  <Text style={{color:"#ffffff", fontFamily: "QuickSand", fontSize:16}}>Next</Text>
                
                  </View>
                </Pressable>
            </View>
        
      </View>
      
    );
  }
  const styles = StyleSheet.create({

    gradient: {
      flex: 1,
      borderRadius: 0,
    },
    headingtext: {
      marginLeft: 25,
      fontSize: 32,
      color: '#000000',
      fontFamily: 'QuickSand',
    },
    icon: {
      marginLeft:25,
      marginTop:2,
    },
    backgroundImage: {
      flex: 1,
      width: screenWidth,
      
    },
    modal: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
    },
    button:{
      alignItems: "center",
      backgroundColor: "#900020",
      height:60,
      justifyContent: "center",
    },
    trainerText:{
      marginLeft:25,
      fontSize: 20,
      color: "#000000",
      fontFamily: 'QuickSand',
    },
    subtext: {
      marginLeft: 5,
      fontSize: 16,
      color: '#000000',

      fontFamily: 'QuickSand',
    },
    container: {
      marginTop:20,
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    card: {
      flexDirection: 'row',
      width: Dimensions.get('window').width, // Subtracting 20 for padding
      height: 50,
      justifyContent: 'space-between',
      alignItems: 'center',
      borderLeftWidth: 5,
      borderBottomWidth:0.3,
      borderBottomColor: 'rgba(0, 0, 0, 0.8)', 
      borderLeftColor: "#900020",
    },
    cardText: {
      marginLeft: 20, // Adjust the value as needed
      fontSize: 16,
      color: '#000000',
      marginRight:20,
      fontFamily: 'QuickSand',
    },
    uploadingText: {
      color: '#fff',
      fontSize: 18,
      fontFamily: 'QuickSandBold',
      marginBottom: 20, // Adjust this value as needed
    },
    analyzingText: {
      color: '#fff',
      fontSize: 18,
      fontFamily: 'QuickSandBold',
      marginBottom: 20, // Adjust this value as needed
    },
    
  
  });
