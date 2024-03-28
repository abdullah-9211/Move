import * as React from 'react';
import { StyleSheet, Image, Text, View, Dimensions, TouchableOpacity, FlatList, Pressable, } from 'react-native';
import { useFonts } from 'expo-font';
import { useState } from 'react';
import NavBarBot from '../components/NavBarBot';
import Report from '../components/Report';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation, useRoute } from '@react-navigation/native';
const { width: screenWidth } = Dimensions.get('window');



export default function WorkoutCompleted() {
  const route = useRoute();
  const navigation = useNavigation();

  const user = route.params?.user;
  const workout = route.params?.workout;
  const duration = route.params?.duration;
  const accuracy = route.params?.accuracy;

  const [loaded] = useFonts({
    'QuickSandBold': require('../assets/fonts/Quicksand-SemiBold.ttf'),
    'QuickSand': require('../assets/fonts/Quicksand-Regular.ttf'),
    'BakbakOne': require('../assets/fonts/BakbakOne-Regular.ttf'),

  });

  if (!loaded) {
    return null;
  }

  // Assuming workout progress as a percentage (0 to 100)
  const workoutProgress = 75; // Change this value based on your actual progress
  
  
  const goAhead = () => {
    if (user["user_type"] == "user"){
      navigation.navigate('UserProfile', {user: user});
    }
    else{
      navigation.goBack();
    }
  }

  return (
    <View style={styles.container}>
    <View style={styles.borderstuff}>
      <View style={{backgroundColor: "#000000", width: screenWidth}}>
      <Text style={[styles.heading2, {marginLeft: 20, paddingTop:20}]}>Congratulations!</Text>
      <Text style={[styles.heading, {marginLeft:20, marginBottom: 10}]}>Workout Completed</Text>
      </View>
        
      
      <Report />
      <Pressable onPress={goAhead}>
      <View 
                style = {{
                    alignItems: "center",
                    backgroundColor: "#900020",
                    borderRadius: 9,
                    paddingVertical: 19,
					          marginTop:20,
                    bottom: 0,
                    marginBottom:12,
                    width: screenWidth*0.9,
                    marginHorizontal: 25,
                }}>
                <Text 
                    style = {{
                        color: "#ffffff",
                        fontSize: 16,
                        
                        fontFamily: "QuickSandBold"
                    }}>
                    {"Continue"}
                </Text>
            </View>
          </Pressable>
    </View>
    
    
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 0,
    backgroundColor: "#ffffff",
  },
  borderstuff:{
    alignItems: 'center',
    flex:1,
    borderRightWidth: 4,
    borderColor: "#900020",
    borderLeftWidth: 4,
    borderColor: "#900020",
  },
  
  heading: {
    fontSize: 18,
    fontFamily: 'QuickSand',
    color: '#ffffff',
    marginTop: 10,
  },
  subtext: {
    fontSize: 16,
    fontFamily: 'QuickSand',
  },
  heading2: {
    fontSize: 30,
    
    fontFamily: 'QuickSandBold',
    color: '#ffffff',
    marginTop: 20,
  },

});
