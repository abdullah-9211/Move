import * as React from 'react';
import {
  Image, Pressable, ImageBackground, TextInput, StyleSheet, Text, View, Dimensions, ActivityIndicator, Modal
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts } from 'expo-font';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import { REACT_APP_API_URL } from "@env"

const { width: screenWidth } = Dimensions.get('window');

export default function SignUpDetails2() {
  const navigation = useNavigation();
  const route = useRoute();
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [passwordError, setPasswordError] = React.useState('');
  const [isLoading, setLoading] = React.useState(false);
  const [loaded] = useFonts({
    'QuickSand': require('../assets/fonts/Quicksand-SemiBold.ttf'),
  });

  if (!loaded) {
    return null;
  }

  const validatePassword = (text) => {
    setPassword(text);
    if (text.length < 6) {
      setPasswordError("Password must be at least 6 characters");
    } else if (!/\d/.test(text)) {
      setPasswordError("Password must contain a number");
    } else if (confirmPassword !== text) {
      setPasswordError("Passwords do not match");
    }
    else {
      setPasswordError("");
    }
  };

  async function createNewUser() {
    // Your existing createNewUser logic
  }

  function handlePress() {
    if (password !== confirmPassword) {
      alert("Passwords do not match");
    } else if (password === "" || confirmPassword === "") {
      alert("Please enter a password");
    } else if (passwordError) {
      alert(passwordError);
    } else {
      createNewUser();
    }
  }

  return (
    <ImageBackground
      source={require('../assets/images/red2.jpg')}
      style={styles.backgroundImage}
    >
      <View style={{ flex: 1 }}>
        <View style={{ alignItems: "center" }}>
          <Image
            source={require('../assets/images/full_logo.png')}
            style={styles.image}
            resizeMode="contain"
          />
        </View>
        <View style={{ flex: 1, alignItems: "flex-start", width: screenWidth - 20, justifyContent: "flex-start" }}>
          <Text style={styles.textStyle}>Create Password</Text>
          <TextInput
            style={[styles.input, passwordError ? styles.inputError : null]}
            placeholder="Password (Must be at least 6 characters and contain a number)"
            secureTextEntry={true}
            value={password}
            onChangeText={validatePassword}
          />
          {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
          {isLoading && (
            <Modal transparent={true} animationType="fade">
              <View style={styles.modal}>
                <ActivityIndicator size="large" color="#fff" />
              </View>
            </Modal>
          )}
          <Text style={styles.textStyle}>Confirm Password</Text>
          <TextInput
            style={styles.input}
            secureTextEntry={true}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChangeText={(text) => setConfirmPassword(text)}
          />
          <View style={{ flex: 1, justifyContent: "flex-end" }}>
            <Pressable
              style={({ pressed }) => [styles.button,
              {
                backgroundColor: pressed ? '#140004' : '#900020',
              },
              ]}
              onPress={handlePress}>
              <Text style={styles.buttonText}>
                Continue
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  textStyle: {
    fontFamily: 'QuickSand',
    fontSize: 21,
    marginHorizontal: 20,
    marginBottom: 10,
    color: "#FFFFFF",
  },
  input: {
    width: screenWidth - 40,
    height: 60,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 9,
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 5,
    marginTop: 5,
    padding: 10,
    color: '#ffffff'
  },
  inputError: {
    borderColor: '#ff0000', // Red border for error
  },
  errorText: {
    fontSize: 14,
    color: '#ff0000',
    marginLeft: 20,
  },
  buttonText: {
    fontSize: 16,
    fontFamily: 'QuickSand',
    color: "#ffffff",
  },
  button: {
    width: screenWidth - 20,
    justifyContent: "center",
    alignItems: "center",
    height: 60,
    marginHorizontal: 10,
    borderRadius: 9,
    marginBottom: 25,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  modal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  image: {
    width: 250,
    height: 250,
    marginHorizontal: 20,
    marginTop: 20,
  },
});
