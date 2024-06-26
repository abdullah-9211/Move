import * as React from 'react';
import { Image, FlatList, TouchableOpacity,ImageBackground, horizontal, View, StyleSheet, Text, Pressable, Modal, ActivityIndicator, Dimensions } from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';
import { useFonts } from 'expo-font';
import NavBarBot from '../components/NavBarBot';
import NavBar from '../components/NavBar';
import { useNavigation, useRoute } from '@react-navigation/native';
import TrainerProfile from './TrainerProfile';
import axios from 'axios';
import {REACT_APP_API_URL} from "@env"

const { width: screenWidth } = Dimensions.get('window');


export default function TrainerScreen() {

const ListItem = ({ item }) => {

  const navigation = useNavigation();

  const route = useRoute();
  const user = route.params?.user;
  const workouts = route.params?.workouts;

  
  return (
    <TouchableOpacity style={{marginHorizontal:12, marginVertical:0}} onPress={() => navigation.navigate('TrainerProfileUserSide', {user: user, trainer: item})}>
    <ImageBackground
    source={{
      uri: item.profile_picture,
    }}
    resizeMode="cover"
    imageStyle={{ borderRadius: 9 }}
    style={{
      width: (screenWidth/2)-35, height: (screenWidth/2)-5, borderRadius: 9, marginBottom:15, marginTop:8,
        paddingBottom: 0,
        paddingHorizontal: 0,
    }}>
    <LinearGradient
      colors={['transparent', 'rgba(0, 0, 0, 0.75)']} 
      style={styles.gradient}
    >
    <View style={{}}>
          <Text style={styles.planName}>{item.first_name + " " + item.last_name}</Text>
          <View  style={{flexDirection: "row", justifyContent: "space-between", marginHorizontal:0}}>
          {/* <Text style={styles.trainerName}>{specializations[Math.floor(Math.random() * 5)]}</Text>
           */}
          </View>
          
        </View>
    </LinearGradient>
    </ImageBackground>
  </TouchableOpacity>
  );
};
// const ListItem = ({ item }) => {
//   const navigation = useNavigation();
//   return (
//     <LinearGradient
//       colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.2)']}
//       style={styles.gradient}
//     >
//       <Pressable onPress={() => navigation.navigate('TrainerProfile')}>
//       <Image
//         source={{
//           uri: item.uri,
//         }}
//         style={{ width: screenWidth / 2 - 40, height: 160, borderRadius: 180 }}
//         resizeMode="cover"
//       />
//       </Pressable>
//     </LinearGradient>

//   );
// };


  const navigation = useNavigation();
  const route = useRoute();

  const user = route.params?.user;
  const workouts = route.params?.workouts;
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    setLoading(true);

    const apiUrl = REACT_APP_API_URL + '/user/get-trainers';
    axios.get(apiUrl)
    .then((response) => {
      console.log(response.data);
      TRAINERS.data = response.data;
      setLoading(false);
    })
    .catch((error) => {
      console.log(error);
    })
  }, []);


  const [loaded] = useFonts({
    'QuickSand': require('../assets/fonts/Quicksand-SemiBold.ttf'),
  });

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
    <View style={styles.container}>
      <NavBar />
      <View style={{marginTop:91, marginBottom: 70}}>

      <FlatList
        contentContainerStyle={{ paddingHorizontal: 10 }}
        data={TRAINERS.data}
        renderItem={({ item }) => <ListItem item={item} />}
        keyExtractor={(item) => item.id}
        numColumns={2} // Set the number of columns to 2
        showsHorizontalScrollIndicator={false}
      />
      </View>


      <NavBarBot color1= "#900020" color2="#000000"/>
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
    marginVertical: 0,
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
    marginBottom:15,
    justifyContent: "flex-end",
    alignItems: "flex-start"
},
  gradient: {
    marginHorizontal:0,
    marginVertical: 0,
    flex: 1,
    justifyContent: "flex-end",
    borderRadius: 12,
  },
  modal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
});

const TRAINERS = [
  {
    title: "Trainers",
    data: [

    ]
  }
]

const specializations = [
  "Strength",
  "Weight Loss",
  "Yoga",
  "Endurance",
  "Toning",
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