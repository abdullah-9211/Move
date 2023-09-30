import * as React from 'react';
import {StyleSheet, Text, View, Image, Icon} from 'react-native';
import { useFonts } from 'expo-font';
import {Card} from 'react-native-shadow-cards'
import { MaterialIcons } from '@expo/vector-icons';
import { Octicons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons'; 

export default function NavBarBot() {
    const [loaded] = useFonts({

        'QuickSand': require('../assets/fonts/Quicksand-SemiBold.ttf'),
        'QuickSand-regular': require('../assets/fonts/Quicksand-Regular.ttf')
    })
    if (!loaded) {
      return null;
    }
  
    return (
        <Card style={[basic.card, basic.elevation]}>
            <View style={basic.basic2}>
                <View style={basic.columnView}>
                    <MaterialIcons name="fitness-center" size={24} color="#900020" />
                    <Text style={basic.text}>Workouts</Text>
            
                </View> 
                <View style={basic.columnView}>
                    <Octicons name="checklist" size={24} color="black" />
                    <Text style={basic.text}>Your Plan</Text>
                </View>
                <View style={basic.columnView}>
                    <Ionicons name="person" size={24} color="black" />
                    <Text style={basic.text}>Profile</Text>
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

    },
    columnView: {
        flex: 1,
        justifyContent: "center",
        flexDirection:"column", marginHorizontal: 5, 
        alignItems: "center",

    },
    card: {  
        position: "absolute",
        paddingBottom:10,
        paddingTop:10,
        backgroundColor: 'white',  
        width: '100%',  
        borderTopWidth: 2, // Border width
        borderTopColor: '#900020', // Border color
        bottom: 0,
    },  
    elevation: {  
        shadowColor: 'black',
            shadowOffset: {
              width: 0,
              height: -20,
            },
        

        elevation: 10, 
    },    
    text: {
        marginTop:5,
        fontSize: 12,
        fontFamily: 'QuickSand-regular',
        
    }
});