import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
// import theme from './core/theme'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Workouts from './Workouts';
import SignUpScreen from './Screens/SignUpScreen'
import SignUpDetails from './Screens/SignUpDetails'

const Stack = createStackNavigator()

export default function App() {
  return (
    
    // <Provider theme= {theme}>

      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="SignUpDetails"
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="SignupScreen" component={SignUpScreen}/>
          <Stack.Screen name="SignUpDetails" component={SignUpDetails}/>
          <Stack.Screen name="MainScreen" component={Workouts}/>
          
        </Stack.Navigator>
      </NavigationContainer>
    // </Provider>
  );
}
    