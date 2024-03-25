import * as React from 'react';
import { Image, FlatList, Pressable, ImageBackground, TouchableOpacity, horizontal, View, StyleSheet, Text, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts } from 'expo-font';
import NavBarBot from '../components/NavBarBot';
import { Card } from 'react-native-shadow-cards';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
const { width: screenWidth } = Dimensions.get('window');

const ListItem = ({ item }) => {
  
  return (
    <TouchableOpacity style={{marginHorizontal:12, marginVertical:10}}>
      <ImageBackground
      source={{
        uri: item.uri,
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

export default function UserProfileTrainerSide() {
const shadowopacity = screenWidth * 0.2 / screenWidth;
  const navigation = useNavigation();
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

  return (
    <View style={styles.container}>
        
        <Card style={styles.elevation(shadowopacity)}>
        <Pressable onPress={() => navigation.navigate('ProfileWithClients')}>
          <MaterialIcons name="navigate-before" size={36} color="#000000" style={{paddingTop:50, paddingHorizontal:20, backgroundColor:"#E6E9EB"}}/>
          </Pressable>
        <View style={{backgroundColor: "#E6E9EB", paddingTop:0, paddingBottom: 15,flexDirection: "column", alignItems:"center"}}>
        <Image
        source={{
          uri: 'https://e0.pxfuel.com/wallpapers/995/141/desktop-wallpaper-fitness-yoga-aesthetic.jpg',
        }}
        style={{ width: screenWidth / 2 - 80, height: 95, borderRadius: 120 }}
        resizeMode="cover"
      />
      <View style={{flexDirection: "column", alignItems: "center"}}>
      <Text style={{fontSize:24, fontFamily: 'QuickSandExtraBold', fontWeight: "300", color: "#000000"}}>
        John Doe
      </Text>
      <View style ={{flexDirection: "row"}}>
      <Text style={{fontSize:18, fontFamily: 'QuickSandMedium', color: "#000000", marginRight:15}}>22Yrs</Text>
      <Text style={{fontSize:18, fontFamily: 'QuickSandMedium', color: "#000000"}}>165cm</Text>
      <Text style={{fontSize:18, fontFamily: 'QuickSandMedium', color: "#000000", marginLeft: 15}}>68Kg</Text>
      </View>
      </View>
      
      </View>
        
      </Card>
    
      <View style={{flexDirection: "row", borderBottomWidth:0.5, borderColor: "#00000020", width:screenWidth, justifyContent: "space-between"}}>
        <Text style={{marginVertical: 10,marginHorizontal: 20,fontFamily: "QuickSandMedium", fontSize: 16, color: "#000000"}}>Workouts Completed</Text>  
        <Text style={{marginVertical: 10,marginHorizontal: 20,fontFamily: "QuickSandMedium", fontSize: 16, color: "#000000"}}>4</Text>
      </View>
      <View style={{flexDirection: "row", borderBottomWidth:0.5, borderColor: "#00000020", width:screenWidth, justifyContent: "space-between"}}>
        <Text style={{marginVertical: 10,marginHorizontal: 20,fontFamily: "QuickSandMedium", fontSize: 16, color: "#000000"}}>Trainers followed</Text>  
        <Text style={{marginVertical: 10,marginHorizontal: 20,fontFamily: "QuickSandMedium", fontSize: 16, color: "#000000"}}>1</Text>
      </View>    
      <Text style={{marginLeft:15, marginTop:10, fontFamily: "QuickSand", fontSize: 16}}>
        Recently completed
      </Text>
        
      <FlatList
        
        contentContainerStyle={{ paddingHorizontal: 10 }}
        data={SECTIONS[0].data}
        renderItem={({ item }) => <ListItem item={item} />}
        keyExtractor={(item) => item.key}
        numColumns={2} 
        showsHorizontalScrollIndicator={false}
      />

      

      
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
