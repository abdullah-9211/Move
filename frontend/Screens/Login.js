import * as React from 'react';
import { Image, Pressable, ImageBackground,TextInput, Button, FlatList, SafeAreaView, ScrollView, SectionList, StyleSheet, Text, View, Dimensions, Modal, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts } from 'expo-font';
import NavBar from '../components/NavBar';
import MainScreen from '../components/MainScreen';
import NavBarBot from '../components/NavBarBot'
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import {REACT_APP_API_URL} from "@env"


const { width: screenWidth } = Dimensions.get('window');

export default function Login() {
    const navigation = useNavigation();

    const [isLoading, setLoading] = React.useState(false);
    const [email, setemail] = React.useState('');
    const [password, setpassword] = React.useState('');

    const [loaded] = useFonts({

        'QuickSand': require('../assets/fonts/Quicksand-SemiBold.ttf')
    })
    if (!loaded) {
      return null;
    }

    async function handlePress() {
        setLoading(true);
        try {
            const apiUrl = REACT_APP_API_URL + '/user/login';
            console.log("test : " + apiUrl);
            const requestBody = {
                email: email,
                password: password
            };
            const response = await axios.post(apiUrl, requestBody);
            const data = response.data;
            console.log(data);

            if (data["user"] == "None"){
                alert("Invalid email or password, Login failed")
            }
            else{
                alert("Login successful")
                if (data["user"]["user_type"] == "user"){
                    navigation.navigate("HomePage", {user: data["user"]});
                }
                else if (data["user"]["user_type"] == "trainer"){
                    navigation.navigate("TrainerHomepage", {user: data["user"]});
                }
            }

        } 
        catch (error) {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
            } else if (error.request) {
                // The request was made but no response was received
                console.log(error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.log('Error', error.message);
            }
        }
        
        // catch (error) {
        //     console.log(error);
        // }
        setLoading(false);
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
      
            
            <Text style={styles.textStyle}>Email</Text>
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={(text) => setemail(text)}
            />
            {isLoading && (
                <Modal transparent={true} animationType="fade">
                <View style={styles.modal}>
                    <ActivityIndicator size="large" color="#fff" />
                </View>
                </Modal>
            )}
            <Text style={styles.textStyle}>Password</Text>
            <TextInput
                style={styles.input}
                secureTextEntry={true}
                placeholder="Password"
                value={password}
                onChangeText={(text) => setpassword(text)}
            />
            <View style={{flex:1, justifyContent: "flex-end"}}>
            <Pressable
                style={({ pressed }) => [styles.button,
            {
                backgroundColor: pressed ? '#140004' : '#900020',
            },
                ]}
            onPress={handlePress}>
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
