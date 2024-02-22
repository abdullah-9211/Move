import * as React from 'react';
import { SafeAreaView, ScrollView, ImageBackground, Image, FlatList, View, StyleSheet, Icon, Text, Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import NavBarBotTrainer from '../components/NavBarBotTrainer';
import NavBar from '../components/NavBar';
import NavBarTrainer from '../components/NavBarTrainer';
import NavBarBot from '../components/NavBarBot';
import { useFonts } from 'expo-font';
import { useRoute } from '@react-navigation/native';

const { width: screenWidth } = Dimensions.get('window');
const TrainerHomepage = () => {

    const route = useRoute();
    const trainer = route.params?.user;

    const [loaded] = useFonts({
        'QuickSandBold': require('../assets/fonts/Quicksand-SemiBold.ttf'),
        'QuickSand': require('../assets/fonts/Quicksand-Regular.ttf'),
        'BakbakOne': require('../assets/fonts/BakbakOne-Regular.ttf'),
      });

      React.useEffect(() => {
        console.log(trainer);
        }, []);
    
      if (!loaded) {
        return null;
      }
      return (
        <SafeAreaView 
			style = {{
				flex: 1,
				backgroundColor: "#FFFFFF",
			}}>
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
			<ScrollView  
				style = {{
					flex: 1,
					backgroundColor: "#ffffff",
					borderRadius: 16,
                    marginBottom: 70,
				}}>
				
				<View 
					style = {{
						flexDirection: "row",
						justifyContent: "space-between",
						alignItems: "center",
						marginBottom: 21,
						marginHorizontal: 25,
					}}>
					<View 
						style = {{
							width: 284,
							flexDirection: "row",
							justifyContent: "space-between",
							alignItems: "center",
							backgroundColor: "#ffffff",
							borderColor: "#000000",
							borderRadius: 8,
							borderWidth: 1,
							paddingVertical: 10,
                            marginTop:10,
							paddingHorizontal: 7,
						}}>
						<Text 
							style = {{
								color: "#cbcbcb",
								fontSize: 16,
								fontFamily: 'QuickSand',
                                marginBottom: 3,
                                marginLeft: 3,
							}}>
							{"search"}
						</Text>
						<MaterialIcons name="search" size={24} color={"#000000"}/>
					</View>
                    <View style={{marginHorizontal: 8}}>
					<MaterialIcons name="sort" size={24} color={"#000000"}/>
                    </View>
				</View>
				<View 
					style = {{
						flexDirection: "row",
						justifyContent: "space-between",
						alignItems: "center",
						marginBottom: 10,
						marginHorizontal: 12,
					}}>
                    
                <ImageBackground 
                    source={{uri:'https://e0.pxfuel.com/wallpapers/995/141/desktop-wallpaper-fitness-yoga-aesthetic.jpg'}} 
                    resizeMode="cover"
                    imageStyle={{ borderRadius: 90 }}
                    style={{
                        width: screenWidth/2 - 18,
                        paddingTop: 90,
                        paddingBottom:0,
                        paddingHorizontal: 0,
                    }}
                >
                    <LinearGradient
                        style={styles.gradientOverlay}
                        colors={['transparent', 'rgba(0, 0, 0, 1)']} // Adjust the opacity as needed
                    >
                        <View style={{marginHorizontal:11, paddingBottom:9, alignItems:'center'}}>
                        <Text style={styles.planName}>Client #1</Text>
                        
                    
                        </View>
                    </LinearGradient>
                </ImageBackground>
            
					<ImageBackground 
						source={{uri:'https://www.aestheticjunction.com/wp-content/uploads/2014/01/portfolio1.jpg'}} 
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
                        <Text style={styles.planName}>Client #2</Text>
                        
                        
                        </View>
                    </LinearGradient>
					</ImageBackground>
				</View>
                <View 
					style = {{
						flexDirection: "row",
						justifyContent: "space-between",
						alignItems: "center",
						marginBottom: 10,
						marginHorizontal: 12,
					}}>
                    
                <ImageBackground 
                    source={{uri:'https://e0.pxfuel.com/wallpapers/995/141/desktop-wallpaper-fitness-yoga-aesthetic.jpg'}} 
                    resizeMode="cover"
                    imageStyle={{ borderRadius: 90 }}
                    style={{
                        width: screenWidth/2 - 18,
                        paddingTop: 90,
                        paddingBottom:0,
                        paddingHorizontal: 0,
                    }}
                >
                    <LinearGradient
                        style={styles.gradientOverlay}
                        colors={['transparent', 'rgba(0, 0, 0, 1)']} // Adjust the opacity as needed
                    >
                        <View style={{marginHorizontal:11, paddingBottom:9, alignItems:'center'}}>
                        <Text style={styles.planName}>Client #1</Text>
                        
                    
                        </View>
                    </LinearGradient>
                </ImageBackground>
            
					<ImageBackground 
						source={{uri:'https://www.aestheticjunction.com/wp-content/uploads/2014/01/portfolio1.jpg'}} 
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
                        <Text style={styles.planName}>Client #2</Text>
                        
                        
                        </View>
                    </LinearGradient>
					</ImageBackground>
				</View>
                <View 
					style = {{
						flexDirection: "row",
						justifyContent: "space-between",
						alignItems: "center",
						marginBottom: 10,
						marginHorizontal: 12,
					}}>
                    
                <ImageBackground 
                    source={{uri:'https://e0.pxfuel.com/wallpapers/995/141/desktop-wallpaper-fitness-yoga-aesthetic.jpg'}} 
                    resizeMode="cover"
                    imageStyle={{ borderRadius: 90 }}
                    style={{
                        width: screenWidth/2 - 18,
                        paddingTop: 90,
                        paddingBottom:0,
                        paddingHorizontal: 0,
                    }}
                >
                    <LinearGradient
                        style={styles.gradientOverlay}
                        colors={['transparent', 'rgba(0, 0, 0, 1)']} // Adjust the opacity as needed
                    >
                        <View style={{marginHorizontal:11, paddingBottom:9, alignItems:'center'}}>
                        <Text style={styles.planName}>Client #1</Text>
                        
                    
                        </View>
                    </LinearGradient>
                </ImageBackground>
            
					<ImageBackground 
						source={{uri:'https://www.aestheticjunction.com/wp-content/uploads/2014/01/portfolio1.jpg'}} 
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
                        <Text style={styles.planName}>Client #2</Text>
                        
                        
                        </View>
                    </LinearGradient>
					</ImageBackground>
				</View>
				
				
				
			</ScrollView>
            <NavBarBotTrainer color1="#900020" color2="#000000"/>
		</SafeAreaView>
		
    );
};

export default TrainerHomepage;



  

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