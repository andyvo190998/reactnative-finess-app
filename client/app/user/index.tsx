import { View, Text } from 'react-native';
import React from 'react';
import { Link } from 'expo-router';

const User = () => {
  return (
    <View>
      <Text>Users page</Text>
      <Link href="/user/1">Go to user 1</Link>
    </View>
  );
};

export default User;
