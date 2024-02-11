import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { useNavigation } from 'expo-router';

const Profile = () => {
  const navigation = useNavigation();
  return (
    <View className="bg-slate-400 flex justify-center items-center h-full">
      <Text>Profile</Text>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text>Go back</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Profile;
