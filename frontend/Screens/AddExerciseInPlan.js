import * as React from 'react';
import { SafeAreaView, ScrollView, View, StyleSheet, Text, Dimensions, Pressable} from 'react-native';
import { useFonts } from 'expo-font';
import { Octicons } from '@expo/vector-icons';
import { useState } from 'react';
import { TextInput } from 'react-native-gesture-handler';
import {Dropdown} from 'react-native-element-dropdown';
import { useNavigation, useRoute } from '@react-navigation/native';


const { width: screenWidth } = Dimensions.get('window');
const AddExerciseInPlan = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const data = [
        {label: 'Push Ups', value: '1'},
        {label: 'Plank', value: '2'},
        {label: 'Jumping Jacks', value: '3'},
        {label: 'Squats', value: '4'},
    ];
    const data3 = [
       {label1: 'reps', value1: '1'},
       {label1: 'sec', value1: '2'},
    ];
    const [dropdown, setDropdown] = useState(null);
    const [dropdown2, setDropdown2] = useState(null);
    
        const [selected, setSelected] = useState([]);
        const _renderItem = item => {
            return (
            <View style={styles.item}>
                <Text style={styles.textItem}>{item.label}</Text>

            </View>
            );
        };

        const _renderItem2 = item1 => {
            return (
            <View style={styles.item}>
                <Text style={styles.textItem}>{item1.label1}</Text>

            </View>
            );
        };

    const data2 = ["Weight Loss", "Toning", "Strength", "Yoga"];
    
    // const [selectedValue, setSelectedValue] = React.useState('');
    const [planname, setplanname] = React.useState('');

    const [loaded] = useFonts({
        'QuickSandBold': require('../assets/fonts/Quicksand-SemiBold.ttf'),
        'QuickSand': require('../assets/fonts/Quicksand-Regular.ttf'),
        'BakbakOne': require('../assets/fonts/BakbakOne-Regular.ttf'),
      });
    
      if (!loaded) {
        return null;
      }
      
      return (
        <SafeAreaView 
        style = {{
            flexGrow: 1,
            backgroundColor: "#FFFFFF",
            
        }}>
        <ScrollView  
            style = {{
                flex: 1,
                backgroundColor: "#ffffff",
                borderRadius: 16,
            }}>

{/* -------------------------------------addplan top bar-----------------------------------------------------------------------------------------*/}
            <View 
                style = {{
                    flexDirection: "row",
                    backgroundColor: "#ffffff",
                    paddingTop: 60,
                    paddingBottom: 2,
                    paddingHorizontal: 17,
                    marginBottom: 30,
                    justifyContent: "center",
                    alignItems: "center",
                    shadowRadius: 4,
                    elevation: 2,
                }}>
                <Octicons name="chevron-left" size={24} color={"#000000"} style = {{
                        width: 14,
                        height: 20,
                        marginTop: 2,
                        marginRight: 63,
                        marginBottom:16,
                    }}/>
                <Text 
                    style = {{
                        color: "#900020",
                        fontSize: 36,
                        flex: 1,
                        fontFamily: "BakbakOne"
                    }}>
                    {"ADD PLAN"}
                </Text>
            </View>
            <View>

            </View>
{/* -------------------------------------------------details------------------------------------------ */}
<View 
					style = {{
						marginBottom: 20,
						marginHorizontal: 25,
					}}>
					<View 
						style = {{
							flexDirection: "row",
							alignItems: "center",
							backgroundColor: "#ffffff",
							borderColor: "#000000",
							borderTopLeftRadius: 9,
							borderTopRightRadius: 9,
							borderWidth: 0.5,
							paddingVertical: 12,
							paddingHorizontal: 17,
							
						}}>
						<Text 
							style = {{
								color: "#000000",
								fontSize: 16,
								fontFamily: "QuickSand",
								marginRight: 4,
								flex: 1,
							}}>
							{"Plan name"}
						</Text>
						<Text 
							style = {{
								color: "#000000",
								fontSize: 16,
								fontFamily: "QuickSand"

							}}>
							{"Beginner plan"}
						</Text>
					</View>
					<View 
						style = {{
							flexDirection: "row",
							alignItems: "center",
							backgroundColor: "#900020",
							borderColor: "#000000",
							borderBottomRightRadius: 9,
							borderBottomLeftRadius: 9,
							borderWidth: 0.5,
							paddingVertical: 12,
							paddingHorizontal: 18,
						}}>
						<Text 
							style = {{
								color: "#ffffff",
								fontSize: 16,
								
								marginRight: 4,
                                fontFamily: "QuickSand",
								flex: 1,
							}}>
							{"Category"}
						</Text>
						<Text 
							style = {{
								color: "#ffffff",
								fontSize: 16,
							
                                fontFamily: "QuickSand"
							}}>
							{"Strength"}
						</Text>
					</View>
				</View>
{/* -------------------------------------drop down-----------------------------------------------------------------------------------------*/}
            <View 
                style = {{
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor: "#ffffff",
                    borderColor: "#000000",
                    borderRadius: 16,
                    borderWidth: 1,
                    paddingVertical: 20,
                    paddingHorizontal: 17,
                    marginBottom: 20,
                    marginHorizontal: 25,
                }}>
                
                
                
                    <Dropdown
                    style={styles.dropdown}
                    
                    data={data}
                    labelField="label"
                    valueField="value"
                    label="Dropdown"
                    placeholder="Select Exercise"
                    value={dropdown}
                    onChange={item => {
                    setDropdown(item.value);
                        console.log('selected', item);
                    }}
                    renderItem={item => _renderItem(item)}
                    textError="Error"
                />

            </View>
{/* -------------------------------------Set plan name-----------------------------------------------------------------------------------------*/}
           <View style={{flexDirection: "row"}}>
           <View 
                style = {{
                    backgroundColor: "#898d8f1A",
                    borderColor: "#000000",
                    borderRadius: 16,
                    borderWidth: 1,
                    width: "52%",
                    paddingVertical: 23,
                    paddingHorizontal:10,
                    marginBottom: 20,
                    marginRight: 15,
                    marginLeft: 25,
                    
                }}>
                <TextInput 
                    style = {{
                        color: "#898d8f",
                        fontSize: 16,
                        fontFamily: "QuickSand"
                    }}
                    placeholder='10'
                    value={planname}
                    useNativeDriver={false}
                    onChangeText={(text) => setplanname(text)}
                    >
                    
                </TextInput>
                
            </View>
            <View 
                style = {{
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor: "#ffffff",
                    borderColor: "#000000",
                    borderRadius: 16,
                    borderWidth: 1,
                    width: "30%",
                    paddingVertical: 20,
                    paddingHorizontal: 17,
                    marginBottom: 20,
                    marginRight: 25,
                }}>
                
                
                
                    <Dropdown
                    style={styles.dropdown}
                    
                    data={data3}
                    labelField="label1"
                    valueField="value1"
                    label1="Dropdown"
                    
                    value={dropdown2}
                    placeholder="Select"
                    onChange={item1 => {
                    setDropdown2(item1.value1);
                        console.log('selected', item1);
                    }}
                    renderItem={item1 => _renderItem2(item1)}
                    textError="Error"
                />

            </View>
            </View>
{/* -------------------------------------------upload video button -------------------------------------------------------------- */}

<View 
                style = {{
                    alignItems: "center",
                    backgroundColor: "#ffffff",
                    borderColor: "#900020",
                    borderRadius: 9,
                    borderWidth: 1,
                    paddingVertical: 19,
                    marginBottom: 10,
                    marginHorizontal: 25,
                }}>
                <Text 
                    style = {{
                        color: "#000000",
                        fontSize: 16,
                      
                        fontFamily: "QuickSandBold"
                    }}>
                    {"Upload Video"}
                </Text>
            </View>

{/* -------------------------------------Add Exercise Button-----------------------------------------------------------------------------------------*/}
           
            
        </ScrollView>
        <View style={{marginBottom:15}}>
            <View 
                style = {{
                    alignItems: "center",
                    backgroundColor: "#ffffff",
                    borderColor: "#900020",
                    
                    borderRadius: 9,
                    borderWidth: 1,
                    paddingVertical: 19,
                
                    marginBottom: 10,
                    marginHorizontal: 25,
                }}>
                <Text 
                    style = {{
                        color: "#000000",
                        fontSize: 16,
                      
                        fontFamily: "QuickSandBold"
                    }}>
                    {"Add Exercise"}
                </Text>
            </View>

{/* -------------------------------------Done button-----------------------------------------------------------------------------------------*/}

<Pressable onPress={() => navigation.navigate('ProfileWithPlans')}>
            <View 
                style = {{
                    alignItems: "center",
                    backgroundColor: "#900020",
                    borderRadius: 9,
                    paddingVertical: 19,
                    marginBottom: 0,
                    marginHorizontal: 25,
                }}>
                <Text 
                    style = {{
                        color: "#ffffff",
                        fontSize: 16,
                        fontFamily: "QuickSandBold"
                    }}>
                    {"Done"}
                </Text>
            </View>
            </Pressable>
            </View>
    </SafeAreaView>);
};

export default AddExerciseInPlan;

const styles = StyleSheet.create({

    dropdown: {
        backgroundColor: 'white',
        width: "100%"
    },
 
    dropdown2: {
        backgroundColor: 'white',
        width: "20%",

    },
    item: {
        paddingVertical: 17,
        paddingHorizontal: 10,
        width: "100%",
        borderColor: "#ffffff",
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    textItem: {
        flex: 1,
        fontSize: 16,
    },

    addNewPlan: {
    flex: 1,
    alignItems: "center",
    width: "100%",
    backgroundColor: "#fff",
    }
    });