import * as React from 'react';
import {StyleSheet, Text, View, Pressable, Image, Icon} from 'react-native';
import { useFonts } from 'expo-font';
import {Card} from 'react-native-shadow-cards'
import { MaterialIcons } from '@expo/vector-icons';
import { Octicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons'; 
import { LinearGradient } from 'expo-linear-gradient';

export default function NavBarBot({color1, color2}) {
    const navigation = useNavigation();
    const route = useRoute();

    const user = route.params?.user;

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
                <Pressable style={basic.columnView} onPress={() => navigation.navigate('HomePage', {user: user})}>
                    <MaterialIcons name="home" size={24} color={color1} />
                    <Text style={basic.text}>Home</Text>
            
                </Pressable> 
                
                <Pressable style={basic.columnView} onPress={() => navigation.navigate('UserProfile', {user: user})}>

                    <Ionicons name="person" size={24} color={color2} />
                    <Text style={basic.text}>Profile</Text>
                </Pressable>
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