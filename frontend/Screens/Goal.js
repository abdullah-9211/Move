import * as React from 'react';
import { Image, FlatList, Pressable, SafeAreaView, ScrollView, SectionList, StyleSheet, Text, View, Dimensions, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts } from 'expo-font';
import { useNavigation, useRoute } from '@react-navigation/native';

const { width: screenWidth } = Dimensions.get('window');


export default function Goal() {
  const navigation = useNavigation();
  const route = useRoute();

  const role = route.params.role;
  const gender = route.params.gender;
  const height = route.params.height;
  const weight = route.params.weight;

  const [goal, setgoal] = React.useState('');

  const ListItem = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => setgoal(item.text)}>
        <LinearGradient
          colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.2)']}
          style={styles.gradient}
        >
        <Image
          source={{
            uri: item.uri,
          }}
          style={{width: screenWidth*0.85, height: 170, borderRadius: 12}}
          resizeMode="cover"
        />
        </LinearGradient>
      </TouchableOpacity>
    );
  };
  

    const [loaded] = useFonts({

        'QuickSand': require('../assets/fonts/Quicksand-SemiBold.ttf')
    })
    if (!loaded) {
      return null;
    }
  return (
    <View style={styles.container}>
      
        
      <View style={{flex:1, justifyContent: "center", alignItems: "center"}}>
        <Text style={styles.textStyle}>Select Your Goal</Text>
      </View>
      
      <View style={{flex:5, justifyContent: "center", alignItems:"center"}}>
        <FlatList
          contentContainerStyle={{ paddingHorizontal: 10 }}
          data={SECTIONS[0].data}
          renderItem={({ item }) => <ListItem item={item} />}
          keyExtractor={(item) => item.key}
          vertical
          showsVerticalScrollIndicator={false}
        />
      </View>
      <Pressable
                style={({ pressed }) => [styles.button,
            {
                backgroundColor: pressed ? '#140004' : '#900020',
            },
                ]}
            onPress={() => navigation.navigate('SignUpDetails', {role: role, gender: gender, weight: weight, height: height, goal: goal})}>
            <Text style={styles.buttonText}>
                Continue
            </Text>
            </Pressable>

      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  card: {
    overflow: 'hidden',
    borderRadius: 12,
    marginHorizontal:10,
    marginVertical: 20,
  },
  textStyle:{
    marginTop:50,
    fontFamily: 'QuickSand',
    fontSize: 30,
    color: "#000000",
   },
  headingtext:{
    marginLeft:17,
    fontSize: 16,
    fontFamily: 'QuickSand',
  },
  gradient: {
    marginHorizontal:10,
    marginVertical: 20,
    flex: 1,
    borderRadius: 12,
  },
  buttonText: {
    fontSize: 16,
    fontFamily: 'QuickSand',
    color: "#ffffff",
},
button: {

    width: screenWidth-20,
    justifyContent: "center",
    alignItems: "center",
    height: 60,
    marginHorizontal:10,
    borderRadius: 9,
    marginBottom:25,
},

});

const SECTIONS = [
  {
    title: 'Made for you',
    horizontal: false,
    data: [
      {
        key: '1',
        text: 'Endurance',
        uri: 'https://www.mindpumpmedia.com/hubfs/Exercise%20for%20more%20than%20just%20aesthetics.png',
      },
      {
        key: '2',
        text: 'Yoga',
        uri: 'https://e0.pxfuel.com/wallpapers/995/141/desktop-wallpaper-fitness-yoga-aesthetic.jpg',
      },

      {
        key: '3',
        text: 'Toning',
        uri: 'https://media.istockphoto.com/id/1151770135/photo/athletic-woman-exercising-push-ups-in-a-health-club.jpg?s=612x612&w=0&k=20&c=c28WRyEbYfWmf0BGG6fyWo1Hwe0JxRIswfsywAsZhKI=',
      },
      {
        key: '4',
        text: 'Weight Loss',
        uri: 'https://www.aestheticjunction.com/wp-content/uploads/2014/01/portfolio1.jpg',
      },
      {
        key: '5',
        text: 'Strength',
        uri: 'https://wallpapercave.com/wp/wp7661163.jpg',
      },
    ],
  },
];

