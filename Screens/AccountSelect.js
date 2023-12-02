import * as React from 'react';
import { Image, Pressable, Button, FlatList, SafeAreaView, ScrollView, SectionList, StyleSheet, Text, View, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts } from 'expo-font';
import NavBar from '../components/NavBar';
import MainScreen from '../components/MainScreen';
import NavBarBot from '../components/NavBarBot'
import { useNavigation } from '@react-navigation/native';


const { width: screenWidth } = Dimensions.get('window');

export default function AccountSelect() {
  const navigation = useNavigation();
    
    const [loaded] = useFonts({

        'QuickSand': require('../assets/fonts/Quicksand-SemiBold.ttf')
    })
    if (!loaded) {
      return null;
    }
    return (
    <LinearGradient
    colors={['#000000', '#140004', '#650016']} // Adjust gradient colors as needed
      style={{ flex: 1 }}
    >
    <View style = {{flex: 1, justifyContent: "Center"}}>
      <View style = {{flex: 1, paddingTop: 125
        , justifyContent: "center", alignItems: "center"}}> 
    
        <Image source={require('../assets/images/full_logo.png')}/>
        <Text style={styles.appName}>Innovating Your Fitness Journey</Text>
        
        
        
      </View>
      <View style={{flexDirection: "row", width: screenWidth, alignItems: "center"}}>
      <Pressable
        style={({ pressed }) => [
            styles.button,
        {
            backgroundColor: pressed ? '#140004' : '#900020',
        },
        ]}
        onPress={() => navigation.navigate('SignUpScreen')}
>
        <Text style={styles.buttonText}>
            Trainer
        </Text>
      </Pressable>
      <Pressable
        style={({ pressed }) => [
            styles.button,
        {
            backgroundColor: pressed ? '#140004' : '#900020',
        },
        ]}
        onPress={() => console.log('Pressable pressed')}>
        <Text style={styles.buttonText}>
            Member
        </Text>
      </Pressable>
      </View>
      
    </View>
    </LinearGradient>
    );
  }

  const styles = StyleSheet.create({

    appName: {
        fontSize: 20,
        fontFamily: 'QuickSand',
        color: "#ffffff"
        
    },
    buttonText: {
        fontSize: 16,
        fontFamily: 'QuickSand',
        color: "#ffffff",
    },
    button: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        height: 60,
        marginHorizontal:15,
        marginBottom:40,
        borderRadius: 9,
        marginTop:20,
    }

    
  });
