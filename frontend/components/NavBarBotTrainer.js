import * as React from 'react';
import {StyleSheet, Text, View, Image, Icon, Pressable} from 'react-native';
import { useFonts } from 'expo-font';
import {Card} from 'react-native-shadow-cards'
import { MaterialIcons } from '@expo/vector-icons';
import { Octicons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons'; 
import { useNavigation, useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

export default function NavBarBotTrainer({ color1, color2 }) {
    const navigation = useNavigation();
    const route = useRoute();
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
                <Pressable style={basic.columnView} onPress={() => navigation.navigate('TrainerHomepage')}>
                    <MaterialIcons name="assignment" size={24} color={color1}/>
                    <Text style={basic.text}>Reports</Text>
                </Pressable>
            
                </View> 
                
                <View style={basic.columnView}>
                <Pressable style={basic.columnView} onPress={() => navigation.navigate('ProfileWithPlans')}>
                    <Ionicons name="person" size={24} color={color2}/>
                    <Text style={basic.text}>Profile</Text>
                </Pressable>
                </View>

                
            </View>
           
        </Card>
    );
}

const basic =  StyleSheet.create({
    basic2: {
        backgroundColor:"white",
        flex: 1,
        justifyContent: "center",
        flexDirection:"row",
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
        paddingBottom:15,
        paddingTop:10,
        width: '100%',  

        bottom: 0,
    },  
    elevation: {  
        shadowColor: 'black',
            shadowOffset: {
              width: 0,
              height: -1,
            },
        shadowOpacity:0.1,
        

        elevation: 2, 
    },    
    text: {
        marginTop:5,
        fontSize: 12,
        fontFamily: 'QuickSand-regular',
        
    }
});