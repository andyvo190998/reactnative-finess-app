import { View, Text, TouchableOpacity, Image, TextInput } from 'react-native';
import React from 'react';
// import { themeColors } from '../theme'
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeftIcon } from 'react-native-heroicons/solid';
import { useNavigation } from '@react-navigation/native';

// subscribe for more videos like this :)
export default function RegisterPage() {
  const navigation = useNavigation();
  return (
    <View className="flex-1 bg-white" style={{ backgroundColor: '#877dfa' }}>
      <SafeAreaView className="flex flex-1">
        <View className="flex-row absolute justify-start">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{
              // backgroundColor: '#fbd38d',
              // padding: 8,
              // borderTopRightRadius: 8,
              // borderBottomLeftRadius: 8,
              // marginLeft: 16,
              // zIndex: 1,
              backgroundColor: '#fbd38d',
              padding: 8,
              borderTopRightRadius: 8,
              borderBottomLeftRadius: 8,
              marginLeft: 16,
              zIndex: 1,
              // backgroundColor: 'yellow',
              // padding: 10,
              // borderTopRightRadius: 50,
              // borderBottomLeftRadius: 50,
              // marginLeft: 4,
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
            value="john snow"
            placeholder="Enter Name"
          />
          <Text className="text-gray-700 ml-4">Email Address</Text>
          <TextInput
            className="p-2 bg-gray-100 text-gray-700 rounded-2xl"
            value="john@gmail.com"
            placeholder="Enter Email"
          />
          <Text className="text-gray-700 ml-4">Password</Text>
          <TextInput
            className="p-2 bg-gray-100 text-gray-700 rounded-2xl mb-2"
            secureTextEntry
            value="test12345"
            placeholder="Enter Password"
          />
          <TouchableOpacity className="py-3 bg-yellow-400 rounded-xl">
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
