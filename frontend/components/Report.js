import * as React from 'react';
import { Image, FlatList, SafeAreaView, ScrollView, SectionList, StyleSheet, Text, View, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts } from 'expo-font';
import * as Progress from 'react-native-progress';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useRoute } from '@react-navigation/native';


const { width: screenWidth } = Dimensions.get('window');

export default function Report() {

  const route = useRoute();

  const user = route.params?.user;
  const workout = route.params?.workout;
  const duration = route.params?.duration;
  const accuracy = route.params?.accuracy;

  React.useEffect(() => {
    console.log(accuracy, duration);
  }, []);

    const [loaded] = useFonts({

        'QuickSand': require('../assets/fonts/Quicksand-SemiBold.ttf')
    })
    if (!loaded) {
      return null;
    }
    const workoutProgress1 = 75;
    const workoutProgress2 = 75;
  return (
    <View style={styles.container}>
      <View style={{flexDirection:"row"}}>
      <View style={styles.progressText}>
            <Text style={{fontSize:32, fontFamily: 'QuickSand', color: '#900020'}}>32</Text>
            <Text style={{fontSize:18,fontFamily: 'QuickSand', marginTop:10}}>
            Days In A Row</Text>
        </View>
        <View style={styles.progressText}>
            <Text style={{fontSize:32, fontFamily: 'QuickSand', color: '#900020'}}>{duration}</Text>
            <Text style={{fontSize:18,fontFamily: 'QuickSand', marginTop:10}}>
            Duration</Text>
        </View>
        
        
    </View>
    <View style={{flexDirection:"row"}}>
        <View style={styles.progressText}>
            <Progress.Circle size={80} indeterminate={false} progress={accuracy/100} color='#900020' borderWidth={0.3} showsText style={styles.progressBar}/>
            <Text style={{fontSize:18,fontFamily: 'QuickSand'}}>
                Accuracy</Text>
        </View>
        <View style={styles.progressText}>
            <Progress.Circle size={80} indeterminate={false} progress={0.90} color='#900020' borderWidth={0.3} showsText style={styles.progressBar}/>
            <Text style={{fontSize:18,fontFamily: 'QuickSand'}}>
               Avg Accuracy</Text>
        </View>
    </View>
    
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    
    paddingTop: 0, // Adjust this value as needed to position the content below your header
    marginTop:50
  },
  progressText: {
    alignItems:"center", justifyContent: "center",
    marginHorizontal:20,
    marginVertical:20,
  },
  progressBar: {
    marginHorizontal:20,
  },
  headingtext:{
    marginLeft:17,
    fontSize: 16,
    fontFamily: 'QuickSand',
  },
  progressBarContainer: {
    width: '80%',
    height: 20,
    backgroundColor: '#e0e0e0', // Background color of the progress bar container
    borderRadius: 10,

  },
  

});

