//Sign up screen
import * as React from 'react';
import { Image, Pressable, ImageBackground,TextInput, Button, FlatList, SafeAreaView, ScrollView, SectionList, StyleSheet, Text, View, Dimensions, ActivityIndicator, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts } from 'expo-font';
import NavBar from '../components/NavBar';
import MainScreen from '../components/MainScreen';
import NavBarBot from '../components/NavBarBot'
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import {API_URL} from "@env"



const { width: screenWidth } = Dimensions.get('window');

export default function SignUpDetails2() {
    const navigation = useNavigation();
    const route = useRoute();

    const role = route.params.role;
    const gender = route.params.gender;
    const height = route.params.height;
    const weight = route.params.weight;
    const goal = route.params.goal;
    const firstName = route.params.firstName;
    const lastName = route.params.lastName;
    const email = route.params.email;
    const phone = route.params.phone;
    const age = route.params.age;
    var goal_id = " ";

    
    const [password, setPassword] = React.useState('');
    const [confirmPassword, setConfirmPassword] = React.useState('');
    const [isLoading, setLoading] = React.useState(false);

    const [loaded] = useFonts({

        'QuickSand': require('../assets/fonts/Quicksand-SemiBold.ttf')
    })
    if (!loaded) {
      return null;
    }

    async function createNewUser() {

        setLoading(true);

        if (role == "user") {
            try {
                const apiUrl = API_URL + '/user/add_goal';
                const requestBody = {
                    height: height,
                    weight: weight,
                    goal: goal
                };
                const response = await axios.post(apiUrl, requestBody);
                goal_id = response.data.goal_id;
                
                try {
                    const apiUrl = API_URL + '/user/add_user';
                    const requestBody = {
                        email: email,
                        password: password,
                        age: age,
                        first_name: firstName,
                        last_name: lastName,
                        phone_number: phone,
                        gender: gender,
                        user_type: role,
                        goal_id: goal_id
                    };
                    const response = await axios.post(apiUrl, requestBody);
                    user_id = response.data.user_id;
                    alert('User created successfully!', response.data.user_id);
                    console.log(response.data.user_id)
                    navigation.navigate('Login', {user_id: response.data.user_id});
                } catch (error) {
                    alert('Error creating user:', error);
                }
            } catch (error) {
                alert('Error creating user:', error);
            }   
        }
        else{
            try {
                const apiUrl = API_URL + '/user/add_user';
                const requestBody = {
                    email: email,
                    password: password,
                    age: age,
                    first_name: firstName,
                    last_name: lastName,
                    phone_number: phone,
                    gender: gender,
                    user_type: role,
                    goal_id: "None"
                };
                const response = await axios.post(apiUrl, requestBody);
                user_id = response.data.user_id;
                alert('Trainer created successfully!', response.data.user_id);
                console.log(response.data.user_id)
                navigation.navigate('Login', {user_id: response.data.user_id});
            } catch (error) {
                alert('Error creating trainer:', error);
            }
        }
    }



    function handlePress() {
        if (password != confirmPassword) {
            alert("Passwords do not match");
        }
        else if (password == "" || confirmPassword == "") {
            alert("Please enter a password");
        }
        else if (password.length < 6) {
            alert("Password must be at least 6 characters");
        }
        else{
            createNewUser();
        }

    }

    return (
        <ImageBackground
      source={require('../assets/images/red2.jpg')} // Replace with the path to your image
      style={styles.backgroundImage}
    >
        <View style = {{flex: 1}}>
            <View style={{ alignItems: "center"}}>
                <Image 
                source={require('../assets/images/full_logo.png')}
                style={styles.image}
                resizeMode="contain"/>
            </View>
            <View style = {{flex: 1, alignItems: "flex-start", width: screenWidth-20,justifyContent:"flex-start"}}> 
      
            
            <Text style={styles.textStyle}>Create Password</Text>
            <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry={true}
                value={password}
                onChangeText={(text) => setPassword(text)}
            />
            {isLoading && (
                <Modal transparent={true} animationType="fade">
                <View style={styles.modal}>
                    <ActivityIndicator size="large" color="#fff" />
                </View>
                </Modal>
            )}
            <Text style={styles.textStyle}>Confirm Password</Text>
            <TextInput
                style={styles.input}
                secureTextEntry={true}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChangeText={(text) => setConfirmPassword(text)}
            />
            <View style={{flex:1, justifyContent: "flex-end"}}>
            <Pressable
                style={({ pressed }) => [styles.button,
            {
                backgroundColor: pressed ? '#140004' : '#900020',
            },
                ]}
            onPress={ handlePress }>
            <Text style={styles.buttonText}>
                Continue
            </Text>
            </Pressable>

            </View>
          
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
    height: 250, 
    marginHorizontal:20,
    marginTop: 20,
  },
  input: {
    width: screenWidth-40,
    height: 60,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius:9,
    marginLeft: 20,
    marginRight:20,
    marginBottom:30,
    marginTop:5,
    padding: 10,
    color: '#ffffff'
  },

  buttonText: {
    fontSize: 16,
    fontFamily: 'QuickSand',
    color: "#ffffff",
},
button: {

    width: screenWidth-20,
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
    justifyContent: 'center',
  },

  modal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
    
  });
