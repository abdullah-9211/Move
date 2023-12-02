import * as React from 'react';
import { Image, FlatList, SafeAreaView, ScrollView, SectionList, StyleSheet, Text, View, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts } from 'expo-font';
import * as Progress from 'react-native-progress';

const { width: screenWidth } = Dimensions.get('window');



export default function Report() {
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
        <View style={{alignItems:"center", justifyContent: 'flex-end', marginRight:20}}>
            <Text style={{fontSize:32, fontFamily: 'QuickSand', color: '#900020'}}>23:18</Text>
            <Text style={{fontSize:18,fontFamily: 'QuickSand', marginTop:30}}>
            Time Taken</Text>
        </View>
        <View style={styles.progressText}>
            <Progress.Circle size={80} indeterminate={false} progress={0.75} color='#900020' borderWidth={0.3} showsText style={styles.progressBar}/>
            <Text style={{fontSize:18,fontFamily: 'QuickSand'}}>
                Accuracy</Text>
        </View>
        
    </View>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    
    paddingTop: 0, // Adjust this value as needed to position the content below your header
    marginTop:30
  },
  progressText: {
    alignItems:"center", justifyContent: "center",
    marginLeft:20,
  },

  card: {
    overflow: 'hidden',
    borderRadius: 12,
    marginHorizontal:10,
    marginVertical: 20,
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
  gradient: {
    marginHorizontal:10,
    marginVertical: 20,
    flex: 1,
    borderRadius: 12,
  },

});

