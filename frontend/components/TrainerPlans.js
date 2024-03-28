import * as React from 'react';
import { Image, FlatList, ImageBackground, SafeAreaView, ScrollView, SectionList, StyleSheet, Text, View, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts } from 'expo-font';
import * as Progress from 'react-native-progress';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useRoute } from '@react-navigation/native';


const ListItem = ({ item }) => {
  return(
    <ImageBackground 
                  source={{uri:item.plan_image}} 
                  resizeMode="cover"
                  imageStyle={{ flex:1, width: screenWidth/2 - 40, borderRadius: 9, marginHorizontal:20}}
                  style={{
                      width: screenWidth/2 - 40,
                      paddingTop: 90,
                      paddingBottom: 0,
                      paddingHorizontal: 0,
                  }}
              >
                  <LinearGradient
                      style={styles.gradientOverlay}
                      colors={['transparent', 'rgba(0, 0, 0, 1)']}
                  >
                      <View style={{marginHorizontal:11, paddingBottom:9}}>
                      <Text style={styles.planName}>{item.plan_name}</Text>
                      
                      <Text style={styles.trainerName}>{"abdullah" + " " + "Umar"}</Text>
                      </View>
                  </LinearGradient>
              </ImageBackground>
  );
      };
const { width: screenWidth } = Dimensions.get('window');

export default function TrainerPlans() {

  const route = useRoute();

  const user = route.params?.user;
  const workout = route.params?.workout;
  const duration = route.params?.duration;
  const accuracy = route.params?.accuracy;

  const [Accuracy, setAccuracy] = React.useState(0);

  React.useEffect(() => {
    setAccuracy(Math.round(accuracy));
    console.log(Accuracy, duration);
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
    <View 
					style = {{
						flexDirection: "row",
						justifyContent: "space-between",
						alignItems: "center",
						marginBottom: 9,
						marginHorizontal: 8,
					}}>
					
				
				<FlatList
					contentContainerStyle={{ paddingHorizontal: 10}}
					data={PLANS}
					renderItem={({ item }) => <ListItem item={item} />}
					keyExtractor={(item) => item.id}
					numColumns={2} // Set the number of columns to 2
					showsHorizontalScrollIndicator={false}
					nestedScrollEnabled={true}
				/>
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
  basic2: {
    backgroundColor:"white",
    flex: 1,
    justifyContent: "center",
    flexDirection:"row",
    alignItems: "center",

},
TrainerName: {
    color: "#000000",
    fontSize: 24,
    fontFamily: 'QuickSandBold',
},
trainerName: {
    color: "#ffffff",
fontSize: 14,
marginBottom: 2,
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: 'QuickSand',
},
planName: {
    color: "#ffffff",
    fontFamily: "QuickSandBold",
    fontSize: 18,
},
container: {
    width: screenWidth, 
    alignItems:'center'
},
gradientOverlay: {
width: screenWidth/2 -40,
    paddingTop:20,
marginHorizontal:20,
    borderBottomLeftRadius: 9,
    borderBottomRightRadius: 9,
},
buttonText: {
fontSize: 16,
fontFamily: 'QuickSand',
color: "#ffffff",
},
button: {


},
  

});

const PLANS = [
	{id:1, plan_image: 'https://www.aestheticjunction.com/wp-content/uploads/2014/01/portfolio1.jpg', plan_name: 'Plan name 1'},
	{id:2, plan_image: 'https://www.aestheticjunction.com/wp-content/uploads/2014/01/portfolio1.jpg', plan_name: 'Plan name 2'},
	{id:3, plan_image: 'https://www.aestheticjunction.com/wp-content/uploads/2014/01/portfolio1.jpg', plan_name: 'Plan name 3'},
	{id:4, plan_image: 'https://www.aestheticjunction.com/wp-content/uploads/2014/01/portfolio1.jpg', plan_name: 'Plan name 4'},
	{id:5, plan_image: 'https://www.aestheticjunction.com/wp-content/uploads/2014/01/portfolio1.jpg', plan_name: 'Plan name 5'},
]