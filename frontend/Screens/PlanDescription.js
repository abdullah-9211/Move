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
import { MaterialIcons } from '@expo/vector-icons';
const { width: screenWidth } = Dimensions.get('window');
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
  const user = route.params?.user;
  const workout = route.params?.workout;
  const exercises = route.params?.exercises;
  const trainer = route.params?.trainer;
  const [trainerName, setTrainerName] = React.useState("");
  const [totalExercises, setTotalExercises] = React.useState(0);
  const [totalDuration, setTotalDuration] = React.useState(0);
  const [exercisesData, setExercisesData] = React.useState([]);
  const [exerciseNames, setExerciseNames] = React.useState([]);


  var data = [];
  var exerciseNamesTemp = [];

  React.useEffect(() => {
    console.log(workout);
    console.log(exercises);
    console.log(trainer);
    setTrainerName(trainer["first_name"] + " " + trainer["last_name"]);

    // Iterate over exercises and add up total duration
    var total_duration = 0;
    var total_exercises = 0;
    for (var i = 0; i < exercises.length; i++) {
      if (exercises[i]["duration"] == null) {
        total_duration += exercises[i]["reps"] * 3;
        data.push({title: exercises[i]["Exercise"]["exercise_name"].charAt(0).toUpperCase() + exercises[i]["Exercise"]["exercise_name"].slice(1), description: exercises[i]["reps"] + " reps"});
      }
      else{
        total_duration += exercises[i]["duration"];
        data.push({title: exercises[i]["Exercise"]["exercise_name"].charAt(0).toUpperCase() + exercises[i]["Exercise"]["exercise_name"].slice(1), description: exercises[i]["duration"] + " seconds"});
      }
      exerciseNamesTemp.push(exercises[i]["Exercise"]["exercise_name"]);
      total_exercises += 1;

    }
    setTotalDuration(total_duration);
    setTotalExercises(total_exercises);
    setExercisesData(data);
    setExerciseNames(exerciseNamesTemp);

  }, []);

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
      source={{ uri: workout["plan_image"] }}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <LinearGradient
        colors={['rgba(0,0,0,0.2)','rgba(0,0,0,0.5)', 'rgba(255,255,255,01)']}
        style={styles.gradient}
      >
        <View style={{ flex: 1, justifyContent: "flex-start", backgroundColor: "transparent" }}>
          <Pressable onPress={() => navigation.navigate('WorkoutScreen')}>
          <MaterialIcons name="navigate-before" size={36} color="#000000" style={{paddingTop:50, marginHorizontal:20}}/>
          </Pressable>
          <View style={{ flex: 1, alignItems: "flex-start", justifyContent: "flex-end" }}>
            <Text style={styles.headingtext}>
              {workout["plan_name"]}
            </Text>
          </View>
          {/* ... (rest of your content) */}
        </View>
      </LinearGradient>
    </ImageBackground>
            <View style={{flex:1}}>
            <View style={{flexDirection: "row", marginTop:5, justifyContent: 'space-between', marginRight:20}}>
                <Text style={styles.trainerText}>
                {trainerName}
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
                  {totalDuration + " seconds"}
                </Text>
                </View>
                <View style={styles.container}>
                  {exercisesData.map((info, index) => (
                    <Card key={index} cardInfo={info} />
                  ))}
                </View>
                ``
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
