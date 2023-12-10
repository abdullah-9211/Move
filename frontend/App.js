import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
// import theme from './core/theme'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SignUpScreen from './Screens/SignUpScreen'
import SignUpDetails from './Screens/SignUpDetails'
import SignUpDetails2 from './Screens/SignUpDetails2'
import SignUpDetails3 from './Screens/GenderSelect'
import Workouts from './Screens/WorkoutScreen';
import HomePage from './Screens/HomePage'
import Goal from './Screens/Goal';
import StartWorkout from './Screens/StartWorkout';
import TrainerScreen from './Screens/TrainerScreen';
import WorkoutsFitness from './Screens/WorkoutsFitness';
import WorkoutsEndurance from './Screens/WorkoutsEndurance';
import WorkoutsWeightLoss from './Screens/WorkoutsWeightLoss';
import WorkoutsStrength from './Screens/WorkoutsStrength';
import WorkoutsToning from './Screens/WorkoutsToning';
import WorkoutsYoga from './Screens/WorkoutsYoga';
import CameraScreen from './Screens/CameraScreen';
import AccountSelect from './Screens/AccountSelect';
import Statistics from './Screens/Statistics';
import Login from './Screens/Login';
import TrainerDashboard from './Screens/TrainerDashboard';
import TrainerClients from './Screens/TrainerClients';
import TrainerProfile from './Screens/TrainerProfile';
import UserProfile from './Screens/UserProfile';
import Goal2 from './Screens/Goal2';
const Stack = createStackNavigator()

export default function App() {
  return (
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="StartWorkout"
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="AccountSelect" component={AccountSelect}/>
          <Stack.Screen name="SignUpScreen" component={SignUpScreen}/>
          <Stack.Screen name="SignUpDetails" component={SignUpDetails}/>
          <Stack.Screen name="SignUpDetails2" component={SignUpDetails2}/>
          <Stack.Screen name="GenderSelect" component={SignUpDetails3}/>
          <Stack.Screen name="HomePage" component={HomePage}/>
          <Stack.Screen name="Goal" component={Goal}/>
          <Stack.Screen name="WorkoutScreen" component={Workouts}/>
          <Stack.Screen name="TrainerScreen" component={TrainerScreen}/>
          <Stack.Screen name="StartWorkout" component={StartWorkout}/>
          <Stack.Screen name="WorkoutsFitness" component={WorkoutsFitness}/>
          <Stack.Screen name="WorkoutsWeightLoss" component={WorkoutsWeightLoss}/>
          <Stack.Screen name="WorkoutsEndurance" component={WorkoutsEndurance}/>
          <Stack.Screen name="WorkoutsStrength" component={WorkoutsStrength}/>
          <Stack.Screen name="WorkoutsToning" component={WorkoutsToning}/>
          <Stack.Screen name="WorkoutsYoga" component={WorkoutsYoga}/>
          <Stack.Screen name="CameraScreen" component={CameraScreen}/>
          <Stack.Screen name="Statistics" component={Statistics}/>
          <Stack.Screen name="Login" component={Login}/>
          <Stack.Screen name="TrainerDashboard" component= {TrainerDashboard}/>
          <Stack.Screen name="TrainerClients" component= {TrainerClients}/>
          <Stack.Screen name= "TrainerProfile" component={TrainerProfile}/>
          <Stack.Screen name= "UserProfile" component={UserProfile}/>
          <Stack.Screen name= "Goal2" component={Goal2}/>
          

          
        </Stack.Navigator>
      </NavigationContainer>
  );
}
    