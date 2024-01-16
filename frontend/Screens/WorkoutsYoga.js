import * as React from 'react';
import { Image, FlatList, horizontal, View, StyleSheet, Text, Dimensions, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts } from 'expo-font';
import NavBarBot from '../components/NavBarBot';
import NavBar from '../components/NavBar';
import { useNavigation, useRoute } from '@react-navigation/native';

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
          uri: item.uri,
        }}
        style={{ width: screenWidth / 2 - 40, height: 135, borderRadius: 9 }}
        resizeMode="cover"
      />
      </Pressable>
    </LinearGradient>
  );
};

export default function WorkoutsYoga() {
  const navigation = useNavigation();
  const route = useRoute();
  const user = route.params?.user;

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
        <Text style={styles.headingtext}>YOGA</Text>
        <Image source={require('../assets/images/filter.png')} 
          style={{ marginLeft: 10, width: 20, height: 20 }} />
      </View>
        <Image source={require('../assets/images/sort.png')}
            style={{ width: 20, height: 20 }} />
      </View>

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
    marginHorizontal: 20,
    marginVertical: 20,
    flex: 1,
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
