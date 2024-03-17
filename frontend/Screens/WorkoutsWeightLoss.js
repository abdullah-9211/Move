import * as React from 'react';
import { Image, FlatList, ImageBackground, TouchableOpacity,horizontal, View, StyleSheet, Text, Dimensions, Pressable, Modal, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts } from 'expo-font';
import NavBarBot from '../components/NavBarBot';
import NavBar from '../components/NavBar';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import {REACT_APP_API_URL} from "@env"

const { width: screenWidth } = Dimensions.get('window');


export default function WorkoutsWeightLoss() {

  const ListItem = ({ item }) => {

    const navigation = useNavigation();
  
    const route = useRoute();
    const user = route.params?.user;
    const workouts = route.params?.workouts;
  
    const handleWorkoutClick = (item) => () => {
      setLoading(true);
  
      const apiUrl = REACT_APP_API_URL + '/exercise/get-exercises/' + item.id;
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
      <TouchableOpacity style={{marginHorizontal:12, marginVertical:10}} onPress={handleWorkoutClick(item)}>
      <ImageBackground
      source={{
        uri: item.plan_image,
      }}
      resizeMode="cover"
      imageStyle={{ borderRadius: 9 }}
      style={{
        width: (screenWidth/2)-35, height: (screenWidth/2)-25, borderRadius: 9, marginBottom:15, marginTop:8,
          paddingBottom: 0,
          paddingHorizontal: 0,
      }}>
      <LinearGradient
        colors={['transparent', 'rgba(0, 0, 0, 0.75)']} 
        style={styles.gradient}
      >
      <View style={{}}>
            <Text style={styles.planName}>Plan Name</Text>
            <View  style={{flexDirection: "row", justifyContent: "space-between", marginHorizontal:0}}>
            <Text style={styles.trainerName}>Trainer name</Text>
            
            </View>
            
          </View>
      </LinearGradient>
      </ImageBackground>
    </TouchableOpacity>
    );
  };

  
  const navigation = useNavigation();
  const route = useRoute();
  const user = route.params?.user;
  const workouts = route.params?.workouts;
  const [loading, setLoading] = React.useState(false);


  const [loaded] = useFonts({
    'QuickSand': require('../assets/fonts/Quicksand-SemiBold.ttf'),
  });

  if (!loaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={{marginTop: 10, flexDirection:"row",justifyContent: "space-between", alignItems: "center", marginRight:25}}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Text style={styles.headingtext}>WEIGHT LOSS</Text>
        <Image source={require('../assets/images/filter.png')} 
          style={{ marginLeft: 10, width: 20, height: 20 }} />
      </View>
        <Image source={require('../assets/images/sort.png')}
            style={{ width: 20, height: 20 }} />
      </View>
      {loading && (
                <Modal transparent={true} animationType="fade">
                <View style={styles.modal}>
                    <ActivityIndicator size="large" color="#fff" />
                </View>
                </Modal>
      )}
      <FlatList
        contentContainerStyle={{ paddingHorizontal: 10 }}
        data={workouts}
        renderItem={({ item }) => <ListItem item={item} />}
        keyExtractor={(item) => item.id}
        numColumns={2} 
        showsHorizontalScrollIndicator={false}
      />

      <View style={{ marginBottom: 65 }} />

      <NavBarBot />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: 70,
  },
  card: {
    marginRight:10,
    overflow: 'hidden',
    borderRadius: 12,
    marginVertical: 20,
  },
  headingtext: {
    marginLeft: 25,
    fontSize: 16,
    color: '#000000',
    fontFamily: 'QuickSand',
  },
  browseText: {
    marginTop: 2,
    marginRight: 20,
    fontSize: 14,
    fontFamily: 'QuickSand',
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
