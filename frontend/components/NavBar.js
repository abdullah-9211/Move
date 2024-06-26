import * as React from 'react';
import { StyleSheet, Text, View, Image, Dimensions, Pressable } from 'react-native';
import { useFonts } from 'expo-font';
import { Card } from 'react-native-shadow-cards';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function NavBar({color1, color2, color3}) {
  const navigation = useNavigation();
  const route = useRoute();

  const user = route.params?.user;


  const { width: screenWidth } = Dimensions.get('window');
  const [loaded] = useFonts({
    'BakbakOne': require('../assets/fonts/BakbakOne-Regular.ttf'),
    'QuickSand': require('../assets/fonts/Quicksand-SemiBold.ttf'),
  });
  if (!loaded) {
    return null;
  }

  const logout = () => {
    navigation.navigate('Login');
  }

  const shadowopacity = screenWidth * 0.1 / screenWidth;

  return (
    <Card style={[basic.card, basic.elevation(shadowopacity)]}>
      <View style={{ flexDirection: "row", marginLeft: 20 }}>
        <View style={{ marginTop: 7, marginRight: 2 }}>
          <Image source={require('../assets/images/movelogo.png')}
            style={{ width: 30, height: 30 }} />
        </View>
        <Text style={{ fontFamily: 'BakbakOne', fontSize: 36, color: '#900020' }}>Explore</Text>
        <Text style={{ fontFamily: 'QuickSand', fontSize: 15, color: '#898D8F', marginTop:20, marginLeft: 114 }} onPress={logout}>Logout</Text>
      </View>
      <View style={basic.basic2}>
        <View style={basic.basic2}>
          <Pressable onPress={() => navigation.navigate('HomePage', {user: user})}>
            <Text style={basic.text}>For You</Text>
          </Pressable>
        </View>
        <View style={basic.basic2}>
          <Pressable onPress={() => navigation.navigate('WorkoutScreen', {user: user})}>
            <Text style={basic.text}>Workouts</Text>
          </Pressable>
        </View>
        <View style={basic.basic2}>
          <Pressable onPress={() => navigation.navigate('TrainerScreen', {user: user})}>
            <Text style={basic.text}>Trainers</Text>
          </Pressable>
        </View>
        
      </View>
      <View style={{flexDirection:"row"}}>
      <View 
						style = {{
							
							height: 1,
							backgroundColor: {color1} ,
							borderRadius: 1,
              width:screenWidth/3,
              elevation:1,
              marginTop:0,
						}}>
					</View>
          <View 
						style = {{
							
							
							height: 1,
							backgroundColor: {color2} ,
              
							borderRadius: 1,
              width:screenWidth/3,
              elevation:1,
              marginTop:0,
						}}>
            </View>
              <View 
						style = {{
							
							height: 1,
							backgroundColor: {color3} ,
							borderRadius: 1,
              
              width:screenWidth/3,
              elevation:1,
              
						}}>
					</View>
					
          
        </View>
    </Card>
  );
}

const basic = StyleSheet.create({
  basic2: {
    flex: 1,
    justifyContent: "center",
    flexDirection: "row", marginHorizontal: 5,
    alignItems: "center",
    marginTop: 10,
  },
  card: {
    position: "absolute",
    backgroundColor: 'white',
    width: '100%',
    paddingTop: 50,
  },
  elevation: (shadowOpacity) => ({
    shadowColor: 'grey',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: shadowOpacity,
    elevation: 1,
  }),
  text: {
    marginBottom: 10,
    fontSize: 16,
    fontFamily: 'QuickSand',
  },
});
