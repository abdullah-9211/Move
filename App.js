import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
// import theme from './core/theme'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SignUpScreen from './Screens/SignUpScreen'
import SignUpDetails from './Screens/SignUpDetails'
import SignUpDetails2 from './Screens/SignUpDetails2'
import SignUpDetails3 from './Screens/SignUpDetails3'
import Workouts from './Screens/WorkoutScreen';
import HomePage from './Screens/HomePage'
import Goal from './Screens/Goal';
import StartWorkout from './Screens/StartWorkout';
import Trainers from './Screens/TrainerScreen';
import WorkoutsFitness from './Screens/WorkoutsFitness';
import WorkoutsEndurance from './Screens/WorkoutsEndurance';
import WorkoutsWeightLoss from './Screens/WorkoutsWeightLoss';
import WorkoutsStrength from './Screens/WorkoutsStrength';
import WorkoutsToning from './Screens/WorkoutsToning';
import WorkoutsYoga from './Screens/WorkoutsYoga';
import CameraScreen from './Screens/CameraScreen';
import AccountSelect from './Screens/AccountSelect';
import Statistics from './Screens/Statistics';

const Stack = createStackNavigator()

export default function App() {
  return (
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Statistics"
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="AccountSelect" component={AccountSelect}/>
          <Stack.Screen name="SignUpScreen" component={SignUpScreen}/>
          <Stack.Screen name="SignUpDetails" component={SignUpDetails}/>
          <Stack.Screen name="SignUpDetails2" component={SignUpDetails2}/>
          <Stack.Screen name="SignUpDetails3" component={SignUpDetails3}/>
          <Stack.Screen name="HomePage" component={HomePage}/>
          <Stack.Screen name="Goal" component={Goal}/>
          <Stack.Screen name="WorkoutScreen" component={Workouts}/>
          <Stack.Screen name="TrainerScreen" component={Trainers}/>
          <Stack.Screen name="StartWorkout" component={StartWorkout}/>
          <Stack.Screen name="WorkoutsFitness" component={WorkoutsFitness}/>
          <Stack.Screen name="WorkoutsWeightLoss" component={WorkoutsWeightLoss}/>
          <Stack.Screen name="WorkoutsEndurance" component={WorkoutsEndurance}/>
          <Stack.Screen name="WorkoutsStrength" component={WorkoutsStrength}/>
          <Stack.Screen name="WorkoutsToning" component={WorkoutsToning}/>
          <Stack.Screen name="WorkoutsYoga" component={WorkoutsYoga}/>
          <Stack.Screen name="CameraScreen" component={CameraScreen}/>
          <Stack.Screen name="Statistics" component={Statistics}/>
          

          
        </Stack.Navigator>
      </NavigationContainer>
  );
}
    