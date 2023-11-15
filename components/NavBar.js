import * as React from 'react';
import {StyleSheet, Text, View, Image, Pressable} from 'react-native';
import { useFonts } from 'expo-font';
import {Card} from 'react-native-shadow-cards'
import { useNavigation } from '@react-navigation/native';


export default function NavBar() {
    const navigation = useNavigation();
    const [loaded] = useFonts({

        'QuickSand': require('../assets/fonts/Quicksand-SemiBold.ttf')
    })
    if (!loaded) {
      return null;
    }
    
  
    return (
        <Card style={[basic.card, basic.elevation]}>
            <View style={{flexDirection: "row", marginLeft:20}}>
                <View style={{ marginTop:7, marginRight:2}}>
                <Image source={require('../assets/images/movelogo.png')} 
                style={{ width: 30, height: 30 }}/>
                </View>
                <Text style={{ fontFamily: 'BakbakOne', fontSize: 36, color: '#900020'}}>Explore</Text> 
            </View>
            <View style={basic.basic2}>
                <View style={basic.basic2}>
                <Pressable onPress={() => navigation.navigate('Workouts.js')}>
                    <Text style={basic.text}>For You</Text>
                    </Pressable>
                </View> 
                <View style={basic.basic2}>
                    <Text style={basic.text}>Workouts</Text>
                </View>
                <View style={basic.basic2}>
                    <Text style={basic.text}>Trainers</Text>
                </View>
            </View>
           
        </Card>
    );
}

const basic =  StyleSheet.create({
    basic2: {
        flex: 1,
        justifyContent: "center",
        flexDirection:"row", marginHorizontal: 5, 
        alignItems: "center",
        marginTop: 10,

    },
    card: {  
        position: "absolute",

        backgroundColor: 'white',  
        width: '100%',  
        paddingTop: 50,
    },  
    elevation: {  
        shadowColor: 'grey',
            shadowOffset: {
              width: 0,
              height: 10,
            },
        shadowOpacity: 20,

        elevation: 10, 
    },    
    text: {
        marginBottom:10,
        fontSize: 16,
        fontFamily: 'QuickSand',
        
    }
});