// const React = require('react');
import * as React from 'react';
import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Header from './components/AppHeader';
import NavBar from './components/NavBar';
import MainScreen from './components/MainScreen';
import NavBarBot from './components/NavBarBot'
import LinearGradient from 'react-native-linear-gradient';

export default function App() {
  return (
    <View style = {{flex: 1, justifyContent: "flex-start"}}> 
    
      <Header />
      <NavBar />
      <ScrollView>
      <MainScreen />
      </ScrollView>
      <NavBarBot />

      
      
    </View>
  );
}