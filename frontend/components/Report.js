import * as React from 'react';
import { Image, FlatList, TouchableOpacity, SafeAreaView, ScrollView, SectionList, StyleSheet, ImageBackground, Text, View, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts } from 'expo-font';
import * as Progress from 'react-native-progress';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useRoute } from '@react-navigation/native';
import { useState } from 'react';
import { Octicons } from '@expo/vector-icons';

const { width: screenWidth } = Dimensions.get('window');

const ListItem = ({ item }) => (
	<View style={[styles.info, { paddingTop: 12, justifyContent: "space-between", borderTopWidth: 0, borderBottomWidth: 0, borderLeftWidth: 1, borderRightWidth: 1, borderColor: "#900020" }]}>
	  <Text style={{ color: "#900020", fontSize: 14, fontFamily: "QuickSand", marginRight: 4 }}>
		{item[0]}
	  </Text>
	  <Text style={{ color: "#900020", fontSize: 14, fontFamily: "QuickSand", marginRight: 4 }}>
		{item[1]}
	  </Text>
	</View>
  );


export default function Report() {


	// ===============================================================================
	// =========================== Expandable List Part===============================
	// ===============================================================================

	const ExpandableListItem = ({ item, data }) => { 
		const [expanded, setExpanded] = useState(false); 
	  
		const toggleExpand = () => { 
			setExpanded(!expanded); 
		}; 
	  
		return ( 
			<View style={{marginBottom: 0}}> 
				<TouchableOpacity 
					onPress={toggleExpand} 
					style={[styles.info, styles.infoOdd, {justifyContent: "space-between"}]} 
				>
					<Text style={{color: "#000000", fontSize: 16, fontFamily: "QuickSand", marginRight: 4}}> 
						{item.exercise.charAt(0).toUpperCase() + item.exercise.slice(1)} 
					</Text> 
					<View style={{flexDirection: "row"}}>
						<Text style={{alignItems: "flex-end", justifyContent: "flex-end", marginLeft: 20, color: "#000000", fontSize: 16, fontFamily: "QuickSand"}}>
							{item.accuracy + "%"}
						</Text>
						<Octicons name="plus" size={24} color={"#000000"} style={{width: 18, height: 20, marginTop: 0, marginBottom: 2, marginLeft: 15}} />
					</View>
				</TouchableOpacity> 
				<View style= {{flexDirection: "column"}}>
				{expanded && ( 
					<ExpandableListItem2 item={item} data={data} />
					// <View style={[styles.info, {paddingTop: 12, justifyContent: "space-between", borderTopWidth: 0, borderBottomWidth: 0, borderLeftWidth: 1, borderRightWidth: 1, borderColor: "#900020"}]}>
					//     <Text style={{color: "#900020", fontSize: 14, fontFamily: "QuickSand", marginRight: 4}}> 
					//         {item.error[0]} 
					//     </Text>
					//     <Text style={{color: "#900020", fontSize: 14, fontFamily: "QuickSand", marginRight: 4}}> 
					//         {"00:" + item.error_time[0]}
					//     </Text>
					// </View>
				)} 
				</View>
			</View> 
		); 
	};
	const ExpandableListItem2 = ({ item, data }) => { 
		const [expanded, setExpanded] = useState(false); 
	  
		const toggleExpand = () => { 
			setExpanded(!expanded); 
		}; 
	  
		return ( 
			<View style={{marginBottom: 0}}> 
				<TouchableOpacity onPress={toggleExpand}>
					<View style={[styles.info, {paddingVertical: 10, paddingHorizontal: 17, flexDirection: "column", backgroundColor: "#ffffff", borderColor: "#900020", borderTopWidth:0, borderBottomWidth:0, borderLeftWidth: 1, borderRightWidth: 1}]}>
						{item.error.map((error, index) => (
							<View key={index} style={{flexDirection: "row", justifyContent: "space-between"}}>
								<Text style={{width: screenWidth/2+20, color: "#900020", fontSize: 14, fontFamily: "QuickSand", marginRight: 4, marginVertical: 2}}>
									{error}
								</Text>
								<Text style={{color: "#900020", fontSize: 14, fontFamily: "QuickSand", marginRight: 4}}>
									{item.error_time[index] + "s"}
								</Text>
							</View>
						))}
					</View>
				</TouchableOpacity>
			</View> 
		); 
	};
	
	
	const ExpandableList = ({ data }) => { 
		const renderItem = ({ item }) => ( 
			<ExpandableListItem item={item} data={data} />
		); 
	  
		return ( 
			<FlatList 
			style={{marginBottom: 0,
				marginHorizontal: 25,
				marginTop:0,
				width: screenWidth*0.9,}}
				data={render_data.current} 
				renderItem={renderItem} 
				keyExtractor={(item) => item.id.toString()} 
			/> 
		); 
	}; 


	// ===============================================================================
	// =========================== Report Part========================================
	// ===============================================================================



  const route = useRoute();
//   const [expanded, setExpanded] = useState(false);
//   const toggleExpand = () => {
//     setExpanded(!expanded);
//   };
  const user = route.params?.user;
  const workout = route.params?.workout;
  const duration = route.params?.duration;
  const accuracy = route.params?.accuracy;
  const exercises = route.params?.exercises;
  const numExercises = route.params?.numExercises;
  const errors = route.params?.errors;
  const error_times = route.params?.error_times;
  const exercise_translator = route.params?.exercise_translator;
  const accuracies = route.params?.accuracies;


  React.useEffect(() => {
	if (exercises && accuracies && errors && error_times && exercise_translator) {
	  let error_data = [];
  
	  for (let i = 0; i < exercises.length; i++) {
		let exercise = exercises[i];
		let exerciseAccuracy = accuracies[i];
		let exerciseErrors = errors[exercise_translator[exercise]];
		let exerciseErrorTimes = error_times[exercise_translator[exercise]];
  
		let object = {
		  id: i + 1,
		  exercise: exercise,
		  accuracy: exerciseAccuracy,
		  error: exerciseErrors,
		  error_time: exerciseErrorTimes
		};
  
		error_data.push(object);
	  }
	  
	  render_data.current = error_data;
	  print(render_data.current);

	}
  }, [exercises, accuracies, errors, error_times, exercise_translator]);

  const render_data = React.useRef([]);

  const data = [ 
	{ 
		title: "Errors",
		info: [
			{
				id: 1, 
				exercise: "Pushups", 
				accuracy: "85%",
				error: [`Elbow angle too low`, 'Elbow angle too high'],
				error_time: ['32', '35'] 
			},
			{
				id: 2, 
				exercise: "Plank", 
				accuracy: "55%",
				error: [`Elbow angle too high`],
				error_time: ['34'] 
			},
			{
				id: 3, 
				exercise: "Squat", 
				accuracy: "15%",
				error: [`Elbow angle too low`],
				error_time: ['35'] 
			},
		]
			
	}, 
 ]; 
  const [loaded] = useFonts({
    'QuickSandBold': require('../assets/fonts/Quicksand-SemiBold.ttf'),
    'QuickSand': require('../assets/fonts/Quicksand-Regular.ttf'),
    'BakbakOne': require('../assets/fonts/BakbakOne-Regular.ttf'),
  });

  if (!loaded) {
    return null;
  }
  
    const workoutProgress1 = 75;
    const workoutProgress2 = 75;
  return (
    <View style={styles.container}>
      <View style={{flexDirection:"column"}}>
      <View 
					style = {{
						flexDirection: "row",
						alignItems: "center",
						justifyContent: "center",
						backgroundColor: "#ffffff",
						borderRadius: 16,
						marginLeft:22,
            marginTop:30,
						width: screenWidth*0.9,
						// shadowColor: "#00000026",
						// shadowOpacity: 0.2,
						// shadowOffset: {
						//     width: 0,
						//     height: 0.25
						// },
						// shadowRadius: 4,
						elevation: 2,
					}}>
					<View 
						style = {{
							flex: 1,
							marginRight: 4,
						}}>
						<Text 
							style = {{
								color: "#000000",
								fontSize: 18,
								marginHorizontal: 20,
                marginTop: 14,
                fontFamily: 'QuickSand',
							}}>
							{"Accuracy"}
						</Text>
						<Text 
							style = {{
								color: "#900020",
								fontSize: 32,
								fontFamily: 'QuickSandBold',
                
								marginLeft: 20,
                marginBottom: 20,
							}}>
							{accuracy + "%"}
						</Text>
					</View>
          <View style={{ marginVertical: 10}}>
            <Image source={require('../assets/images/graph.png')}
              style={{ width: 143, height: 75 }} />
          </View>
					<View 
						style = {{
              marginLeft:-45,
              marginRight: 20,
              marginTop: 40,
							
						}}>
						
							<Text 
								style = {{
									color: "#1c1c1c",
									fontSize: 14,
								}}>
								{"+5.27%"}
							</Text>
						
						
					</View>
				</View>
        <View style={{flexDirection: "row", justifyContent: "center"}}>
        <View 
					style = {{
						flexDirection: "column",
						alignItems: "center",
						backgroundColor: "#ffffff",
						borderRadius: 16,
						marginRight:10,
            alignItems: "stretch",
						width: (screenWidth*0.8)/2,
            marginTop:15,
						// shadowColor: "#00000026",
						// shadowOpacity: 0.2,
						// shadowOffset: {
						//     width: 0,
						//     height: 0.25
						// },
						// shadowRadius: 4,
						elevation: 2,
					}}>
					
          <Text 
							style = {{
								color: "#900020",
								fontSize: 36,
								fontFamily: 'QuickSandBold',
                marginTop: 14,
                textAlign: "center",
								
                
							}}>
							{numExercises}
						</Text>
						<Text 
							style = {{
								color: "#000000",
								fontSize: 18,
								textAlign: "center",
                
                marginBottom: 20,
                fontFamily: 'QuickSand',
							}}>
							{"Exercises completed"}
						</Text>
						
					
            
          
				</View>
        
        <View 
					style = {{
						flexDirection: "column",
						alignItems: "center",
						backgroundColor: "#ffffff",
						borderRadius: 16,
						marginLeft:10,
            marginTop:15,
            justifyContent: "center",
            alignItems: "center",
						width: (screenWidth*0.8)/2,
						// shadowColor: "#00000026",
						// shadowOpacity: 0.2,
						// shadowOffset: {
						//     width: 0,
						//     height: 0.25
						// },
						// shadowRadius: 4,
						elevation: 2,
					}}>
					
						
						<Text 
							style = {{
								color: "#900020",
								fontSize: 32,
								fontFamily: 'QuickSandBold',
                textAlign: "center",
								
                marginTop: 8,
                
							}}>
							{duration + "s"}
						</Text>
            <Text 
							style = {{
								color: "#000000",
								fontSize: 18,
								marginHorizontal: 20,
                marginBottom: 20,
                textAlign: "center",
                fontFamily: 'QuickSand',
							}}>
							{"Time Taken"}
						</Text>
					
          
				</View>
				
				

        </View>
		
        {/* -------------------------------------------------------------------------------------- */}
		
        <View 
					style = {{
						marginBottom: 0,
						marginHorizontal: 25,
						marginTop:20,
						width: screenWidth*0.9,
					}}>
					<View 
						style = {[styles.info, styles.infoTop, styles.infoOdd, {backgroundColor: "#000000"}]}>
						<Text 
							style = {{
								color: "#ffffff",
								fontSize: 16,
								fontFamily: "QuickSand",
								marginRight: 4,
								flex: 1,
							}}>
							{"Report"}
						</Text>
						
						

					</View>
					
					
				</View>
				<View style={styles.container}> 
            <ExpandableList data={data} /> 
        </View> 
				
    </View>
    
    
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    
    
    paddingTop: 0, // Adjust this value as needed to position the content below your header
    marginTop:0
  },
  infoTop: {
	
		borderTopLeftRadius: 9,
		borderTopRightRadius: 9,
		
  },
  info:{
	marginTop:0.1,
	borderWidth: 0.5,
	paddingVertical: 12,
	paddingHorizontal: 17,
	flexDirection: "row",
		// alignItems: "center",
		backgroundColor: "#ffffff",
		borderColor: "#00000020",
		
  },
  infoOdd:{
	backgroundColor: "#ffffff",
	color: "#000000"
  },
  infoEven:{
	backgroundColor: "#900020",
	color: "white",
  },
  infoBottom: {
	borderBottomRightRadius: 9,
	borderBottomLeftRadius: 9,
  },
  headingtext:{
    marginLeft:17,
    fontSize: 16,
    fontFamily: 'QuickSand',
  },
  

});

