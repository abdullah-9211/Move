import * as React from 'react';
import { Image, Pressable, ImageBackground,TextInput, Button, FlatList, SafeAreaView, ScrollView, SectionList, StyleSheet, Text, View, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts } from 'expo-font';
import Header from '../components/AppHeader';
import NavBar from '../components/NavBar';
import MainScreen from '../components/MainScreen';
import NavBarBot from '../components/NavBarBot'
import { useNavigation } from '@react-navigation/native';


const { width: screenWidth } = Dimensions.get('window');

export default function SignUpDetails2() {
    const navigation = useNavigation();

    
    const [name, setName] = React.useState('');
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
                placeholder="Name"
                value={name}
                onChangeText={(text) => setName(text)}
            />
            <Text style={styles.textStyle}>Confirm Password</Text>
            <TextInput
                style={styles.input}
                placeholder="email"
                value={name}
                onChangeText={(text) => setName(text)}
            />
            <View style={{flex:1, justifyContent: "flex-end"}}>
            <Pressable
                style={({ pressed }) => [styles.button,
            {
                backgroundColor: pressed ? '#140004' : '#900020',
            },
                ]}
            onPress={() => console.log('Pressable pressed')}>
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

    
  });
