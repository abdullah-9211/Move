import * as React from 'react';
import { Image, FlatList, horizontal, View, StyleSheet, Text, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts } from 'expo-font';
import NavBarBot from '../components/NavBarBot';
import { Card } from 'react-native-shadow-cards';
import { useNavigation } from '@react-navigation/native';

const { width: screenWidth } = Dimensions.get('window');

const ListItem = ({ item }) => {
  
  return (
    <LinearGradient
      colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.8)']}
      style={[styles.gradient, { alignItems: 'center', justifyContent: 'center' }]}
    >
      <Image
        source={{
          uri: item.uri,
        }}
        style={{ width: screenWidth / 2 - 40, height: 135, borderRadius: 12 }}
        resizeMode="cover"
      />
    </LinearGradient>
  );
};

export default function UserProfile() {
const shadowopacity = screenWidth * 0.2 / screenWidth;
  const navigation = useNavigation();
  const [loaded] = useFonts({
    'QuickSand': require('../assets/fonts/Quicksand-SemiBold.ttf'),
    
  });

  if (!loaded) {
    return null;
  }

  return (
    <View style={styles.container}>
        <Card style={styles.elevation(shadowopacity)}>
        <View style={{ marginTop:60, marginLeft:30, flexDirection: "row", alignItems:"center"}}>
        <Image
        source={{
          uri: 'https://e0.pxfuel.com/wallpapers/995/141/desktop-wallpaper-fitness-yoga-aesthetic.jpg',
        }}
        style={{ width: screenWidth / 2 - 80, height: 95, borderRadius: 120 }}
        resizeMode="cover"
      />
      <View style={{flexDirection: "column", alignItems: "flex-start", marginLeft:20}}>
      <Text style={{fontSize:24, fontFamily: 'QuickSand', fontWeight: "300"}}>
        John Doe
      </Text>
      <Text style={{fontSize:18, fontFamily: 'QuickSand', fontWeight: "100"}}>Specialization</Text>
      </View>
      
        </View>
        <Text style={{marginHorizontal:30, marginTop:18, fontFamily:'QuickSand', fontSize: 18, marginBottom:5}}>About</Text>
        <View style={{marginHorizontal:25, borderLeftWidth:3, borderLeftColor: "#900020", marginBottom:10}}>
            
            <Text style={{marginLeft:2}}>Lorem Ipsum stuff stuff stuff stuff stuff stuff stuff stuff</Text>
        </View>
        </Card>
    
        
        
      <FlatList
        
        contentContainerStyle={{ paddingHorizontal: 10 }}
        data={SECTIONS[0].data}
        renderItem={({ item }) => <ListItem item={item} />}
        keyExtractor={(item) => item.key}
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
    fontFamily: 'QuickSand',
  },
  browseText: {
    marginTop: 2,
    marginRight: 20,
    fontSize: 14,
    fontFamily: 'QuickSand',
  },
  gradient: {
    marginRight:15,
    marginLeft:15,
    marginVertical: 15,
    borderRadius: 12,
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
