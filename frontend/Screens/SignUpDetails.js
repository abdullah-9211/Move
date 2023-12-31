//Sign up screen

import * as React from 'react';
import { Image, Pressable, ImageBackground,TextInput, TimePickerAndroid, Button, FlatList, SafeAreaView, ScrollView, SectionList, StyleSheet, Text, View, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts } from 'expo-font';
import NavBar from '../components/NavBar';
import MainScreen from '../components/MainScreen';
import NavBarBot from '../components/NavBarBot'
import { useNavigation, useRoute } from '@react-navigation/native';
import { useState } from 'react';


const { width: screenWidth } = Dimensions.get('window');

export default function SignUpDetails() {
    const navigation = useNavigation();
    const route = useRoute();

    const role = route.params.role;
    const gender = route.params.gender;
    const height = route.params.height;
    const weight = route.params.weight;
    const goal = route.params.goal;

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

    const [loaded] = useFonts({

        'QuickSand': require('../assets/fonts/Quicksand-SemiBold.ttf')
    })
    if (!loaded) {
      return null;
    }
    return (
        <ImageBackground
      source={require('../assets/images/red2.jpg')} // Replace with the path to your image
      style={styles.backgroundImage}
    >
   
        <View style = {{flex: 1, justifyContent:"flex-start", alignItems:"center", marginBottom:10}}>
            <View style={{ alignItems: "flex-start", justifyContent: "flex-start"}}>
                <Image 
                source={require('../assets/images/full_logo.png')}
                style={styles.image}
                resizeMode="contain"/>
            </View>
            <View style = {{flex: 1, alignItems: "flex-start", width: screenWidth-20,justifyContent:"flex-start"}}> 
            <ScrollView>
            
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
                style={styles.input}
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
            onPress={() => navigation.navigate('SignUpDetails2', {role: role, gender: gender, height: height, weight: weight, goal: goal, firstName: firstName, lastName: lastName, email: email, phone: phone, age: age})}>
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
    height: 250, 
    marginHorizontal:20,
    marginTop: 10,
  },
  input: {
    width: screenWidth-40,
    height: 60,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius:9,
    marginLeft: 20,
    marginRight:20,
    marginBottom:15,
    marginTop:5,
    padding: 0,
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
    
  },

    
  });
