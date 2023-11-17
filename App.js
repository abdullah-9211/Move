import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
// import theme from './core/theme'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SignUpScreen from './Screens/SignUpScreen'
import SignUpDetails from './Screens/SignUpDetails'
import SignUpDetails2 from './Screens/SignUpDetails2'
import SignUpDetails3 from './Screens/SignUpDetails3'

import HomePage from './Screens/HomePage'
import Goal from './Screens/Goal';

const Stack = createStackNavigator()

export default function App() {
  return (
    
    // <Provider theme= {theme}>

      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="SignUpScreen"
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="SignupScreen" component={SignUpScreen}/>
          <Stack.Screen name="SignUpDetails" component={SignUpDetails}/>
          <Stack.Screen name="SignUpDetails2" component={SignUpDetails2}/>
          <Stack.Screen name="SignUpDetails3" component={SignUpDetails3}/>
          <Stack.Screen name="HomePage" component={HomePage}/>
    
          <Stack.Screen name="Goal" component={Goal}/>
          
        </Stack.Navigator>
      </NavigationContainer>
    // </Provider>
  );
}
    