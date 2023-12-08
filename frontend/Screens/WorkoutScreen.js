import * as React from 'react';
import { Image, FlatList, SafeAreaView, Pressable, ScrollView, SectionList, StyleSheet, Text, View, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts } from 'expo-font';
import NavBarBot from '../components/NavBarBot';
import NavBar from '../components/NavBar';
import { useNavigation } from '@react-navigation/native';

const { width: screenWidth } = Dimensions.get('window');

const ListItem = ({ item }) => {
  const navigation = useNavigation();
  return (
      <LinearGradient
        colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.2)']}
        style={styles.gradient}
      >
      <Pressable onPress={() => navigation.navigate('StartWorkout')}>
      <Image
        source={{
          uri: item.uri,
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
    const [loaded] = useFonts({

        'QuickSand': require('../assets/fonts/Quicksand-SemiBold.ttf')
    })
    if (!loaded) {
      return null;
    }
  return (
    <View style={styles.container}>
      <NavBar />
      <ScrollView style={{marginTop:120}}>
      <View style={{flex:1, flexDirection: "row"}}>
      <Text style={styles.headingtext}>FITNESS</Text>
      <View style={{flex:1, alignItems:"flex-end"}}>
      <Pressable onPress={() => navigation.navigate('WorkoutsFitness')}>
        <Text style={styles.browseText}>Browse All</Text>
      </Pressable>
      </View>
      </View>
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
      <View style={{flex:1, flexDirection: "row"}}>
      <Text style={styles.headingtext}>STRENGTH</Text>
      <View style={{flex:1, alignItems:"flex-end"}}>
      <Pressable onPress={() => navigation.navigate('WorkoutsStrength')}>
        <Text style={styles.browseText}>Browse All</Text>
      </Pressable>
      </View>
      </View>
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
      <View style={{flex:1, flexDirection: "row"}}>
      <Text style={styles.headingtext}>ENDURANCE</Text>
      <View style={{flex:1, alignItems:"flex-end"}}>
      <Pressable onPress={() => navigation.navigate('WorkoutsEndurance')}>
        <Text style={styles.browseText}>Browse All</Text>
      </Pressable>
      </View>
      </View>
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
      <View style={{flex:1, flexDirection: "row"}}>
      <Text style={styles.headingtext}>WEIGHT LOSS</Text>
      <View style={{flex:1, alignItems:"flex-end"}}>
      <Pressable onPress={() => navigation.navigate('WorkoutsWeightLoss')}>
        <Text style={styles.browseText}>Browse All</Text>
      </Pressable>
      </View>
      </View>
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
      <View style={{flex:1, flexDirection: "row"}}>
      <Text style={styles.headingtext}>YOGA</Text>
      <View style={{flex:1, alignItems:"flex-end"}}>
      <Pressable onPress={() => navigation.navigate('WorkoutsYoga')}>
        <Text style={styles.browseText}>Browse All</Text>
      </Pressable>
      </View>
      </View>
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
      <View style={{flex:1, flexDirection: "row"}}>
      <Text style={styles.headingtext}>TONING</Text>
      <View style={{flex:1, alignItems:"flex-end"}}>
      <Pressable onPress={() => navigation.navigate('WorkoutsToning')}>
        <Text style={styles.browseText}>Browse All</Text>
      </Pressable>
      </View>
      </View>
      
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

