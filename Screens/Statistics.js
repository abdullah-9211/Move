import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useFonts } from 'expo-font';
import NavBarBot from '../components/NavBarBot';
import Report from '../components/Report';

export default function WorkoutCompleted() {
  const [loaded] = useFonts({
    'Quicksand': require('../assets/fonts/Quicksand-SemiBold.ttf'),
  });

  if (!loaded) {
    return null;
  }

  // Assuming workout progress as a percentage (0 to 100)
  const workoutProgress = 75; // Change this value based on your actual progress

  return (
    <View style={styles.container}>
      <Text style={styles.heading2}>Congratulations!</Text>
      <Text style={styles.heading}>Workout Completed</Text>
      <View style={styles.level}>
        <Text style={styles.subtext}> Level 2</Text>
        <Text style={styles.subtext}> +32 XP</Text>
      </View>
      <View style={styles.progressBarContainer}>

        <View style={[styles.progressBar, { width: `${workoutProgress}%` }]}>
          <View style={styles.progressBarTextContainer}>
            <Text style={styles.progressBarText}>{`126/200 XP`}</Text>
          </View>
        </View>
      </View>
        <Text>+1</Text>
      
      <Report />
      <NavBarBot />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 50,
  },
  level: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    width: '80%',
    marginTop: 10,
    marginBottom: 3, // Adjust as needed
  },
  heading: {
    fontSize: 21,
    fontFamily: 'Quicksand',
    color: '#000000',
    marginTop: 10,
  },
  subtext: {
    fontSize: 14,
    fontFamily: 'Quicksand',
  },
  heading2: {
    fontSize: 30,
    fontWeight: 'bold',
    fontFamily: 'Quicksand',
    color: '#900020',
    marginTop: 20,
  },
  progressBarTextContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressBarText: {
    color: 'white',
    fontSize: 14,
    marginBottom: 4,
    fontFamily: 'Quicksand',
  },
  progressBarContainer: {
    width: '80%',
    height: 20,
    backgroundColor: '#e0e0e0', // Background color of the progress bar container
    borderRadius: 10,

  },
  progressBar: {
    height: '100%',
    borderRadius: 10,
    position: 'relative',
    backgroundColor: '#900020', // Color of the progress bar
  },
});
