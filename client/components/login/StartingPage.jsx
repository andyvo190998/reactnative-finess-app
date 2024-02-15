import { View, Text, Image, ImageBackground } from 'react-native';
import React from 'react';
import { Button } from 'react-native-paper';
import { StyleSheet } from 'react-native';
import { Dimensions } from 'react-native';
import { useAuth } from '@/app/context/AuthContext';
const styles = StyleSheet.create({
  btn: {
    border: '1px solid white',
    paddingHorizontal: '40px',
    marginBottom: '2px',
  },
  container: {
    position: 'absolute',
    zIndex: 2,
    color: 'white',
    fontSize: 20,
    top: '70%',
    // left: '12%',
    // marginTop: '-50px',
    // marginLeft: '-50px',
    display: 'flex',
    flexDirection: 'column',
  },
});

const StartingPage = ({ navigation }) => {
  const { authState } = useAuth();
  const btn = {
    border: '1px solid white',
    width: '80vw',
    // paddingHorizontal: '40px',
    marginBottom: 10,
    color: 'black',
    border: 'none',
  };
  return (
    <View
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Image
        source={require('../../assets/images/login-page.jpg')}
        style={{
          width: Dimensions.get('window').width,
          height: Dimensions.get('window').height + 50,
        }}
      />
      <View style={styles.container}>
        <Text
          style={{
            color: 'white',
            textAlign: 'center',
            fontSize: 40,
            marginBottom: 20,
          }}
        >
          Best <Text className="text-red-600">Workouts</Text> {'\n'} For You
        </Text>
        <Button
          mode="elevated"
          textColor="black"
          dark={true}
          buttonColor="rgb(177 177 77)"
          onPress={() => {
            if (authState.authenticated) {
              navigation.navigate('Home', { id: 1 });
            } else {
              navigation.navigate('Login', { id: 1 });
            }
          }}
          style={btn}
          className="color-white"
        >
          Get Started
        </Button>
      </View>
    </View>
  );
};

export default StartingPage;
