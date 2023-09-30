import * as React from 'react';
import {StyleSheet, Text, View, Image} from 'react-native';
import { useFonts } from 'expo-font';
import {Card} from 'react-native-shadow-cards'

export default function NavBar() {
    const [loaded] = useFonts({

        'QuickSand': require('../assets/fonts/Quicksand-SemiBold.ttf')
    })
    if (!loaded) {
      return null;
    }
  
    return (
        <Card style={[basic.card, basic.elevation]}>
            <View style={basic.basic2}>
                <View style={basic.basic2}>
                    <Text style={basic.text}>For You</Text>
                    
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
        marginTop: 20,

    },
    card: {  
        position: "absolute",

        backgroundColor: 'white',  
        width: '100%',  
        paddingTop: 80,
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