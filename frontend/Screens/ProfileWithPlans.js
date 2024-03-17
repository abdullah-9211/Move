import * as React from 'react';
import { SafeAreaView, TouchableOpacity, ScrollView, ImageBackground, Image, FlatList, View, StyleSheet, Icon, Text, Dimensions, Pressable, Modal, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import NavBarBotTrainer from '../components/NavBarBotTrainer';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import axios from 'axios';
import {REACT_APP_API_URL} from "@env"

const { width: screenWidth } = Dimensions.get('window');
const ProfileWithPlans = () => {

	const route = useRoute();
	const trainer = route.params?.user;

	const [loading, setLoading] = React.useState(true);

	React.useEffect(() => {
		setLoading(true);

		const apiUrl = REACT_APP_API_URL + '/user/get-trainer-plans/' + trainer.id;
		axios.get(apiUrl)
		.then((response) => {
			// console.log(response.data);
			PLANS.data = response.data;
			setLoading(false);
		})
		.catch((error) => {
			console.log(error);
		})
	}, []);

	const ListItem = ({ item }) => {
		return(
			<View style={{flex:1, justifyContent:"space-between"}}>
			<TouchableOpacity style={{marginHorizontal:10, marginVertical:10, borderRadius:12}}>
			<ImageBackground 
                    source={{uri:item.plan_image}} 
                    resizeMode="cover"
                    imageStyle={{ borderRadius: 12 }}
                    style={{
                        width: (screenWidth/2)-26, height: (screenWidth/2)-25, borderRadius: 12, marginBottom:0, marginTop:8,
          paddingBottom: 0,
          paddingHorizontal: 0,
                    }}
                >
                    <LinearGradient
                        style={styles.gradientOverlay}
                        colors={['transparent', 'rgba(0, 0, 0, 1)']}
                    >
                        <View style={{marginHorizontal:2, paddingBottom:9, marginBottom:2, marginLeft: 5}}>
                        <Text style={styles.planName}>{item.plan_name}</Text>
                        
                        {/* <Text style={styles.trainerName}>{trainer.first_name + " " + trainer.last_name}</Text> */}
                        </View>
                    </LinearGradient>
                </ImageBackground>
				</TouchableOpacity>
				</View>
		);
				};


	const navigation = useNavigation();
    const [loaded] = useFonts({
        'QuickSandBold': require('../assets/fonts/Quicksand-SemiBold.ttf'),
        'QuickSand': require('../assets/fonts/Quicksand-Regular.ttf'),
      });
    
      if (!loaded) {
        return null;
      }

	  if (loading) {
		return (
		  <View style={{position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, backgroundColor: 'white'}}>
				<Modal transparent={true} animationType="fade">
				<View style={styles.modal}>
					<ActivityIndicator size="large" color="#fff" />
				</View>
				</Modal>
		  </View>
		);
	  }
  return (
    <SafeAreaView 
			style = {{
				flex: 1,
				backgroundColor: "#FFFFFF",
			}}>
			
                <View style ={{backgroundColor: "#E6E9EB", alignItems:'flex-end', justifyContent: "flex-end"}}>
                    <MaterialIcons name="more-horiz" size={24} color="#000000" style={{paddingTop:50, marginHorizontal:10}}/>
                </View>
				<View 
					style = {{
                        alignItems: 'center',
						backgroundColor: "#E6E9EB",
						paddingBottom: 18,
						marginBottom: 18,
					}}>
					
					<Image
						source = {{uri:trainer.profile_picture}} 
						resizeMode = {"cover"}
						style = {{
							height: 99,
                            width: 102,
							marginBottom: 10,
							marginHorizontal: 0,
                            borderRadius:70
						}}
					/>
                    <View style={styles.container}>
					<Text 
						style = {styles.TrainerName}>
						{trainer.first_name + " " + trainer.last_name}
					</Text>
                    </View>
					<View style={styles.container}><Text 
						style = {{
							color: "#898D8F",
							fontSize: 14,
							marginBottom: 10,
                            fontFamily: 'QuickSand'
						}}>
						{trainer.email}
					</Text>
                    </View>
					<View style={{alignItems:'center', marginHorizontal:15, backgroundColor: 'rgba(137, 141, 143, 0.2)', height: 1, marginBottom: 5}} />
				</View>
				<View 
					style = {{
						flexDirection: "row",
						justifyContent: "space-between",
						alignItems: "center",
						marginBottom: 13,
						marginHorizontal: 70,
					}}>
					<Text 
						style = {{
							color: "#000000",
							fontSize: 16,
                            fontFamily: 'QuickSandBold'
						}}>
						{"Plans"}
					</Text>
					<Pressable onPress={() => navigation.navigate('ProfileWithClients', {user: trainer})}>
					<Text 
						style = {{
							color: "#898D8F",
							fontSize: 16,
                            fontFamily: 'QuickSandBold'
						}}>
						{"Clients"}
					</Text>
					</Pressable>
				</View>
				<View 
					style = {{
						width: screenWidth/2,
						height: 1,
						marginBottom: 16,
					}}>
					<View 
						style = {{
							backgroundColor: "#900020",
							borderRadius: 2,
                            width: screenWidth/2,
                            height: 1,
						}}>
					</View>
					<View 
						style = {{
							position: "absolute",
							bottom: 0,
							right: -screenWidth/2,
							width: screenWidth/2,
							height: 1,
							backgroundColor: "#E6E9EB",
							borderRadius: 2,
						}}>
					</View>
				</View>
				<View 
					style = {{
						flexDirection: "row",
						justifyContent: "space-between",
						alignItems: "center",
						marginBottom: 9,
						marginHorizontal: 0,
					}}>
					
				
				<FlatList
					contentContainerStyle={{ paddingHorizontal: 10}}
					data={PLANS.data}
					renderItem={({ item }) => <ListItem item={item} />}
					keyExtractor={(item) => item.id}
					numColumns={2} // Set the number of columns to 2
					showsHorizontalScrollIndicator={false}
					nestedScrollEnabled={true}
				/>
				</View>
				<View 
					style = {{
						alignItems: "center",
						backgroundColor: "#900020",
						borderRadius: 9,
						paddingVertical: 18,
						marginBottom: 75,
						marginHorizontal:10,
                        marginVertical:10
					}}>
					<Pressable onPress={() => navigation.navigate('AddPlan')}>
					<Text 
						style = {{
							color: "#FFFFFF",
							fontSize: 16,
                            fontFamily: 'QuickSandBold'
						}}>
						{"Add new"}
					</Text>
					</Pressable>
				</View>
				
			
            {/* <NavBarBotTrainer color1= "#000000" color2="#900020"/> */}
		</SafeAreaView>
  );
};

export default ProfileWithPlans;



  

  const styles =  StyleSheet.create({
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
		fontSize: 14,
		marginHorizontal:2,
		marginBottom:0,
		justifyContent: "flex-end",
		alignItems: "flex-start"
	},
    container: {
        width: screenWidth, 
        alignItems:'center'
    },
    gradientOverlay: {
		marginHorizontal:0,
    marginVertical: 0,
    flex: 1,
    justifyContent: "flex-end",
    borderRadius: 12,
    },
	buttonText: {
		fontSize: 16,
		fontFamily: 'QuickSand',
		color: "#ffffff",
	},
	button: {
	
		
	},
	modal: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
	  },
    
});

const PLANS = [
	{
		title: "plans",
		data: [

		]
	},
]

