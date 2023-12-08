import * as React from 'react';
import { StyleSheet, Image, Text, View, Dimensions} from 'react-native';
import { useFonts } from 'expo-font';
import NavBarBot from '../components/NavBarBot';
import Report from '../components/Report';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
const { width: screenWidth } = Dimensions.get('window');

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
    <View style={styles.borderstuff}>
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
        <View style={{flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
        <Icon name="fire" size={30} color="#900020" />
        <Text>+1</Text>
        </View>
      
      <Report />
      <View style={{ flex: 1, justifyContent: "flex-end", alignItems: "center", marginBottom: 100 }}>
  <Text style={styles.heading}>Badges Progressed</Text>
  <View style={{ flexDirection: "row", marginTop: 20 }}>
    <Image
      source={require('../assets/images/clock.png')}
      style={{ width: 70, height: 60 }}
      resizeMode="center"
    />
    <Image
      source={require('../assets/images/clock.png')}
      style={{ width: 80, height: 60 }}
      resizeMode="center"
    />
    <Image
      source={require('../assets/images/clock.png')}
      style={{ width: 80, height: 60 }}
      resizeMode="center"
    />
    <Image
      source={require('../assets/images/clock.png')}
      style={{ width: 80, height: 60 }}
      resizeMode="center"
    />
  </View>
</View>
    </View>
    <NavBarBot />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30,
  },
  borderstuff:{
    alignItems: 'center',
    flex:1,
    borderRightWidth: 4,
    borderColor: "#900020",
    borderLeftWidth: 4,
    borderColor: "#900020",
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
