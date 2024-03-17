import * as React from 'react';
import { SafeAreaView, ScrollView, ImageBackground, Image, FlatList, View, StyleSheet, Icon, Text, Dimensions, Pressable} from 'react-native';
import { useFonts } from 'expo-font';
import { Octicons } from '@expo/vector-icons';
import { useState } from 'react';
import { TextInput } from 'react-native-gesture-handler';
import {Dropdown, MultiSelect} from 'react-native-element-dropdown';
import { useNavigation, useRoute } from '@react-navigation/native';


const { width: screenWidth } = Dimensions.get('window');
const AddPlan = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const data = [
        {label: 'Strength', value: '1'},
        {label: 'Toning', value: '2'},
        {label: 'Yoga', value: '3'},
        {label: 'Weight Loss', value: '4'},
        {label: 'Endurance', value: '5'},
    ];
    var planType = ' ';
    const [dropdown, setDropdown] = useState(null);
        const [selected, setSelected] = useState([]);
        const _renderItem = item => {
            return (
            <View style={styles.item}>
                <Text style={styles.textItem}>{item.label}</Text>

            </View>
            );
        };

    
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
            flex: 1,
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
                    placeholder="Select Plan Type"

                    value={dropdown}
                    onChange={item => {
                    setDropdown(item.value);
                        planType = item;
                        console.log('selected', planType);
                    }}
                    renderItem={item => _renderItem(item)}
                    textError="Error"
                />

            </View>
{/* -------------------------------------Set plan name-----------------------------------------------------------------------------------------*/}
            <View 
                style = {{
                    backgroundColor: "#898d8f1A",
                    borderColor: "#000000",
                    borderRadius: 16,
                    borderWidth: 1,
                    paddingVertical: 23,
                    paddingHorizontal: 18,
                    marginBottom: 20,
                    marginHorizontal: 25,
                }}>
                <TextInput 
                    style = {{
                        color: "#898d8f",
                        fontSize: 16,
                        fontFamily: "QuickSand"
                    }}
                    placeholder='Plan name'
                    value={planname}
                    useNativeDriver={false}
                    onChangeText={(text) => {
                        setplanname(text);
                        console.log(planname);
                    }}
                    >
                    
                </TextInput>
            </View>


{/* -------------------------------------Add Exercise Button-----------------------------------------------------------------------------------------*/}
            <View 
                style = {{
                    alignItems: "center",
                    backgroundColor: "#ffffff",
                    borderColor: "#900020",
                    borderRadius: 9,
                    borderWidth: 1,
                    paddingVertical: 19,
                    marginBottom: 209,
                    marginHorizontal: 25,
                }}>
                <Pressable onPress={() => navigation.navigate('AddExerciseInPlan', {planName: planname, planType: planType})}>
                <Text 
                    style = {{
                        color: "#000000",
                        fontSize: 16,
                      
                        fontFamily: "QuickSandBold"
                    }}>
                    {"Add Exercise"}
                </Text>
                </Pressable>
            </View>

{/* -------------------------------------Done button-----------------------------------------------------------------------------------------*/}

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
            
        </ScrollView>
    </SafeAreaView>);
};

export default AddPlan;

const styles = StyleSheet.create({

    dropdown: {
        backgroundColor: 'white',
        width: "100%"
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