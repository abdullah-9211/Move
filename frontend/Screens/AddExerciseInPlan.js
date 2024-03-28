import * as React from 'react';
import { SafeAreaView, ScrollView, View, StyleSheet, Text, Dimensions, Pressable, Modal, ActivityIndicator} from 'react-native';
import { useFonts } from 'expo-font';
import { Octicons } from '@expo/vector-icons';
import { useState } from 'react';
import { TextInput } from 'react-native-gesture-handler';
import {Dropdown} from 'react-native-element-dropdown';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
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
  


const AddExerciseInPlan = () => {

    const navigation = useNavigation();
    const route = useRoute();

    const planName = route.params?.planName;
    const planType = route.params?.planType;
    const trainer = route.params?.user;

    const [counter, setCounter] = useState(0); // Initialize counter here
    const [loading, setLoading] = useState(false);
    const planID = React.useRef(0);
    const exercisesAdded = React.useRef([]);
    const [numVideos, setNumVideos] = useState(0);
    const [exerciseURL, setExerciseURL] = useState(''); // Initialize exerciseURL here
    const [uploaded, setUploaded] = useState(false); // Initialize uploaded here
    const [exercisesInfo, setExercisesInfo] = useState([]); // Initialize exercisesInfo here


    React.useEffect(() => {
        console.log('Plan Name: ', planName);
        console.log('Plan Type: ', planType);
        console.log('Plan ID: ', planID.current);
        console.log(exercisesInfo);

        setDropdown(null);
        setDropdown2(null);
        setamount('10');
        setExerciseName('plank');
        setSecOrReps('reps');
        setUploaded(false);
        setNumVideos(0);
    }, []);
        

    async function addExercise() {

        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permissionResult.granted) {
          Alert.alert('Permissions required', 'Permission to access media library is required to select a video.');
          return;
        }

        if (exercisesAdded.current.includes(exerciseName)) {
            alert('Exercise already added to the plan');
            return;
        }
    
        if (numVideos == 0)
        {
            let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Videos,
            allowsEditing: true,
            quality: 1,
            });
        
            if (!result.canceled) {
            console.log('Video picked:', result.assets[0].uri);
            // timestamp as video name
            const exercise_name = exerciseName;
            //   const video_name = user.email + "_" + workout.id + ".mp4";    // NAMING CONVENTION: email_workoutID.mp4
            uploadFile(result, result.assets[0].uri, exercise_name);
            }
        }
      };


      async function uploadFile(file, uri, exercise_name) {


        if (counter == 0) {
            // create workout and push to database
            const workout_plan = {
              plan_name: planName,
              workout_type: planType,
              plan_trainer: trainer["id"],
            };
            setLoading(true);

            const apiUrl = REACT_APP_API_URL + '/exercise/add_plan';
            try {
                const response = await axios.post(apiUrl, workout_plan);
                planID.current = response.data.plan_id;
                console.log("Response: ", response.data.plan_id);
                console.log('Plan ID: ', planID.current);
                setCounter(prevCounter => prevCounter + 1);
            } catch (error) {
                console.log(error);
                setLoading(false);
            }
            
        }


        const response = await fetch(uri);
        const blob = await response.blob();
    
        const name = trainer["email"] + "_" + planID.current + ".mp4";

        var storageRef = ref(getStorage(), "Videos/" + exercise_name + "/trainer/" + name);
        const uploadTask = uploadBytesResumable(storageRef, blob);
    
        setLoading(true);
    
        // Listen for state changes, errors, and completion of the upload.
        uploadTask.on('state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
          },
        )
    
        // // NAMING CONVENTION: email_workoutID.mp4
    
        await uploadTask.then(() => {
          console.log('Uploaded a blob or file!');
          setNumVideos((prevNumVideos) => prevNumVideos + 1);
          setUploaded(true);
          getDownloadURL(ref(getStorage(), "Videos/" + exercise_name + "/trainer/" + name)).then((url1) => {
            console.log("Uploaded Video URL: ", url1);
            setExerciseURL(url1);
            let exercise = {
                plan_id: planID.current,
                exercise_name: exercise_name,
                exercise_video: url1,
                exercise_amount: amount,
                exercise_type: secOrReps,
            };
            setExercisesInfo((prevExercisesInfo) => [...prevExercisesInfo, exercise]);
            exercisesAdded.current.push(exercise_name);
            const postData = {
                plan_id: planID.current,
                exercise_name: exercise_name,
                exercise_video: url1,
              };
            const apiUrl = REACT_APP_API_URL + '/exercise/get-trainer-angles';
            axios.post(apiUrl, postData)
            .then(response => {
                console.log("Response: ", response.data);
                setLoading(false);
            })
            .catch(error => {
                console.log(error);
            });
          });
        });
    
      }
    
      const nextVideo = () => {
        if (uploaded) {
            // validate data 

            setUploaded(false);
            setNumVideos(0);
            setDropdown(null);
            setDropdown2(null);
            console.log(exercisesInfo);
            navigation.navigate('AddExerciseInPlan', {planName: planName, planType: planType, user: trainer});
        }
      };


    async function saveExercises() {
        const savedExercises = {
            exercise_data: exercisesInfo,
          };
          setLoading(true);
          if (exercisesInfo.length == 0) {
              alert('Please add exercises to the plan');
              setLoading(false);
              return;
          }

          const apiUrl = REACT_APP_API_URL + '/exercise/add_plan_exercises';
          try {
              const response = await axios.post(apiUrl, savedExercises);
              console.log("Response: ", response.data);
              setLoading(false);
              navigation.navigate('ProfileWithPlans', {user: trainer, refresh: true});
          } catch (error) {
              console.log(error);
              setLoading(false);
          }
        
    }


    const data = [
        {label: 'pushup', value: '1'},
        {label: 'plank', value: '2'},
        {label: 'jumping jack', value: '3'},
        {label: 'squat', value: '4'},
    ];
    const data3 = [
       {label1: 'reps', value1: '1'},
       {label1: 'sec', value1: '2'},
    ];
    const [dropdown, setDropdown] = useState(null);
    const [dropdown2, setDropdown2] = useState(null);


        const [selected, setSelected] = useState([]);
        const _renderItem = item => {
            return (
            <View style={styles.item}>
                <Text style={styles.textItem}>{item.label}</Text>

            </View>
            );
        };

        const _renderItem2 = item1 => {
            return (
            <View style={styles.item}>
                <Text style={styles.textItem}>{item1.label1}</Text>

            </View>
            );
        };

    const data2 = ["Weight Loss", "Toning", "Strength", "Yoga"];
    
    // const [selectedValue, setSelectedValue] = React.useState('');
    const [amount, setamount] = useState('10');
    const [exerciseName, setExerciseName] = useState('plank');
    const [secOrReps, setSecOrReps] = useState('reps');

    const [loaded] = useFonts({
        'QuickSandBold': require('../assets/fonts/Quicksand-SemiBold.ttf'),
        'QuickSand': require('../assets/fonts/Quicksand-Regular.ttf'),
        'BakbakOne': require('../assets/fonts/BakbakOne-Regular.ttf'),
      });
    
      if (!loaded) {
        return null;
      }
      
      return (
        <SafeAreaView 
        style = {{
            flexGrow: 1,
            backgroundColor: "#FFFFFF",
            
        }}>
        <ScrollView  
            style = {{
                flex: 1,
                backgroundColor: "#ffffff",
                borderRadius: 16,
            }}>

{/* -------------------------------------addplan top bar-----------------------------------------------------------------------------------------*/}
            <View 
                
                style = {{
                    flexDirection: "row",
                    backgroundColor: "#ffffff",
                    paddingTop: 60,
                    paddingBottom: 2,
                    paddingHorizontal: 17,
                    marginBottom: 30,
                    justifyContent: "center",
                    alignItems: "center",
                    shadowRadius: 4,
                    elevation: 2,
                }}>
                <Octicons name="chevron-left" size={24} color={"#000000"} style = {{
                        width: 14,
                        height: 20,
                        marginTop: 2,
                        marginRight: 63,
                        marginBottom:16,
                    }}/>
                <Text 
                    style = {{
                        color: "#900020",
                        fontSize: 36,
                        flex: 1,
                        fontFamily: "BakbakOne"
                    }}>
                    {"ADD PLAN"}
                </Text>
            </View>
            <View>

            </View>
{/* -------------------------------------------------details------------------------------------------ */}
<View 
					style = {{
						marginBottom: 20,
						marginHorizontal: 25,
					}}>
					<View 
						style = {styles.infoOdd}>
						<Text 
							style = {{
								color: "#000000",
								fontSize: 16,
								fontFamily: "QuickSand",
								marginRight: 4,
								flex: 1,
							}}>
							{"Plan name"}
						</Text>
						<Text 
							style = {{
								color: "#000000",
								fontSize: 16,
								fontFamily: "QuickSand"

							}}>
							{planName}
						</Text>
					</View>
					<View 
						style = {styles.infoEven}>
						<Text 
							style = {{
								color: "#ffffff",
								fontSize: 16,
								
								marginRight: 4,
                                fontFamily: "QuickSand",
								flex: 1,
							}}>
							{"Category"}
						</Text>
						<Text 
							style = {{
								color: "#ffffff",
								fontSize: 16,
							
                                fontFamily: "QuickSand"
							}}>
							{planType}
						</Text>
					</View>
				</View>
{/* -------------------------------------drop down-----------------------------------------------------------------------------------------*/}
            <View style={{flex:1, flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start"}}>
            <View 
                style = {{
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor: "#ffffff",
                    borderColor: "#000000",
                    borderRadius: 16,
                    borderWidth: 1,
                    paddingVertical: 20,
                    paddingHorizontal: 17,
                    width: "62%",
                    marginBottom: 20,
                    marginLeft: 25,

                }}>           
                
                    <Dropdown
                    style={styles.dropdown}
                    
                    data={data}
                    labelField="label"
                    valueField="value"
                    label="Dropdown"
                    placeholder="Select Exercise"
                    value={dropdown}
                    onChange={item => {
                    setDropdown(item.value);
                    setExerciseName(item.label);
                        console.log('selected', exerciseName);
                    }}
                    renderItem={item => _renderItem(item)}
                    textError="Error"
                />

            </View>
            
            
            
            <View 
						style = {{
							width: 54,
							alignItems: "center",
							backgroundColor: "#900020",
							borderRadius: 9,
                            width: "20%",
                            height: "78%",
                            justifyContent: "center",
                            marginVertical:0,
                            alignItems: "center",
							paddingVertical: 21,
                            marginRight: 25,
						}}>
						<Text 
							style = {{
								color: "#ffffff",
								fontSize: 16,
								fontWeight: "bold",
							}}>
							{"+"}
						</Text>
					</View>
                    </View>
    {loading && (
        <Modal transparent={true} animationType="fade">
            <View style={styles.modal}>
                <ActivityIndicator size="large" color="#fff" />
            </View>
       </Modal>
      )}
                    
{/* -------------------------------------Set plan name-----------------------------------------------------------------------------------------*/}
           <View style={{flexDirection: "row"}}>
           <View 
                style = {{
                    backgroundColor: "#898d8f1A",
                    borderColor: "#000000",
                    borderRadius: 16,
                    borderWidth: 1,
                    width: "52%",
                    paddingVertical: 23,
                    paddingHorizontal:10,
                    marginBottom: 20,
                    marginRight: 15,
                    marginLeft: 25,
                    
                }}>
                <TextInput 
                    style = {{
                        color: "#898d8f",
                        fontSize: 16,
                        fontFamily: "QuickSand"
                    }}
                    placeholder='10'
                    value={amount}
                    // useNativeDriver={false}
                    onChangeText={
                        (text) => {
                            setamount(text);
                            console.log(amount);
                        }
                    }
                    >
                    
                </TextInput>
                
            </View>
            <View 
                style = {{
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor: "#ffffff",
                    borderColor: "#000000",
                    borderRadius: 16,
                    borderWidth: 1,
                    width: "30%",
                    paddingVertical: 20,
                    paddingHorizontal: 17,
                    marginBottom: 20,
                    marginRight: 25,
                }}>
                
                
                
                    <Dropdown
                    style={styles.dropdown}
                    
                    data={data3}
                    labelField="label1"
                    valueField="value1"
                    label1="Dropdown"
                    
                    value={dropdown2}
                    placeholder="Select"
                    onChange={item1 => {
                    setDropdown2(item1.value1);
                    setSecOrReps(item1.label1);
                        console.log('selected', secOrReps);
                    }}
                    renderItem={item1 => _renderItem2(item1)}
                    textError="Error"
                />

            </View>
            </View>
{/* -------------------------------------------upload video button -------------------------------------------------------------- */}

<Pressable onPress={ addExercise }>
<View 
                style = {{
                    alignItems: "center",
                    backgroundColor: "#ffffff",
                    borderColor: "#900020",
                    borderRadius: 9,
                    borderWidth: 1,
                    paddingVertical: 19,
                    marginBottom: 10,
                    marginHorizontal: 25,
                }}>
                <Text 
                    style = {{
                        color: "#000000",
                        fontSize: 16,
                      
                        fontFamily: "QuickSandBold"
                    }}>
                    {"Upload Video"}
                </Text>
            </View>
    </Pressable>

    {uploaded && (
        <Text style={{color: 'grey', textAlign: 'center', marginBottom: 20}}>
            Video uploaded successfully!
        </Text>
    )}

{/* -------------------------------------Add Exercise Button-----------------------------------------------------------------------------------------*/}
           
            
        </ScrollView>
        <View style={{marginBottom:15}}>
        <Pressable onPress={nextVideo}>
            <View 
                style = {{
                    alignItems: "center",
                    backgroundColor: "#ffffff",
                    borderColor: "#900020",
                    
                    borderRadius: 9,
                    borderWidth: 1,
                    paddingVertical: 19,
                
                    marginBottom: 10,
                    marginHorizontal: 25,
                }}>
                <Text 
                    style = {{
                        color: "#000000",
                        fontSize: 16,
                      
                        fontFamily: "QuickSandBold"
                    }}>
                    {"Add Exercise"}
                </Text>
            </View>
            </Pressable>

{/* -------------------------------------Done button-----------------------------------------------------------------------------------------*/}

<Pressable onPress={saveExercises}>
            <View 
                style = {{
                    alignItems: "center",
                    backgroundColor: "#900020",
                    borderRadius: 9,
                    paddingVertical: 19,
                    marginBottom: 0,
                    marginHorizontal: 25,
                }}>
                <Text 
                    style = {{
                        color: "#ffffff",
                        fontSize: 16,
                        fontFamily: "QuickSandBold"
                    }}>
                    {"Done"}
                </Text>
            </View>
            </Pressable>
            </View>
    </SafeAreaView>);
};


export default AddExerciseInPlan;

const styles = StyleSheet.create({

    infoOdd: {
        flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#ffffff",
		borderColor: "#000000",
		borderTopLeftRadius: 9,
		borderTopRightRadius: 9,
		borderWidth: 0.5,
		paddingVertical: 12,
		paddingHorizontal: 17,
    },

    infoEven:{
        flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#900020",
		borderColor: "#000000",
		borderBottomRightRadius: 9,
		borderBottomLeftRadius: 9,
		borderWidth: 0.5,
		paddingVertical: 12,
		paddingHorizontal: 18,
    },

    dropdown: {
        backgroundColor: 'white',
        width: "100%"
    },
 
    dropdown2: {
        backgroundColor: 'white',
        width: "20%",

    },
    item: {
        paddingVertical: 17,
        paddingHorizontal: 10,
        width: "100%",
        borderColor: "#ffffff",
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    textItem: {
        flex: 1,
        fontSize: 16,
    },

    addNewPlan: {
    flex: 1,
    alignItems: "center",
    width: "100%",
    backgroundColor: "#fff",
    },
    modal: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
      },
    });