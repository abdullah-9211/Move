// const React = require('react');
import * as React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { ScrollView, ImageBackground, Pressable, StyleSheet, Text, View, Dimensions} from 'react-native';
import NavBar from '../components/NavBar';
import MainScreen from '../components/MainScreen';
import NavBarBot from '../components/NavBarBot'
import { useNavigation, useRoute } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const { width: screenWidth } = Dimensions.get('window');
const Card = ({ cardInfo}) => {
  return (
    <View style={styles.card}>
      <Text style={styles.cardText}>{cardInfo.title}</Text>
      <Text style={styles.cardText}>{cardInfo.description}</Text>
    </View>
  );
};
export default function StartWorkout() {

  const route = useRoute();
  const user = route.params?.user;


  const data = [
    { title: 'Pushups', description: 'X10' },
    { title: 'Plank', description: '60 seconds' },
  ];
  const navigation = useNavigation();
    const [loaded] = useFonts({

        'QuickSand': require('../assets/fonts/Quicksand-SemiBold.ttf')
    })
    if (!loaded) {
      return null;
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
            {/* Main image or any other components you want to overlay */}
          </View>
          <View style={{ flex: 1, alignItems: "flex-start", justifyContent: "flex-end" }}>
            <Text style={styles.headingtext}>
              Workout Name
            </Text>
          </View>
          {/* ... (rest of your content) */}
        </View>
      </LinearGradient>
    </ImageBackground>
            <View style={{flex:1}}>
            <View style={{flexDirection: "row", marginTop:5, justifyContent: 'space-between', marginRight:20}}>
                <Text style={styles.trainerText}>
                Trainer Name
                </Text>
                <View style={{flexDirection: 'row', marginTop:3}}>
                <Icon name="dumbbell" size={20} color="#000000" style={styles.icon}/>
                <Text style={styles.subtext}>
                  Strength
                </Text>
                </View>
              </View>
                <View style={{flexDirection: "row", marginTop:5}}>
                <Icon name="clock-outline" size={20} color="#000000" style={styles.icon}/>
                <Text style={styles.subtext}>
                  120 seconds
                </Text>
                </View>
                <View style={styles.container}>
                  {data.map((info, index) => (
                    <Card key={index} cardInfo={info} />
                  ))}
                </View>
                <Pressable style={{flex:1, justifyContent: "flex-end"}} onPress={() => navigation.navigate('CameraScreen', {workouts:2})}>
                  <View style={styles.button}>
                  
                  <Text style={{color:"#ffffff", fontFamily: "QuickSand", fontSize:16}}>Start Workout</Text>
                
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
    
  
  });
