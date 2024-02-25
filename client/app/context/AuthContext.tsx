import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { jwtDecode } from "jwt-decode";
import "core-js/stable/atob";
import { Alert } from "react-native";
// @ts-ignore: Unreachable code error
import { EXPRESS_API } from "@env";

interface AuthProps {
	authState?: { token: string | null; authenticated: boolean | null };
	onRegister?: (email: string, password: string) => Promise<any>;
	onLogin?: (loginForm: { email: string; password: string }) => Promise<any>;
	onLogOut?: () => Promise<any>;
	test?: string;
	userInfo?: {
		userName: string | null;
		email: string | null;
		trialEndDate: string | null;
		membership: string | null;
	};
}

const TOKEN_KEY = "access_token";
export const API_URL = "";
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
		membership: string | null;
		trialEndDate: string | null;
	}>({
		userName: null,
		email: null,
		trialEndDate: null,
		membership: null,
	});

	const handleLogin = async (loginForm: {
		email: string;
		password: string;
	}) => {
		await axios
			.post(`${EXPRESS_API}/api/users/login`, loginForm)
			.then(async (res) => {
				const token = res.data.token;
				setAuthState({
					token: token,
					authenticated: true,
				});

				const user = res.data.authenticatedUser;
				setUserInfo({
					userName: user.name,
					email: user.email,
					trialEndDate: user.trialEndDate,
					membership: user.membership,
				});
				axios.defaults.headers.common[
					"Authorization"
				] = `Bearer ${token}`;
				await SecureStore.setItemAsync(TOKEN_KEY, token);
				return true;
			})
			.catch((error) => {
				Alert.alert(
					"Login Fail",
					"Please check your account and login again!"
				);
				return false;
			});
	};

	const handleLogOut = async () => {
		await SecureStore.deleteItemAsync(TOKEN_KEY);

		axios.defaults.headers.common["Authorization"] = "";

		setAuthState({
			token: null,
			authenticated: false,
		});
		setUserInfo({
			userName: null,
			email: null,
			trialEndDate: null,
			membership: null,
		});
	};

	useEffect(() => {
		const loadToken = async () => {
			const token = await SecureStore.getItemAsync(TOKEN_KEY);
			if (token) {
				axios.defaults.headers.common[
					"Authorization"
				] = `Bearer ${token}`;
				try {
					const decoded = jwtDecode(token);
					console.log("decode", decoded);
					// @ts-ignore: Unreachable code error
					setUserInfo({
						// @ts-ignore: Unreachable code error
						userName: decoded.name,
						// @ts-ignore: Unreachable code error
						email: decoded.email,
						// @ts-ignore: Unreachable code error
						membership: decoded.membership,
						// @ts-ignore: Unreachable code error
						trialEndDate: decoded.trialEndDate,
					});
				} catch (error) {
					console.error(error);
				}

				setAuthState({
					token: token,
					authenticated: true,
				});
			}
		};
		loadToken();
	}, []);
	const test = "123";
	const value = {
		setAuthState: setAuthState,
		authState: authState,
		onLogin: handleLogin,
		onLogOut: handleLogOut,
		test: test,
		userInfo: userInfo,
		setUserInfo: setUserInfo,
	};

	return (
		<AuthContext.Provider value={value}>{children}</AuthContext.Provider>
	);
};
