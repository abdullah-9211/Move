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

       'QuickSand': require('../assets/fonts/Quicksand-SemiBold.ttf'),
        'QuickSand2': require('../assets/fonts/Quicksand-Regular.ttf'),
        
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
        onPress={() => navigation.navigate('GenderSelect', {role: "trainer"})}
>
        <Text style={styles.buttonText}>
            Sign Up As Trainer
        </Text>
      </Pressable>
      <Pressable
        style={({ pressed }) => [
            styles.button,
        {
            backgroundColor: pressed ? '#140004' : '#900020',
        },
        ]}
        onPress={() => navigation.navigate('GenderSelect', {role: "user"})}>
        <Text style={styles.buttonText}>
            Sign Up As User
        </Text>
      </Pressable>
      </View>
      <Pressable
        style={({ pressed }) => [
            styles.existingUser,
        
        ]}
        onPress={() => navigation.navigate('SignUpScreen')}>
        <Text style={styles.SignInText}>
            Existing User?
        </Text>
      </Pressable>
     
      
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
    existingUser: {
      justifyContent: "flex-start", alignItems: "center", marginBottom: 20,
    },
    buttonText: {
        fontSize: 16,
        fontFamily: 'QuickSand',
        color: "#ffffff",
    },
    SignInText: {
      fontSize: 15,
      fontFamily: 'QuickSand2',
      textDecorationLine: "underline",
      color: "#ffffff",
  },
    button: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        height: 60,
        marginHorizontal:12,
        marginBottom:10,
        borderRadius: 9,
        marginTop:20,
    }

    
  });
