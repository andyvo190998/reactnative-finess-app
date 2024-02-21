// https://github.com/syednomishah/Login-SignUp-UI-React-Native
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeftIcon } from 'react-native-heroicons/solid';
// import { themeColors } from '../theme';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { useAuth } from '@/app/context/AuthContext';

const LoginScreen = () => {
  const { onLogin, authState } = useAuth();
  const navigation = useNavigation();
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
  });
  const handleFormChange = (field, value) => {
    setLoginForm({
      ...loginForm,
      [field]: value,
    });
  };

  useEffect(() => {
    if (authState.authenticated) {
      setLoginForm({
        email: '',
        password: '',
      });
      navigation.navigate('Home');
    }
  }, [authState]);

  return (
    <View style={{ flex: 1, backgroundColor: '#877dfa' }}>
      <SafeAreaView style={{ flex: 1 }}>
        {/* <View style={styles.safeViewContainer}>
          <TouchableOpacity
            onPress={() => navigation.navigate('Home')}
            style={styles.backBtn}
          >
            <ArrowLeftIcon size={20} color="black" />
          </TouchableOpacity>
        </View> */}
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

      <View style={styles.mainContainer}>
        <View style={{ marginBottom: 2 }}>
          <Text style={{ color: 'gray', marginLeft: 4, marginBottom: 5 }}>
            Email Address
          </Text>
          <TextInput
            style={styles.inputField}
            placeholder="email"
            value={loginForm.email}
            onChangeText={(text) => handleFormChange('email', text)}
          />
        </View>
        <View style={{ marginBottom: 2 }}>
          <Text style={{ color: 'gray', marginLeft: 4, marginBottom: 5 }}>
            Password
          </Text>
          <TextInput
            style={styles.inputField}
            secureTextEntry
            placeholder="password"
            value={loginForm.password}
            onChangeText={(text) => handleFormChange('password', text)}
          />
        </View>
        <TouchableOpacity
          style={{ alignItems: 'flex-end', marginVertical: '10px' }}
        >
          <Text style={{ color: 'gray', marginBottom: 5 }}>
            Forgot Password?
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={async () => {
            await onLogin(loginForm);
          }}
          style={styles.loginBtn}
        >
          <Text className="font-xl font-bold text-center text-gray-700">
            Login
          </Text>
        </TouchableOpacity>

        <Text className="text-xl text-gray-700 font-bold text-center py-5">
          Or
        </Text>

        <View style={styles.logoContainer}>
          <TouchableOpacity style={styles.logoBtn}>
            <Image
              source={require('../../assets/icons/google.png')}
              style={styles.logoImg}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.logoBtn}>
            <Image
              source={require('../../assets/icons/apple.png')}
              style={styles.logoImg}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.logoBtn}>
            <Image
              source={require('../../assets/icons/facebook.png')}
              style={styles.logoImg}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.info}>
          <Text style={{ color: 'gray', fontWeight: '600' }}>
            Don't have an account?
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={{ fontWeight: '600', color: '#eab308' }}>
              {' '}
              Sign Up
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  logoImg: { width: 35, height: 35 },
  safeViewContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    position: 'absolute',
    zIndex: 3,
  },
  backBtn: {
    backgroundColor: '#fbd38d',
    padding: 8,
    borderTopRightRadius: 8,
    borderBottomLeftRadius: 8,
    marginLeft: 16,
    zIndex: 1,
    position: 'absolute',
    top: 35,
    left: 0,
  },
  mainContainer: {
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 25,
    paddingTop: 30,
  },
  inputField: {
    padding: 10,
    backgroundColor: '#f3f4f6',
    color: '#374151',
    borderRadius: 16,
    marginBottom: 3,
  },
  loginBtn: {
    backgroundColor: '#facc15',
    borderRadius: 12,
    paddingVertical: 12,
  },
  loginText: {
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
    color: 'black',
  },
  orText: {
    fontSize: 20,
    color: 'gray',
    fontWeight: '600',
    textAlign: 'center',
    paddingTop: 5,
    marginVertical: 10,
  },
  logoContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 7,
    display: 'flex',
    gap: 15,
  },
  logoBtn: {
    padding: 10,
    backgroundColor: '#f3f4f6',
    borderRadius: 20,
  },
  info: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 7,
  },
});

export default LoginScreen;
