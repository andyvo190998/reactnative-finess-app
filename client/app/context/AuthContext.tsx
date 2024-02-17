import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { jwtDecode } from 'jwt-decode';
import 'core-js/stable/atob';
import { Alert } from 'react-native';

interface AuthProps {
  authState?: { token: string | null; authenticated: boolean | null };
  onRegister?: (email: string, password: string) => Promise<any>;
  onLogin?: (loginForm: { email: string; password: string }) => Promise<any>;
  onLogOut?: () => Promise<any>;
  test?: string;
  userInfo?: { userName: string | null; email: string | null };
}

const TOKEN_KEY = 'access_token';
export const API_URL = '';
const AuthContext = createContext<AuthProps>({});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }: any) => {
  const [authState, setAuthState] = useState<{
    token: string | null;
    authenticated: boolean | null;
  }>({
    token: null,
    authenticated: null,
  });

  const [userInfo, setUserInfo] = useState<{
    userName: string | null;
    email: string | null;
  }>({
    userName: null,
    email: null,
  });

  const handleLogin = async (loginForm: {
    email: string;
    password: string;
  }) => {
    await axios
      .post('http://192.168.56.1:5000/api/users/login', loginForm)
      .then(async (res) => {
        const token = res.data.token;
        setAuthState({
          token: token,
          authenticated: true,
        });

        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        await SecureStore.setItemAsync(TOKEN_KEY, token);
        return true;
      })
      .catch((error) => {
        Alert.alert('Login Fail', 'Please check your account and login again!');
        return false;
      });
  };

  const handleLogOut = async () => {
    await SecureStore.deleteItemAsync(TOKEN_KEY);

    axios.defaults.headers.common['Authorization'] = '';

    setAuthState({
      token: null,
      authenticated: false,
    });
  };

  useEffect(() => {
    const loadToken = async () => {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        try {
          const decoded = jwtDecode(token);
          setUserInfo({
            // @ts-ignore: Unreachable code error
            userName: decoded.name,
            // @ts-ignore: Unreachable code error
            email: decoded.email,
          });
        } catch (error) {
          console.log(error);
        }

        setAuthState({
          token: token,
          authenticated: true,
        });
      }
    };
    loadToken();
  }, []);
  const test = '123';
  const value = {
    setAuthState: setAuthState,
    authState: authState,
    onLogin: handleLogin,
    onLogOut: handleLogOut,
    test: test,
    userInfo: userInfo,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
