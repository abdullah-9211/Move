import * as React from 'react';
import { Image, FlatList, ImageBackground, TouchableOpacity, horizontal, Modal, ActivityIndicator, View, StyleSheet, Text, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts } from 'expo-font';
import NavBarBot from '../components/NavBarBot';
import { Card } from 'react-native-shadow-cards';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import {REACT_APP_API_URL} from "@env"

const { width: screenWidth } = Dimensions.get('window');



export default function UserProfile() {

  const ListItem = ({ item }) => {
  
    const handleWorkoutClick = (item) => () => {    
      
      setLoading(true);
      
      const apiUrl = REACT_APP_API_URL + '/user/get-workout-stats/' + item.workout_id;
      console.log("test : " + apiUrl);
      axios.get(apiUrl)
      .then((response) => {
        console.log(response.data);
        setLoading(false);
        navigation.navigate('Statistics', {user: user, duration: item.duration, accuracy: item.accuracy, workout: item.workout_id, exercises: response.data.exercises, numExercises: response.data.exerciseNum, errors: response.data.errors, error_times: response.data.error_times, exercise_translator: response.data.exercise_translator, accuracies: response.data.accuracies})
      })
      .catch((error) => {
        console.log(error);
      })    
  
    }


    return (
      <TouchableOpacity style={{marginHorizontal:12, marginVertical:10}} onPress={handleWorkoutClick(item)}> 
        <ImageBackground
        source={{
          uri: item["Workout Plan"]["plan_image"],
        }}
        resizeMode="cover"
        imageStyle={{ borderRadius: 9 }}
        style={{
          width: (screenWidth/2)-35, height: (screenWidth/2)-15, borderRadius: 9, marginBottom:15, marginTop:8,
            paddingBottom: 0,
            paddingHorizontal: 0,
        }}>
        <LinearGradient
          colors={['transparent', 'rgba(0, 0, 0, 0.75)']} 
          style={styles.gradient}
        >
        <View style={{}}>
              <Text style={styles.planName}>{item["Workout Plan"]["plan_name"]}</Text>
              <View  style={{flexDirection: "row", justifyContent: "space-between", marginHorizontal:0}}>
              <Text style={styles.trainerName}>{item["created_at"].substring(0,10)}</Text>
              
              </View>
              
            </View>
        </LinearGradient>
        </ImageBackground>
      </TouchableOpacity>
    );
  };


  React.useEffect(
    () => {
      setLoading(true);
      setWhiteScreen(true);

      const apiUrl = REACT_APP_API_URL + '/user/get-profile-info/' + user.id;
      axios.get(apiUrl)
      .then((response) => {
        WORKOUTS[0].data = response.data["Workouts Performed"]
        setNumSubscribed(response.data["Number of Subscribed"])
        setWorkoutsPerformed(response.data["Number of Workouts"])
        console.log(WORKOUTS[0].data)
        setLoading(false);
        setWhiteScreen(false);
      })
      .catch((error) => {
        console.log(error);
      })
    }, []);


const shadowopacity = screenWidth * 0.2 / screenWidth;
  const navigation = useNavigation();
  const route = useRoute();

  const user = route.params?.user;
  const [loading, setLoading] = React.useState(false);
  const [whiteScreen, setWhiteScreen] = React.useState(false);
  const [numSubscribed, setNumSubscribed] = React.useState(0);
  const [workoutsPerformed, setWorkoutsPerformed] = React.useState(0);

  const [loaded] = useFonts({
    'QuickSandBold': require('../assets/fonts/Quicksand-SemiBold.ttf'),
    'QuickSand': require('../assets/fonts/Quicksand-Regular.ttf'),
    'QuickSandExtraBold': require('../assets/fonts/Quicksand-Bold.ttf'),
    'QuickSandLight': require('../assets/fonts/Quicksand-Light.ttf'),
    'QuickSandMedium': require('../assets/fonts/Quicksand-Medium.ttf'),
  });

  if (!loaded) {
    return null;
  }

  if (loading && whiteScreen) {
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
    <View style={styles.container}>
        <Card style={styles.elevation(shadowopacity)}>
        <View style={{backgroundColor: "#E6E9EB", paddingTop:60, paddingBottom: 15,flexDirection: "column", alignItems:"center"}}>
        <Image
        source={{
          uri: user.profile_picture,
        }}
        style={{ width: screenWidth / 2 - 60, height: 125, borderRadius: 150 }}
        resizeMode="cover"
      />
      <View style={{flexDirection: "column", alignItems: "center"}}>
      <Text style={{fontSize:24, fontFamily: 'QuickSandExtraBold', fontWeight: "300", color: "#000000"}}>
        {user.first_name + " " + user.last_name}
      </Text>
      <View style ={{flexDirection: "row"}}>
      <Text style={{fontSize:18, fontFamily: 'QuickSandMedium', color: "#000000", marginRight:15}}>{user.age + " yrs"}</Text>
      <Text style={{fontSize:18, fontFamily: 'QuickSandMedium', color: "#000000"}}>{user.goal.height + " cm"}</Text>
      <Text style={{fontSize:18, fontFamily: 'QuickSandMedium', color: "#000000", marginLeft: 15}}>{user.goal.weight + " kg"}</Text>
      </View>
      </View>
      
      </View>
        
      </Card>
    
      <View style={{flexDirection: "row", borderBottomWidth:0.5, borderColor: "#00000020", width:screenWidth, justifyContent: "space-between"}}>
        <Text style={{marginVertical: 10,marginHorizontal: 20,fontFamily: "QuickSandMedium", fontSize: 16, color: "#000000"}}>Workouts Completed</Text>  
        <Text style={{marginVertical: 10,marginHorizontal: 20,fontFamily: "QuickSandMedium", fontSize: 16, color: "#000000"}}>{workoutsPerformed}</Text>
      </View>
      <View style={{flexDirection: "row", borderBottomWidth:0.5, borderColor: "#00000020", width:screenWidth, justifyContent: "space-between"}}>
        <Text style={{marginVertical: 10,marginHorizontal: 20,fontFamily: "QuickSandMedium", fontSize: 16, color: "#000000"}}>Trainers followed</Text>  
        <Text style={{marginVertical: 10,marginHorizontal: 20,fontFamily: "QuickSandMedium", fontSize: 16, color: "#000000"}}>{numSubscribed}</Text>
      </View>    
      <Text style={{marginLeft:15, marginTop:10, fontFamily: "QuickSand", fontSize: 16}}>
        Recently completed
      </Text>

      {loading && (
                <Modal transparent={true} animationType="fade">
                <View style={styles.modal}>
                    <ActivityIndicator size="large" color="#fff" />
                </View>
                </Modal>
      )}

      <FlatList
        
        contentContainerStyle={{ paddingHorizontal: 10 }}
        data={WORKOUTS[0].data}
        renderItem={({ item }) => <ListItem item={item} />}
        keyExtractor={(item) => item.workou_id}
        numColumns={2} 
        showsHorizontalScrollIndicator={false}
      />

      <View style={{ marginBottom: 65 }} />

      <NavBarBot color1= "#000000" color2="#900020"/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  card: {
    marginRight:10,
    overflow: 'hidden',
    borderRadius: 12,
    marginVertical: 20,
  },
  elevation: (shadowOpacity) => ({
    width: screenWidth,
    shadowColor: 'grey',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: shadowOpacity,
    elevation: 1,
  }),
  headingtext: {
    marginLeft: 25,
    fontSize: 16,
    color: '#000000',
    fontFamily: 'QuickSandBold',
  },
  browseText: {
    marginTop: 2,
    marginRight: 20,
    fontSize: 14,
    fontFamily: 'QuickSandBold',
  },
  gradient: {
    marginHorizontal:0,
    marginVertical: 0,
    flex: 1,
    justifyContent: "flex-end",
    borderRadius: 12,
  },
  
  trainerName: {
    color: "#ffffff",
    fontFamily: "QuickSandMedium",
    fontSize: 14,
    marginHorizontal:10,
    marginBottom:10,
    justifyContent: "flex-end",
    alignItems: "flex-start"
  },
  planName: {
    color: "#ffffff",
    fontFamily: "QuickSandBold",
    fontSize: 16,
    marginHorizontal:10,
    marginBottom:0,
    justifyContent: "flex-end",
    alignItems: "flex-start"
},
modal: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
},
});

