import * as React from 'react';
import { Image, Pressable, ImageBackground,TextInput, Button, FlatList, SafeAreaView, ScrollView, SectionList, StyleSheet, Text, View, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts } from 'expo-font';
import NavBar from '../components/NavBar';
import MainScreen from '../components/MainScreen';
import NavBarBot from '../components/NavBarBot'
import { useNavigation } from '@react-navigation/native';


const { width: screenWidth } = Dimensions.get('window');

export default function SignUpDetails3() {
    const navigation = useNavigation();

    
    const [name, setName] = React.useState('');
    const [loaded] = useFonts({

        'QuickSand': require('../assets/fonts/Quicksand-SemiBold.ttf')
    })
    if (!loaded) {
      return null;
    }

    const handlePress = () => {
        // Store information (replace 'info' with the actual information)
    // setUser('info');
    navigation.navigate('Goal');

    };

    return (
    //     <ImageBackground
    //   source={require('../assets/images/red2.jpg')} // Replace with the path to your image
    //   style={styles.backgroundImage}
    // >
        <View style={{flex:1}}>
            <View style={{flex:1, justifyContent: "center", alignItems: "center", justifyContent:"flex-end", marginTop:20}}>
                <Text style={styles.textStyle}>Select Your Gender</Text>
            </View>
            <View style={{ flex:3, flexDirection:'row', alignItems: "center", justifyContent: "center", marginTop:75}}>
            <Pressable onPress={handlePress}>
                    <Image
                        source={require('../assets/images/3.png')}
                        style={styles.image}
                        resizeMode="contain"
                    />
                </Pressable>
                <Pressable onPress={handlePress}>
                    <Image
                        source={require('../assets/images/1.png')}
                        style={styles.image}
                        resizeMode="contain"
                    />
                </Pressable>
                
                
          
            </View>
            <View style={{flex:1, marginBottom:20,justifyContent: "center", alignItems:"center",marginTop:20}}>
                <Pressable onPress={handlePress}>
                    <Text style={{ fontFamily: "QuickSand", fontSize: 16 }}>Prefer Not to Say</Text>
                </Pressable>
            </View>
        </View>
        
    //   </ImageBackground>
    );
  }

  const styles = StyleSheet.create({

   textStyle:{
    fontFamily: 'QuickSand',
    fontSize: 30,
    color: "#000000",
   },
   image: {
    width: 150,
    height: 400, 
    marginTop: 20,
  },




    
  });
