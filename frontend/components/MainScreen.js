import * as React from 'react';
import { Image, FlatList, TouchableOpacity, SafeAreaView, Modal, ActivityIndicator, ScrollView, SectionList, StyleSheet, Text, View, Dimensions, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts } from 'expo-font';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import {REACT_APP_API_URL} from "@env"


const { width: screenWidth } = Dimensions.get('window');



export default function MainScreen() {

  const route = useRoute();
  const user = route.params?.user;
  const navigation = useNavigation();

  const suggestedTrainers = React.useRef([]);
  const suggestedPlans = React.useRef([]);
  const [loading, setLoading] = React.useState(false);
  const [whiteScreen, setWhiteScreen] = React.useState(false);


  React.useEffect(() => {
    setLoading(true);
    setWhiteScreen(true);

		const apiUrl = REACT_APP_API_URL + '/exercise/get_category_workouts/' + user["goal"]["goal"];
		axios.get(apiUrl)
		.then((response) => {
			console.log(response.data);
			suggestedPlans.current = response.data;
      suggestedTrainers.current = response.data[0]["trainers"];
			setLoading(false);
      setWhiteScreen(false);
		})
		.catch((error) => {
			console.log(error);
      setLoading(false);
      setWhiteScreen(false);
		})

  }, []);

  const ListItem = ({ item }) => {

    const showWorkout = () => {
      setLoading(true);
  
      const apiUrl = REACT_APP_API_URL + '/exercise/get-exercises/' + item.id;
      console.log("test : " + apiUrl);
      axios.get(apiUrl)
      .then((response) => {
        console.log(response.data);
        const exercises_data = response.data;
        const apiUrl = REACT_APP_API_URL + '/exercise/get-plan-trainer/' + item.plan_trainer;
        axios.get(apiUrl)
        .then((response) => {
          console.log(response.data);
          setLoading(false);
          navigation.navigate('StartWorkout', {user: user, workout: item, exercises: exercises_data, trainer: response.data[0]});
        }
        )
      })
      .catch((error) => {
        console.log(error);
      })    

    }

    return (
  
      <TouchableOpacity style={{marginHorizontal:5}} onPress={showWorkout}>
        <ImageBackground
        source={{
          uri: item.plan_image,
        }}
        resizeMode="cover"
        imageStyle={{ borderRadius: 9 }}
        style={{
          width: screenWidth*0.9, height: 250, borderRadius: 12, marginVertical:10,
            paddingBottom: 0,
            paddingHorizontal: 0,
        }}>
        <LinearGradient
          colors={['transparent', 'rgba(0, 0, 0, 0.75)']} 
          style={styles.gradient}
        >
        <View style={{}}>
              <Text style={styles.planName}>{item.plan_name}</Text>
              <View  style={{flexDirection: "row", justifyContent: "space-between", marginHorizontal:15}}>
              <Text style={styles.trainerName}>{item["Users"]["first_name"] + " " + item["Users"]["last_name"]}</Text>
  
              </View>
              
            </View>
        </LinearGradient>
        </ImageBackground>
      </TouchableOpacity>
    );
  };
  const ListItemTrainer = ({ item }) => {


    const showTrainerProfile = () => {
      navigation.navigate('TrainerProfileUserSide', {trainer: item, user: user});
    }

    return (
      <TouchableOpacity style={{marginHorizontal:5}} onPress={showTrainerProfile}>
      <ImageBackground
      source={{
        uri: item.profile_picture,
      }}
      resizeMode="cover"
      imageStyle={{ borderRadius: 9 }}
      style={{
        width: screenWidth*0.45, height: 250, borderRadius: 12, marginVertical:10,
          paddingBottom: 0,
          paddingHorizontal: 0,
      }}>
      <LinearGradient
        colors={['transparent', 'rgba(0, 0, 0, 0.75)']} 
        style={styles.gradient}
      >
      <View style={{}}>
            <Text style={styles.TName}>{item["first_name"] + " " + item["last_name"]}</Text>
            <View  style={{flexDirection: "row", justifyContent: "space-between", marginHorizontal:15}}>
            
            
            </View>
            
          </View>
      </LinearGradient>
      </ImageBackground>
    </TouchableOpacity>
    );
  };
  


    const [loaded] = useFonts({

      'QuickSandBold': require('../assets/fonts/Quicksand-SemiBold.ttf'),
      'QuickSand': require('../assets/fonts/Quicksand-Regular.ttf'),
      'QuickSandMedium': require('../assets/fonts/Quicksand-Medium.ttf')
    })
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
      
      <Text style={styles.headingtext}>Suggested Plans For You</Text>
      <View>
        <FlatList
          contentContainerStyle={{ paddingHorizontal: 10 }}
          data={suggestedPlans.current}
          renderItem={({ item }) => <ListItem item={item} />}
          keyExtractor={(item) => item.key}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </View>
      {loading && (
                <Modal transparent={true} animationType="fade">
                <View style={styles.modal}>
                    <ActivityIndicator size="large" color="#fff" />
                </View>
                </Modal>
      )}
      <Text style={styles.headingtext}>Suggested Trainers For You</Text>
      <View>
        <FlatList
          contentContainerStyle={{ paddingHorizontal: 10 }}
          data={suggestedTrainers.current}
          renderItem={({ item }) => <ListItemTrainer item={item} />}
          keyExtractor={(item) => item.key}
          horizontal
          showsHorizontalScrollIndicator={false}
          />
        </View>
      <View style={{marginBottom: 65}}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: 0, // Adjust this value as needed to position the content below your header
    marginTop:20
  },
  card: {
    overflow: 'hidden',
    borderRadius: 12,
    marginHorizontal:10,
    marginVertical: 20,
  },
  headingtext:{
    marginLeft:17,
    marginTop:0,
    fontSize: 16,
    fontFamily: 'QuickSandMedium',
  },
  gradient: {
    marginHorizontal:0,
    marginVertical: 0,
    flex: 1,
    justifyContent: "flex-end",
    borderRadius: 12,
  },
  planName: {
    color: "#ffffff",
    fontFamily: "QuickSandBold",
    fontSize: 24,
    marginHorizontal:15,
    marginBottom:0,
    justifyContent: "flex-end",
    alignItems: "flex-start"
},
TName: {
  color: "#ffffff",
  fontFamily: "QuickSand",
  fontSize: 18,
  marginHorizontal:10,
  marginBottom:15,
  justifyContent: "center",
  alignItems: "center"
},
trainerName: {
  color: "#ffffff",
  fontFamily: "QuickSandMedium",
  fontSize: 14,
  marginHorizontal:0,
  marginBottom:10,
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
    ],
  },
];

