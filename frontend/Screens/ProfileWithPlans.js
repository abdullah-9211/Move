import * as React from 'react';
import { SafeAreaView, ScrollView, ImageBackground, Image, FlatList, View, StyleSheet, Icon, Text, Dimensions, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import NavBarBotTrainer from '../components/NavBarBotTrainer';
import NavBar from '../components/NavBar';
import NavBarTrainer from '../components/NavBarTrainer';
import NavBarBot from '../components/NavBarBot';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useFonts } from 'expo-font';

const { width: screenWidth } = Dimensions.get('window');
const ProfileWithPlans = () => {

	const route = useRoute();
	const trainer = route.params?.user;


	React.useEffect(() => {
		console.log(trainer);
	}, []);

	const ListItem = ({ item }) => {
		return(
			<ImageBackground 
                    source={{uri:item.plan_image}} 
                    resizeMode="cover"
                    imageStyle={{ width: screenWidth/2 - 18, borderRadius: 9 }}
                    style={{
                        width: screenWidth/2 - 18,
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
                        
                        <Text style={styles.trainerName}>{trainer.first_name + " " + trainer.last_name}</Text>
                        </View>
                    </LinearGradient>
                </ImageBackground>
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
  return (
    <SafeAreaView 
			style = {{
				flex: 1,
				backgroundColor: "#FFFFFF",
			}}>
			<ScrollView  
				style = {{
					flex: 1,
					backgroundColor: "#FFFFFF",
					borderRadius: 16,
				}}>
                <View style ={{backgroundColor: "#E6E9EB", alignItems:'flex-end', justifyContent: "flex-end"}}>
                    <MaterialIcons name="more-horiz" size={24} color="#000000" style={{paddingTop:50, marginHorizontal:20}}/>
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
                    <View style= {styles.container}><Text 
						style = {{
							color: "#000000",
							fontSize: 14,
                            fontFamily: 'QuickSand',
                            marginHorizontal:20,
						}}>
						{"Lorem ipsum that stuff this stuff, a something normal description what about it, a short bio."}
					</Text>
                    </View>
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
				
			</ScrollView>
            <NavBarBotTrainer color1= "#000000" color2="#900020"/>
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
        fontSize: 18,
    },
    container: {
        width: screenWidth, 
        alignItems:'center'
    },
    gradientOverlay: {
		width: screenWidth/2 - 18,
        paddingTop:20,
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

