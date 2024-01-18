import * as React from 'react';
import { Image, FlatList, SafeAreaView, Pressable, ScrollView, SectionList, StyleSheet, Text, View, Dimensions, ActivityIndicator, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts } from 'expo-font';
import NavBarBot from '../components/NavBarBot';
import NavBar from '../components/NavBar';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import {API_URL} from "@env"


const { width: screenWidth } = Dimensions.get('window');

const ListItem = ({ item }) => {
  const navigation = useNavigation();

  const route = useRoute();
  const user = route.params?.user;


  return (
      <LinearGradient
        colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.2)']}
        style={styles.gradient}
      >
      <Pressable onPress={() => navigation.navigate('StartWorkout', {user: user})}>
      <Image
        source={{
          uri: item.plan_image,
        }}
        style={{width: 135, height: 135, borderRadius: 9}}
        resizeMode="cover"
      />
      </Pressable>
      </LinearGradient>
      
  );
};


export default function Workouts() {
  const navigation = useNavigation();
  const route = useRoute();

  const user = route.params?.user;

  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {

    // fetch workouts from backend using axios and store in arrays
    setLoading(true);
    const apiUrl = API_URL + '/exercise/get-all-workouts';
    axios.get(apiUrl)
    .then((response) => {
      console.log(response.data);
      WORKOUTS[0].data = response.data["Strength"];
      WORKOUTS[1].data = response.data["Endurance"];
      WORKOUTS[2].data = response.data["Weight Loss"];
      WORKOUTS[3].data = response.data["Yoga"];
      WORKOUTS[4].data = response.data["Toning"];
      setLoading(false);
    })
    .catch((error) => {
      console.log(error);
      setLoading(false);
    })
  }, []);


    const [loaded] = useFonts({

        'QuickSand': require('../assets/fonts/Quicksand-SemiBold.ttf')
    })
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
      <ScrollView style={{marginTop:120}}>
      {loading && (
                <Modal transparent={true} animationType="fade">
                <View style={styles.modal}>
                    <ActivityIndicator size="large" color="#fff" />
                </View>
                </Modal>
      )}
      <View style={{flex:1, flexDirection: "row"}}>
      <Text style={styles.headingtext}>STRENGTH</Text>
      <View style={{flex:1, alignItems:"flex-end"}}>
      <Pressable onPress={() => navigation.navigate('WorkoutsStrength', {user: user, workouts: WORKOUTS[0].data})}>
        <Text style={styles.browseText}>Browse All</Text>
      </Pressable>
      </View>
      </View>
      <View>
        <FlatList
          contentContainerStyle={{ paddingHorizontal: 10 }}
          data={WORKOUTS[0].data}
          renderItem={({ item }) => <ListItem item={item} />}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </View>
      <View style={{flex:1, flexDirection: "row"}}>
      <Text style={styles.headingtext}>ENDURANCE</Text>
      <View style={{flex:1, alignItems:"flex-end"}}>
      <Pressable onPress={() => navigation.navigate('WorkoutsEndurance', {user: user, workouts: WORKOUTS[1].data})}>
        <Text style={styles.browseText}>Browse All</Text>
      </Pressable>
      </View>
      </View>
      <View>
        <FlatList
          contentContainerStyle={{ paddingHorizontal: 10 }}
          data={WORKOUTS[1].data}
          renderItem={({ item }) => <ListItem item={item} />}
          keyExtractor={(item) => item.key}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </View>
      <View style={{flex:1, flexDirection: "row"}}>
      <Text style={styles.headingtext}>WEIGHT LOSS</Text>
      <View style={{flex:1, alignItems:"flex-end"}}>
      <Pressable onPress={() => navigation.navigate('WorkoutsWeightLoss', {user: user, workouts: WORKOUTS[2].data})}>
        <Text style={styles.browseText}>Browse All</Text>
      </Pressable>
      </View>
      </View>
      <View>
        <FlatList
          contentContainerStyle={{ paddingHorizontal: 10 }}
          data={WORKOUTS[2].data}
          renderItem={({ item }) => <ListItem item={item} />}
          keyExtractor={(item) => item.key}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </View>
      <View style={{flex:1, flexDirection: "row"}}>
      <Text style={styles.headingtext}>YOGA</Text>
      <View style={{flex:1, alignItems:"flex-end"}}>
      <Pressable onPress={() => navigation.navigate('WorkoutsYoga', {user: user, workouts: WORKOUTS[3].data})}>
        <Text style={styles.browseText}>Browse All</Text>
      </Pressable>
      </View>
      </View>
      <View>
        <FlatList
          contentContainerStyle={{ paddingHorizontal: 10 }}
          data={WORKOUTS[3].data}
          renderItem={({ item }) => <ListItem item={item} />}
          keyExtractor={(item) => item.key}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </View>
      <View style={{flex:1, flexDirection: "row"}}>
      <Text style={styles.headingtext}>TONING</Text>
      <View style={{flex:1, alignItems:"flex-end"}}>
      <Pressable onPress={() => navigation.navigate('WorkoutsToning', {user: user, workouts: WORKOUTS[4].data})}>
        <Text style={styles.browseText}>Browse All</Text>
      </Pressable>
      </View>
      </View>
      
      <View>
        <FlatList
          contentContainerStyle={{ paddingHorizontal: 10 }}
          data={WORKOUTS[4].data}
          renderItem={({ item }) => <ListItem item={item} />}
          keyExtractor={(item) => item.key}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </View>
      <View style={{marginBottom: 65}}/>
      </ScrollView>
      <NavBarBot />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: 70, // Adjust this value as needed to position the content below your header
  },
  card: {
    overflow: 'hidden',
    borderRadius: 12,
    marginHorizontal:10,
    marginVertical: 20,
  },
  headingtext:{
    marginLeft:25,
    fontSize: 16,
    fontFamily: 'QuickSand',
  },
  browseText:{

    marginTop:2,
    marginRight:20,
    fontSize: 14,
    fontFamily: 'QuickSand',
  },
  gradient: {
    marginHorizontal:10,
    marginVertical: 20,
    flex: 1,
    borderRadius: 12,
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
    title: 'Strength',
    horizontal: true,
    data:[]
  },
  {
    title: 'Endurance',
    horizontal: true,
    data:[]
  },
  {
    title: 'Weight Loss',
    horizontal: true,
    data:[]
  },
  {
    title: 'Yoga',
    horizontal: true,
    data:[]
  },
  {
    title: 'Toning',
    horizontal: true,
    data:[]
  },
]


// Dummy data for list, MUST REPLACE WITH ACTUAL DATA
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

