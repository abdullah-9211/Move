import * as React from 'react';
import {StyleSheet, Text, View, Image} from 'react-native';
import { useFonts } from 'expo-font';

export default function AppHeader() {
    const [loaded] = useFonts({
        'BakbakOne': require('../assets/fonts/BakbakOne-Regular.ttf'),
        'QuickSand': require('../assets/fonts/Quicksand-SemiBold.ttf')
    })
    if (!loaded) {
      return null;
    }
  
    return (
        <View style={{paddingTop: 40, paddingLeft: 20, marginTop: 10, elevation:12}}>
            <View style={{flexDirection: "row",}}>
                <View style={{ marginTop:7, marginRight:2}}>
                <Image source={require('../assets/images/movelogo.png')} 
                style={{ width: 30, height: 30 }}/>
                </View>
                <Text style={{ fontFamily: 'BakbakOne', fontSize: 36, color: '#900020'}}>Explore</Text> 
            </View>
        </View>
    )
}
