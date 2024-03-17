import * as React from 'react';
import { TouchableOpacity, SafeAreaView, ScrollView, ImageBackground, Image, FlatList, View, StyleSheet, Icon, Text, Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import NavBarBotTrainer from '../components/NavBarBotTrainer';
import NavBar from '../components/NavBar';
import NavBarTrainer from '../components/NavBarTrainer';
import NavBarBot from '../components/NavBarBot';
import { useFonts } from 'expo-font';
import { useNavigation, useRoute } from '@react-navigation/native';

const { width: screenWidth } = Dimensions.get('window');
const TrainerHomepage = () => {

    const route = useRoute();
    const trainer = route.params?.user;

    const ListItem = ({ item }) => {

        const navigation = useNavigation();
      
        const route = useRoute();
        const user = route.params?.user;
        const workouts = route.params?.workouts;
      
        const handleWorkoutClick = (item) => () => {
          setLoading(true);
      
          const apiUrl = API_URL + '/exercise/get-exercises/' + item.id;
          axios.get(apiUrl)
          .then((response) => {
            console.log(response.data);
            const exercises_data = response.data;
            const apiUrl = API_URL + '/exercise/get-plan-trainer/' + item.plan_trainer;
            axios.get(apiUrl)
            .then((response) => {
              console.log(response.data);
              setLoading(false);
              navigation.navigate('StartWorkout', {user: user, workout: item, exercises: exercises_data, trainer: response.data[0]});
            }
            )
          })
          .catch((error) => {
            console.log(error);
          })    
      
        }
      
        
        return (
          <TouchableOpacity style={{marginHorizontal:0, marginVertical:0}} onPress={handleWorkoutClick(item)}>
          <ImageBackground
          source={{
            uri: item.profile_picture,
          }}
          resizeMode="cover"
          imageStyle={{ borderRadius: 75 }}
          style={{
            width: (screenWidth/2)-25, height: (screenWidth/2)-25, borderRadius: 75, marginBottom:5, marginTop:8, marginHorizontal:7,
              paddingBottom: 0,
              paddingHorizontal: 0,
          }}>
          <LinearGradient
            colors={['transparent', 'rgba(0, 0, 0, 0.75)']} 
            style={styles.gradient}
          >
          <View style={{marginBottom: 30, justifyContent: "center", alignItems: "center"}}>
                <Text style={styles.planName}>Client Name</Text>
                
                
              </View>
          </LinearGradient>
          </ImageBackground>
        </TouchableOpacity>
        );
      };



    const [loaded] = useFonts({
        'QuickSandBold': require('../assets/fonts/Quicksand-SemiBold.ttf'),
      'QuickSand': require('../assets/fonts/Quicksand-Regular.ttf'),
      'QuickSandMedium': require('../assets/fonts/Quicksand-Medium.ttf'),
        'BakbakOne': require('../assets/fonts/BakbakOne-Regular.ttf'),
      });
      const user = route.params?.user;
  const workouts = route.params?.workouts;
  const [loading, setLoading] = React.useState(false);

      React.useEffect(() => {
        console.log(trainer);
        }, []);
    
      if (!loaded) {
        return null;
      }
      return (
        <View style={styles.container}>
      
      <View 
					style = {{
						flexDirection: "row",
						backgroundColor: "#ffffff",
						paddingTop: 60,
						paddingBottom: 10,
						paddingHorizontal: 20,
						marginBottom: 2,
						shadowColor: "#00000040",
						shadowOpacity: 0.3,
						shadowOffset: {
						    width: 0,
						    height: 1
						},
						shadowRadius: 4,
						elevation: 4,
					}}>
					<View style={{ marginTop: 7, marginRight: 2 }}>
          <Image source={require('../assets/images/movelogo.png')}
            style={{ width: 30, height: 30 }} />
        </View>
					<Text 
						style = {{
							color: "#900020",
							fontSize: 36,
							
							flex: 1,
                            fontFamily: 'BakbakOne'
						}}>
						{"Reports"}
					</Text>
				</View>
     
      {loading && (
                <Modal transparent={true} animationType="fade">
                <View style={styles.modal}>
                    <ActivityIndicator size="large" color="#fff" />
                </View>
                </Modal>
      )}
      <View style={{flex:1, justifyContent: "center", alignItems: "center"}}>
      <FlatList
		contentContainerStyle={{ marginHorizontal: 10}}
		data={REPORTS[0].data}
		renderItem={({ item }) => <ListItem item={item} />}
		keyExtractor={(item) => item.id}
		numColumns={2} // Set the number of columns to 2
		showsHorizontalScrollIndicator={false}
		nestedScrollEnabled={true}
	    />
        </View>

      <View style={{ marginBottom: 0 }} />

      <NavBarBotTrainer />
    </View>
    );
};

export default TrainerHomepage;



  

  const styles =  StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        
      },
      card: {
        marginRight:10,
        overflow: 'hidden',
        borderRadius: 12,
        marginVertical: 20,
      },
      headingtext: {
        marginLeft: 25,
        fontSize: 16,
        color: '#000000',
        fontFamily: 'QuickSand',
      },
    basic2: {
        backgroundColor:"white",
        flex: 1,
        justifyContent: "center",
        flexDirection:"row",
        alignItems: "center",

    },
    browseText: {
        marginTop: 2,
        marginRight: 20,
        fontSize: 14,
        fontFamily: 'QuickSand',
      },
    

    gradient: {
        marginHorizontal:0,
        marginVertical: 0,
        flex: 1,
        justifyContent: "flex-end",
        borderRadius: 75,
      },
      
      trainerName: {
        color: "#ffffff",
        fontFamily: "QuickSandMedium",
        fontSize: 14,
        marginHorizontal:10,
        marginBottom:10,
        justifyContent: "flex-end",
        alignItems: "flex-start"
      },
      planName: {
        color: "#ffffff",
        fontFamily: "QuickSandBold",
        fontSize: 16,
        marginHorizontal:5,
        marginBottom:0,
        justifyContent: "flex-end",
        alignItems: "flex-start"
    },
    modal: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
      },

    
});

const REPORTS = [
    {
        title: "reports",
        data: [
            {id: "1", name: "Client #1", profile_picture: "https://e0.pxfuel.com/wallpapers/995/141/desktop-wallpaper-fitness-yoga-aesthetic.jpg"},
            {id: "2", name: "Client #2", profile_picture: "https://www.aestheticjunction.com/wp-content/uploads/2014/01/portfolio1.jpg"},
            {id: "3", name: "Client #3", profile_picture: "https://e0.pxfuel.com/wallpapers/995/141/desktop-wallpaper-fitness-yoga-aesthetic.jpg"},
        ]
    }
]