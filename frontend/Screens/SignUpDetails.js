//Sign up screen

import * as React from 'react';
import { Image, Pressable, TouchableOpacity, ImageBackground,TextInput, TimePickerAndroid, Button, FlatList, SafeAreaView, ScrollView, SectionList, StyleSheet, Text, View, Dimensions, Modal, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useFonts } from 'expo-font';

import { useNavigation, useRoute } from '@react-navigation/native';
import { useState } from 'react';
import * as firebase from 'firebase/app';
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import {ref, uploadBytesResumable, getDownloadURL} from "firebase/storage";

const { width: screenWidth } = Dimensions.get('window');

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
firebase.initializeApp(firebaseConfig);

export default function SignUpDetails() {
    const navigation = useNavigation();
    const route = useRoute();
    const [image, setImage] = useState(null);
    const role = route.params?.role;
    const gender = route.params?.gender;
    const height = route.params?.height;
    const weight = route.params?.weight;
    const goal = route.params?.goal;

    const [date, setDate] = useState(new Date(1598051730000));
    const [showDatePicker, setShowDatePicker] = useState(false);
    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
      };
    const showMode = (currentMode) => {
        DateTimePickerAndroid.open({
        value: date,
        onChange,
        mode: currentMode,
        is24Hour: true,
    });
      };
      const showDatepicker = () => {
        showMode('date');
      };
    
      
    const [firstName, setFirstName] = React.useState('');
    const [lastName, setLastName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [phone, setPhone] = React.useState('');
    const [age, setAge] = React.useState('');
    const [loading, setLoading] = React.useState(false);

    const [loaded] = useFonts({

        'QuickSand': require('../assets/fonts/Quicksand-SemiBold.ttf')
    })
    if (!loaded) {
      return null;
    }
    const pickImage = async () => {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
  
      if (!result.canceled) {
        setImage(result.assets[0].uri);
        console.log(image);
      }

    };

    const uploadImage = async () => {
      if (image) {
        try {
          setLoading(true);

          const response = await fetch(image);
          const blob = await response.blob();
          
          // Upload image to Firebase Storage
          const storage = getStorage(app);
          const storageRef = ref(storage, 'Images/Profile/' + email + '.jpg');
          const uploadTaskSnapshot = await uploadBytesResumable(storageRef, blob);
        
          // Get download URL
          const downloadURL = await getDownloadURL(uploadTaskSnapshot.ref);
        
          console.log('File available at', downloadURL);
        
          setLoading(false);
        
          // Navigate to next screen with download URL
          navigation.navigate('SignUpDetails2', {
            role: role, 
            gender: gender, 
            height: height, 
            weight: weight, 
            goal: goal, 
            firstName: firstName, 
            lastName: lastName,
            email: email,
            phone: phone, 
            age: age,
            profilePicture: downloadURL
          });
        } catch (error) {
          console.error('Error uploading image:', error);
          // Handle error (e.g., display error message to user)
        }
        
      } else {
        alert("Please upload a profile picture");
      }
    
    };


    return (
        <ImageBackground
      source={require('../assets/images/red2.jpg')} // Replace with the path to your image
      style={styles.backgroundImage}
    >
   
        <View style = {{flex: 1, alignItems:"center", marginBottom:0}}>
            
            <View style = {{flex: 1, alignItems: "flex-start", width: screenWidth-20,justifyContent:"flex-start"}}> 
            <ScrollView>
            <View style={{ alignItems: "center", justifyContent: "center"}}>
                <Image 
                source={require('../assets/images/full_logo.png')}
                style={styles.image}
                resizeMode="contain"/>
            </View>
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', marginBottom: 30 }}>
              <TouchableOpacity style={{backgroundColor: "#000000", width: 135, height: 135, borderRadius: 75, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "#ffffff"}}onPress={pickImage}>
              {image && <Image source={{ uri: image }} style={{ width: 135, height: 135, marginBottom: 0, borderRadius:60 }}> 
              
              </Image>}
              {!image &&  <Text style={{color: "#ffffff", textAlign:"center", fontFamily: "QuickSand"}}> Upload Profile Picture</Text>}
              </TouchableOpacity>
              {/* <TouchableOpacity onPress={uploadImage}>
                <Text style={{ color: 'blue', marginTop: 10 }}>Upload Image</Text>
              </TouchableOpacity>  */}
      {/* make the continue button do the work of uploadImage as well */}
    </View>
    {loading && (
                <Modal transparent={true} animationType="fade">
                <View style={styles.modal}>
                    <ActivityIndicator size="large" color="#fff" />
                </View>
                </Modal>
            )}
            
            <Text style={styles.textStyle}>First Name</Text>
            <TextInput
              
                style={styles.input}
                placeholder="Name"
                value={firstName}
                onChangeText={(text) => setFirstName(text)}
            />
            <Text style={styles.textStyle}>Last Name</Text>
            <TextInput
                style={styles.input}
                placeholder="Name"
                value={lastName}
                onChangeText={(text) => setLastName(text)}
            />
            <Text style={styles.textStyle}>Your email</Text>
            <TextInput
                style={styles.input}
                placeholder="email"
                value={email}
                onChangeText={(text) => setEmail(text)}
            />
            <Text style={styles.textStyle}>Phone number</Text>
            <TextInput
                style={styles.input}
                placeholder="Phone Number"
                value={phone}
                onChangeText={(text) => setPhone(text)}
            />
            <Text style={styles.textStyle}>Age</Text>
            <TextInput
                style={[styles.input, {marginBottom:25}]}
                placeholder="Age"
                value={age}
                onChangeText={(text) => setAge(text)}
            />
            <View style={{flex:1, justifyContent: "flex-end"}}>
            <Pressable
                style={({ pressed }) => [styles.button,
            {
                backgroundColor: pressed ? '#140004' : '#900020',
            },
                ]}
            onPress={uploadImage}>
            <Text style={styles.buttonText}>
                Continue
            </Text>
            </Pressable>
            </View>
            </ScrollView>
          
        </View>
        
      </View>
      </ImageBackground>
    );
  }

  const styles = StyleSheet.create({

   textStyle:{
    fontFamily: 'QuickSand',
    fontSize: 21,
    marginHorizontal: 20,
    marginBottom:10,
    color: "#FFFFFF",
   },
   image: {
    
    width: 250,
    height: 140, 
    marginHorizontal:20,
    marginTop: 50,
  },
  input: {
    width: screenWidth-60,
    height: 60,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius:9,
    marginLeft: 20,
    marginRight:20,
    marginBottom:15,
    marginTop:5,
    paddingLeft:10,
    padding: 0,
    color: '#ffffff'
  },

  buttonText: {
    fontSize: 16,
    fontFamily: 'QuickSand',
    color: "#ffffff",
},
button: {

    width: screenWidth-40,
    justifyContent: "center",
    alignItems: "center",
    height: 60,
    marginHorizontal:10,
    borderRadius: 9,
    marginBottom:25,
},
backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    
  },
  modal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },

    
  });
