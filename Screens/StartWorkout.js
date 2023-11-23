// const React = require('react');
import * as React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, Text, View, Dimensions} from 'react-native';
import NavBar from '../components/NavBar';
import MainScreen from '../components/MainScreen';
import NavBarBot from '../components/NavBarBot'

const { width: screenWidth } = Dimensions.get('window');

export default function StartWorkout() {
    return (

      <View style = {{flex: 1, justifyContent: "flex-start", backgroundColor:"#FFFFFF"}}>
            <LinearGradient
            colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.2)']}
            style={styles.gradient}
            >

                <View>
                    {/* main image */}
                </View>
            </LinearGradient>
            <View>
                
            </View>
        
      </View>
      
    );
  }
  const styles = StyleSheet.create({

    gradient: {
      marginHorizontal:10,
      marginVertical: 20,
      flex: 1,
      borderRadius: 12,
    },
  
  });
