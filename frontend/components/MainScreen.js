import * as React from 'react';
import { Image, FlatList, TouchableOpacity, SafeAreaView, ScrollView, SectionList, StyleSheet, Text, View, Dimensions, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts } from 'expo-font';
import { useRoute } from '@react-navigation/native';

const { width: screenWidth } = Dimensions.get('window');

const ListItem = ({ item }) => {
  return (
    <TouchableOpacity style={{marginHorizontal:5}}>
      <ImageBackground
      source={{
        uri: item.uri,
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
            <Text style={styles.planName}>Plan Name</Text>
            <View  style={{flexDirection: "row", justifyContent: "space-between", marginHorizontal:15}}>
            <Text style={styles.trainerName}>Trainer name</Text>
            <View style={{flexDirection: "row"}}>
              <Text style={styles.trainerName}>Beginner</Text>
              <Text style={styles.trainerName}> - </Text>
              <Text style={styles.trainerName}>3 weeks</Text>
            </View>
            </View>
            
          </View>
      </LinearGradient>
      </ImageBackground>
    </TouchableOpacity>
  );
};
const ListItemTrainer = ({ item }) => {
  return (
    <TouchableOpacity style={{marginHorizontal:5}}>
    <ImageBackground
    source={{
      uri: item.uri,
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
          <Text style={styles.TName}>Trainer Name</Text>
          <View  style={{flexDirection: "row", justifyContent: "space-between", marginHorizontal:15}}>
          <Text style={styles.trainerName}>Speciality</Text>
          
          </View>
          
        </View>
    </LinearGradient>
    </ImageBackground>
  </TouchableOpacity>
  );
};


export default function MainScreen() {

  const route = useRoute();
  const user = route.params?.user;


    const [loaded] = useFonts({

      'QuickSandBold': require('../assets/fonts/Quicksand-SemiBold.ttf'),
      'QuickSand': require('../assets/fonts/Quicksand-Regular.ttf'),
      'QuickSandMedium': require('../assets/fonts/Quicksand-Medium.ttf')
    })
    if (!loaded) {
      return null;
    }
  return (
    <View style={styles.container}>
      <Text style={styles.headingtext}>Suggested Plans For You</Text>
      <View>
        <FlatList
          contentContainerStyle={{ paddingHorizontal: 10 }}
          data={SECTIONS[0].data}
          renderItem={({ item }) => <ListItem item={item} />}
          keyExtractor={(item) => item.key}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </View>
      <Text style={styles.headingtext}>Suggested Trainers For You</Text>
      <View>
        <FlatList
          contentContainerStyle={{ paddingHorizontal: 10 }}
          data={SECTIONS[0].data}
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
  marginBottom:0,
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