const WORKOUTS = [
  {
    title: "Completed Workouts",
    data: [

    ]
  }
]

const SECTIONS = [
  {
    title: 'Made for you',
    horizontal: true,
    data: [
      {
        key: '1',
        text: 'Item text 1',
        uri: 'https://www.mindpumpmedia.com/hubfs/Exercise%20for%20more%20than%20just%20aesthetics.png',
      },
      {
        key: '2',
        text: 'Item text 2',
        uri: 'https://e0.pxfuel.com/wallpapers/995/141/desktop-wallpaper-fitness-yoga-aesthetic.jpg',
      },
      {
        key: '3',
        text: 'Item text 3',
        uri: 'https://media.istockphoto.com/id/1151770135/photo/athletic-woman-exercising-push-ups-in-a-health-club.jpg?s=612x612&w=0&k=20&c=c28WRyEbYfWmf0BGG6fyWo1Hwe0JxRIswfsywAsZhKI=',
      },
      {
        key: '4',
        text: 'Item text 4',
        uri: 'https://www.aestheticjunction.com/wp-content/uploads/2014/01/portfolio1.jpg',
      },
      {
        key: '5',
        text: 'Item text 5',
        uri: 'https://wallpapercave.com/wp/wp7661163.jpg',
      },
      {
        key: '6',
        text: 'Item text 6',
        uri: 'https://wallpapercave.com/wp/wp7661163.jpg',
      },
      {
        key: '7',
        text: 'Item text 2',
        uri: 'https://e0.pxfuel.com/wallpapers/995/141/desktop-wallpaper-fitness-yoga-aesthetic.jpg',
      },
      {
        key: '8',
        text: 'Item text 2',
        uri: 'https://e0.pxfuel.com/wallpapers/995/141/desktop-wallpaper-fitness-yoga-aesthetic.jpg',
      },
    ],
  },
];
