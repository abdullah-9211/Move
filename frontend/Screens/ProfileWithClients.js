import * as React from 'react';
import { SafeAreaView, ScrollView, ImageBackground, Image, FlatList, View, StyleSheet, Icon, Text, Dimensions, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import NavBarBotTrainer from '../components/NavBarBotTrainer';
import NavBar from '../components/NavBar';
import NavBarTrainer from '../components/NavBarTrainer';
import { useNavigation, useRoute } from '@react-navigation/native';
import NavBarBot from '../components/NavBarBot';
import { useFonts } from 'expo-font';

const { width: screenWidth } = Dimensions.get('window');
const ProfileWithClients = () => {

	const ListItem = ({ item }) => {
		return(
			<ImageBackground 
				source={{uri:item.image}} 
				resizeMode = {'cover'}
				imageStyle = {{borderRadius: 90,}}
				style={{
					width: screenWidth/2 - 18,
					paddingTop: 90,
					paddingBottom: 0,
					paddingHorizontal: 0,
				}}
				>
				<LinearGradient
				style={styles.gradientOverlay}
				colors={['transparent', 'rgba(0, 0, 0, 1)']} // Adjust the opacity as needed
			>
				<View style={{marginHorizontal:11, paddingBottom:9, alignItems:'center'}}>
				<Text style={styles.planName}>{item.name}</Text>
				
				
				</View>
			</LinearGradient>
			</ImageBackground>
		);
				};

	const route = useRoute();
	const trainer = route.params?.user;

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
                    marginBottom:75
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
                    
				</View>
				<View 
					style = {{
						flexDirection: "row",
						justifyContent: "space-between",
						alignItems: "center",
						marginBottom: 13,
						marginHorizontal: 70,
					}}>
					<Pressable onPress={() => navigation.navigate('ProfileWithPlans', {user: trainer})}>
					<Text 
						style = {{
							color: "#898D8F",
							fontSize: 16,
                            fontFamily: 'QuickSandBold'
						}}>
						{"Plans"}
					</Text>
					</Pressable>
					
					<Text 
						style = {{
							color: "#000000",
							fontSize: 16,
                            fontFamily: 'QuickSandBold'
						}}>
						{"Clients"}
					</Text>
					
				</View>
				<View 
					style = {{
						width: screenWidth/2,
						height: 1,
						marginBottom: 16,
					}}>
					<View 
						style = {{
							backgroundColor: "#E6E9EB",
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
							backgroundColor: "#900020",
							borderRadius: 2,
						}}>
					</View>
				</View>
				<FlatList
					contentContainerStyle={{ paddingHorizontal: 10}}
					data={CLIENTS[0].data}
					renderItem={({ item }) => <ListItem item={item} />}
					keyExtractor={(item) => item.id}
					numColumns={2} // Set the number of columns to 2
					showsHorizontalScrollIndicator={false}
					nestedScrollEnabled={true}
				/>
				
			</ScrollView>
            <NavBarBotTrainer color1= "#000000" color2={"#900020"}/>
		</SafeAreaView>
  );
};

export default ProfileWithClients;



  

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
        marginBottom:2,
    },
    container: {
        width: screenWidth, 
        alignItems:'center'
    },
    gradientOverlay: {
        paddingTop:20,
        paddingBottom:20,
        borderBottomLeftRadius: 90,
        borderBottomRightRadius: 90,
        marginBottom:2
    }

    
});

const CLIENTS = [
	{
		title: "clients",
		data: [
			{id: 1, name: "Client #1", image: "https://e0.pxfuel.com/wallpapers/995/141/desktop-wallpaper-fitness-yoga-aesthetic.jpg"},
			{id: 2, name: "Client #2", image: "https://www.aestheticjunction.com/wp-content/uploads/2014/01/portfolio1.jpg"},
			{id: 3, name: "Client #3", image: "https://e0.pxfuel.com/wallpapers/995/141/desktop-wallpaper-fitness-yoga-aesthetic.jpg"},
		]
	},
]