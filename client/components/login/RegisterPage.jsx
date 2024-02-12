import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
} from 'react-native';
import React, { useState } from 'react';
// import { themeColors } from '../theme'
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeftIcon } from 'react-native-heroicons/solid';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

// subscribe for more videos like this :)
export default function RegisterPage({ navigation }) {
  // const navigation = useNavigation();

  const [registrationForm, setRegistrationForm] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleInputChange = (fieldName, value) => {
    setRegistrationForm({
      ...registrationForm,
      [fieldName]: value,
    });
  };

  const handleRegistration = async () => {
    const checkValidInput = isFormValid();
    if (checkValidInput === true) {
      await axios
        .post('http://192.168.56.1:5000/api/users/register/', registrationForm)
        .then(() => {
          Alert.alert('Registration Success!', 'Please Login!', [
            {
              text: 'Login',
              onPress: () => {
                setRegistrationForm({
                  name: '',
                  email: '',
                  password: '',
                });
                navigation.navigate('Login');
              },
            },
          ]);
        })
        .catch(() => {
          Alert.alert('Email exists!', 'Please use another email!');
        });
    } else if (checkValidInput === 'invalidPassword') {
      Alert.alert(
        'Invalid Password',
        'Password must be at least 8 characters long and contain letters, numbers, and special characters.'
      );
    } else if (checkValidInput === 'invalidName') {
      Alert.alert('Invalid Name', 'Please enter your name.');
    } else {
      Alert.alert('Invalid Email', 'Please enter valid email.');
    }
  };
  const isFormValid = () => {
    const isValidEmail = registrationForm.email.includes('@');
    const passwordRegex =
      /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    const isValidPassword = passwordRegex.test(registrationForm.password);

    if (registrationForm.name === '') {
      return 'invalidName';
    } else if (!isValidEmail) {
      return 'invalidEmail';
    } else if (!isValidPassword) {
      return 'invalidPassword';
    } else {
      return true;
    }
  };
  return (
    <View className="flex-1 bg-white" style={{ backgroundColor: '#877dfa' }}>
      <SafeAreaView className="flex flex-1">
        <View className="flex-row absolute justify-start">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{
              backgroundColor: '#fbd38d',
              padding: 8,
              borderTopRightRadius: 8,
              borderBottomLeftRadius: 8,
              marginLeft: 16,
              zIndex: 1,
              position: 'absolute',
              top: 35,
              left: 0,
            }}
          >
            <ArrowLeftIcon size="20" color="black" />
          </TouchableOpacity>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            position: 'absolute',
          }}
        >
          <Image
            source={{
              uri: 'https://images.pexels.com/photos/8401876/pexels-photo-8401876.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
            }}
            style={{ width: '100%', height: 500 }}
          />
        </View>
      </SafeAreaView>
      <View
        className="flex-2 bg-white px-8 pt-5"
        style={{
          borderTopLeftRadius: 50,
          borderTopRightRadius: 50,
        }}
      >
        <View className="form space-y-2">
          <Text className="text-gray-700 ml-4">Full Name</Text>
          <TextInput
            className="p-2 bg-gray-100 text-gray-700 rounded-2xl"
            value={registrationForm.name}
            placeholder="Enter Name"
            onChangeText={(text) => handleInputChange('name', text)}
          />
          <Text className="text-gray-700 ml-4">Email Address</Text>
          <TextInput
            className="p-2 bg-gray-100 text-gray-700 rounded-2xl"
            value={registrationForm.email}
            placeholder="Enter Email"
            onChangeText={(text) => handleInputChange('email', text)}
            keyboardType="email-address"
          />
          <Text className="text-gray-700 ml-4">Password</Text>
          <TextInput
            className="p-2 bg-gray-100 text-gray-700 rounded-2xl mb-2"
            secureTextEntry
            value={registrationForm.password}
            placeholder="Enter Password"
            onChangeText={(text) => handleInputChange('password', text)}
          />
          <TouchableOpacity
            onPress={handleRegistration}
            className="py-3 bg-yellow-400 rounded-xl"
          >
            <Text className="font-xl font-bold text-center text-gray-700">
              Sign Up
            </Text>
          </TouchableOpacity>
        </View>
        <Text className="text-xl text-gray-700 font-bold text-center py-5">
          Or
        </Text>
        <View className="flex-row justify-center gap-4">
          <TouchableOpacity className="p-2 bg-gray-100 rounded-2xl">
            <Image
              source={require('../../assets/icons/google.png')}
              className="w-10 h-10"
            />
          </TouchableOpacity>
          <TouchableOpacity className="p-2 bg-gray-100 rounded-2xl">
            <Image
              source={require('../../assets/icons/apple.png')}
              className="w-10 h-10"
            />
          </TouchableOpacity>
          <TouchableOpacity className="p-2 bg-gray-100 rounded-2xl">
            <Image
              source={require('../../assets/icons/facebook.png')}
              className="w-10 h-10"
            />
          </TouchableOpacity>
        </View>
        <View className="flex-row justify-center mt-5 mb-5">
          <Text className="text-gray-500 font-semibold">
            Already have an account?
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text className="font-semibold text-yellow-500"> Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
