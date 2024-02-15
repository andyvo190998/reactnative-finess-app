import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { jwtDecode } from 'jwt-decode';
import 'core-js/stable/atob';

interface AuthProps {
  authState?: { token: string | null; authenticated: boolean | null };
  onRegister?: (email: string, password: string) => Promise<any>;
  onLogin?: (loginForm: { email: string; password: string }) => Promise<any>;
  onLogOut?: () => Promise<any>;
  test?: string;
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
        console.error(error);
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
        console.log('token for decode', token);
        try {
          const decoded = jwtDecode(token);
          console.log('decode', decoded);
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
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
