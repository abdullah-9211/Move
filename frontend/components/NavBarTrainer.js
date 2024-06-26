import * as React from 'react';
import { StyleSheet, Text, View, Image, Dimensions, Pressable } from 'react-native';
import { useFonts } from 'expo-font';
import { Card } from 'react-native-shadow-cards';
import { useNavigation } from '@react-navigation/native';

export default function NavBarTrainer() {
  const navigation = useNavigation();
  const { width: screenWidth } = Dimensions.get('window');
  const [loaded] = useFonts({
    'BakbakOne': require('../assets/fonts/BakbakOne-Regular.ttf'),
    'QuickSand': require('../assets/fonts/Quicksand-SemiBold.ttf'),
  });
  if (!loaded) {
    return null;
  }

  const shadowopacity = screenWidth * 0.1 / screenWidth;

  return (
    <Card style={[basic.card, basic.elevation(shadowopacity)]}>
      <View style={{ flexDirection: "row", marginLeft: 30 }}>
        <View style={{ marginTop: 7, marginRight: 2 }}>
          <Image source={require('../assets/images/movelogo.png')}
            style={{ width: 30, height: 30 }} />
        </View>
        <Text style={{ fontFamily: 'BakbakOne', fontSize: 36, color: '#900020' }}>MOVE</Text>
      </View>
      <View style={basic.basic2}>
        <View style={basic.basic2}>
          <Pressable onPress={() => navigation.navigate('TrainerDashboard')}>
            <Text style={basic.text}>Dashboard</Text>
          </Pressable>
        </View>
        <View style={basic.basic2}>
          <Pressable onPress={() => navigation.navigate('TrainerClients')}>
            <Text style={basic.text}>Profile</Text>
          </Pressable>
        </View>
      </View>
    </Card>
  );
}

const basic = StyleSheet.create({
  basic2: {
    flex: 1,
    justifyContent:"center",
    flexDirection: "row",
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
