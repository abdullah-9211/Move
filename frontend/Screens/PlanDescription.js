// const React = require('react');
import * as React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { ScrollView, ImageBackground, Pressable, StyleSheet, Text, View, Dimensions, Modal, ActivityIndicator} from 'react-native';
import NavBar from '../components/NavBar';
import MainScreen from '../components/MainScreen';
import NavBarBot from '../components/NavBarBot'
import { useNavigation, useRoute } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { MaterialIcons } from '@expo/vector-icons';
const { width: screenWidth } = Dimensions.get('window');
import axios from 'axios';
import {REACT_APP_API_URL} from "@env"

const Card = ({ cardInfo}) => {
  return (
    <View style={styles.card}>
      <Text style={styles.cardText}>{cardInfo.title}</Text>
      <Text style={styles.cardText}>{cardInfo.description}</Text>
    </View>
  );
};
export default function PlanDescription() {

  const route = useRoute();
  const trainer = route.params?.user;
  const workout = route.params?.workout;

  const [loading, setLoading] = React.useState(false);
  const total_duration = React.useRef(0);
  const [exercisesData, setExercisesData] = React.useState([]);


  React.useEffect(() => {
    console.log(workout);
    console.log(trainer);


    var data = [];
    setLoading(true);

    const apiUrl = REACT_APP_API_URL + '/exercise/get-exercises/' + workout["id"];
    axios.get(apiUrl)
      .then((res) => {
        console.log(res.data);
        total_duration.current = res.data[0]["total_duration"];
        for (var i = 0; i < res.data.length; i++) {
          if (res.data[i]["duration"] == null) {
            data.push({title: res.data[i]["Exercise"]["exercise_name"].charAt(0).toUpperCase() + res.data[i]["Exercise"]["exercise_name"].slice(1), description: res.data[i]["reps"] + " reps"});
          }
          else{
            data.push({title: res.data[i]["Exercise"]["exercise_name"].charAt(0).toUpperCase() + res.data[i]["Exercise"]["exercise_name"].slice(1), description: res.data[i]["duration"] + " seconds"});
          }
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error(`Error fetching data: ${error}`);
        setLoading(false);
      });

    setExercisesData(data);
    


  }, []);

  const navigation = useNavigation();
    const [loaded] = useFonts({

        'QuickSand': require('../assets/fonts/Quicksand-SemiBold.ttf')
    })
    if (!loaded) {
      return null;
    }

	  if (loading) {
      return (
        <View style={{position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, backgroundColor: 'white'}}>
          <Modal transparent={true} animationType="fade">
          <View style={styles.modal}>
            <ActivityIndicator size="large" color="#fff" />
          </View>
          </Modal>
        </View>
      );
      }

    return (

      <View style = {{flex: 1, justifyContent: "flex-start", backgroundColor:"#FFFFFF"}}>
             <ImageBackground
      source={{ uri: workout["plan_image"] }}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <LinearGradient
        colors={['rgba(0,0,0,0.2)','rgba(0,0,0,0.5)', 'rgba(255,255,255,01)']}
        style={styles.gradient}
      >
        <View style={{ flex: 1, justifyContent: "flex-start", backgroundColor: "transparent" }}>
          <Pressable onPress={() => navigation.goBack()}>
          <MaterialIcons name="navigate-before" size={36} color="#000000" style={{paddingTop:50, marginHorizontal:20}}/>
          </Pressable>
          <View style={{ flex: 1, alignItems: "flex-start", justifyContent: "flex-end" }}>
            <Text style={styles.headingtext}>
              { workout["plan_name"] }
            </Text>
          </View>
          {/* ... (rest of your content) */}
        </View>
      </LinearGradient>
    </ImageBackground>
            <View style={{flex:1}}>
            <View style={{flexDirection: "row", marginTop:5, justifyContent: 'space-between', marginRight:20}}>
                <Text style={styles.trainerText}>
                {trainer.first_name + " " + trainer.last_name}
                </Text>
                <View style={{flexDirection: 'row', marginTop:3}}>
                <Icon name="dumbbell" size={20} color="#000000" style={styles.icon}/>
                <Text style={styles.subtext}>
                  {workout["workout_type"]}
                </Text>
                </View>
              </View>
                <View style={{flexDirection: "row", marginTop:5}}>
                <Icon name="clock-outline" size={20} color="#000000" style={styles.icon}/>
                <Text style={styles.subtext}>
                  {total_duration.current + " seconds"}
                </Text>
                </View>
                <View style={styles.container}>
                  {exercisesData.map((info, index) => (
                    <Card key={index} cardInfo={info} />
                  ))}
                </View>
                
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
      marginTop:50,
      flex: 1,
      // justifyContent: 'center',
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
    modal: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
      },
    
  
  });
