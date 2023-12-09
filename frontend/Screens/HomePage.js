// const React = require('react');
import * as React from 'react';
import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, Text, View, Dimensions} from 'react-native';
import { useRoute } from '@react-navigation/native';
import NavBar from '../components/NavBar';
import MainScreen from '../components/MainScreen';
import NavBarBot from '../components/NavBarBot'

const { width: screenWidth } = Dimensions.get('window');

export default function HomePage() {

  const route = useRoute();
  const user = route.params?.user;

    return (
      <View style = {{flex: 1, justifyContent: "flex-start", backgroundColor:"#FFFFFF"}}> 
      
        <NavBar />
        <ScrollView style={{marginTop:160}}> 
        <MainScreen />
        </ScrollView>
        <NavBarBot />
  
        
        
      </View>
    );
  }
