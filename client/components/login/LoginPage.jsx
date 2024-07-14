// https://github.com/syednomishah/Login-SignUp-UI-React-Native
import React, { useEffect, useState } from "react";
import {
	View,
	Text,
	TouchableOpacity,
	Image,
	TextInput,
	StyleSheet,
	ActivityIndicator,
	Alert,
	BackHandler,
	ImageBackground
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
// import { useNavigation } from "@react-navigation/native";
import { useAuth } from "@/app/context/AuthContext";
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { appLogo } from "@/assets/works";


const LoginScreen = ({ navigation }) => {
	const { onLogin, authState, setToggleModal, toggleModal, handleRenewPassword } = useAuth();
	const [isForgotPassword, setIsForgotPassword] = useState(false)
	const [isPasswordSecure, setIsPasswordSecure] = useState(true);
	const [isRenewPasswordSecure, setIsRenewPasswordSecure] = useState(true);

	// const navigation = useNavigation();
	const [loginForm, setLoginForm] = useState({
		email: "",
		password: "",
	});
	const handleFormChange = (field, value) => {
		setLoginForm({
			...loginForm,
			[field]: value,
		});
	};

	const handlePress = async () => {
			setToggleModal(true)
			if (isForgotPassword) {
				if (loginForm.password !== loginForm.repeatPassword) {
					Alert.alert(
						'Request Fail',
						'Password and repeat password are different!'
					);
					return
				}
				await handleRenewPassword(loginForm)
			} else {
				await onLogin(loginForm);
			}
			// setLogin(true)
	}

	useEffect(() => {
		if (authState.authenticated) {
			setLoginForm({
				email: "",
				password: "",
				repeatPassword: ""
			});
			setToggleModal(false)
			navigation.navigate("Home");
		}
	}, [authState]);

	useEffect(() => {
		if (isForgotPassword === true) {
			setLoginForm(previous => ({
				...previous,
				repeatPassword: ''
			}))
		}
	}, [isForgotPassword])

	useEffect(() => {
		const backAction = () => {
			if (!authState.authenticated) {
				Alert.alert("Hold on!", "Are you sure you want to exit the app?", [
				  {
					text: "Cancel",
					onPress: () => null,
					style: "cancel"
				  },
				  { text: "YES", onPress: () => BackHandler.exitApp() }
				]);
				return true;
			} else {
				return false
			}
		};

		const backHandler = BackHandler.addEventListener(
		  "hardwareBackPress",
		  backAction
		);

		return () => backHandler.remove();
	  }, [authState]);

	return (
		<View style={{ flex: 1, backgroundColor: "#abebfc" }}>
			<SafeAreaView style={{ flex: 1 }}>
				<View className='h-1/3 flex justify-center items-center'>
					<Image
						imageStyle={{ borderRadius: 5 }}
						// className='w-full aspect-video flex flex-row rounded mb-2'
						className='w-40 h-56'
						source={appLogo}
						resizeMode='cover'
					>
						{/* <View
							style={{
								flexDirection: "row",
								justifyContent: "center",
								// position: "absolute",
							}}
						>
							<Image
								source={{
									uri: "https://images.pexels.com/photos/8401876/pexels-photo-8401876.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
								}}
								style={{ width: "100%", height: 500 }}
							/>
						</View> */}
					</Image>
				</View>
				<View style={styles.mainContainer}>
					<View style={{ marginBottom: 2 }}>
						<Text
							style={{
								color: "gray",
								marginLeft: 4,
								marginBottom: 5,
							}}
						>
							Email Address
						</Text>
						<TextInput
							style={styles.inputField}
							placeholder='Email'
							value={loginForm.email}
							onChangeText={(text) => handleFormChange("email", text)}
						/>
					</View>
					<View style={{ marginBottom: 2 }}>
						<Text
							style={{
								color: "gray",
								marginLeft: 4,
								marginBottom: 5,
							}}
						>
							Password
						</Text>
						<TextInput
							inlineImageLeft='search_icon'
							style={styles.inputField}
							secureTextEntry={isPasswordSecure}
							placeholder='Password'
							value={loginForm.password}
							onChangeText={(text) =>
								handleFormChange("password", text)
							}
						/>
						<TouchableOpacity onPress={() => setIsPasswordSecure(!isPasswordSecure)} className='w-8 absolute right-1 bottom-4'>
							<Icon
								name={isPasswordSecure ? 'eye' : 'eye-off'}
								size={20}
								color={'grey'}
							/>
						</TouchableOpacity>
					</View>
					{isForgotPassword && (
						<View style={{ marginBottom: 2 }}>
							<Text
								style={{
									color: "gray",
									marginLeft: 4,
									marginBottom: 5,
								}}
							>
								Repeat password
							</Text>
							<TextInput
								inlineImageLeft='search_icon'
								style={styles.inputField}
								secureTextEntry={isRenewPasswordSecure}
								placeholder='Repeat password'
								value={loginForm.repeatPassword}
								onChangeText={(text) =>
									handleFormChange("repeatPassword", text)
								}
							/>
							<TouchableOpacity onPress={() => setIsRenewPasswordSecure(!isRenewPasswordSecure)} className='w-8 absolute right-1 bottom-4'>
								<Icon
									name={isRenewPasswordSecure ? 'eye' : 'eye-off'}
									size={20}
									color={'grey'}
								/>
							</TouchableOpacity>
						</View>
					)}
					<TouchableOpacity
						style={{ alignItems: "flex-end", marginVertical: "10px" }}
						onPress={() => setIsForgotPassword(!isForgotPassword)}
					>
						<Text style={{ color: "gray", marginBottom: 5 }}>
							{isForgotPassword ? 'Login' : 'Forgot Password?'}
						</Text>
					</TouchableOpacity>
					<TouchableOpacity
						// onPress={async () => {
						// 	setToggleModal(true)
						// 	await onLogin(loginForm);
						// 	// setLogin(true)
						// }}
						onPress={handlePress}
						style={styles.loginBtn}
					>
						<Text className='font-xl font-bold text-center text-gray-700'>
							{isForgotPassword ? 'Update Password' : 'Login'}
						</Text>
					</TouchableOpacity>

					{!isForgotPassword && (
						<>
							<Text className='text-xl text-gray-700 font-bold text-center py-5'>
								Or
							</Text>

							<View style={styles.logoContainer}>
								<TouchableOpacity style={styles.logoBtn}>
									<Image
										source={require("../../assets/icons/google.png")}
										style={styles.logoImg}
									/>
								</TouchableOpacity>
								<TouchableOpacity style={styles.logoBtn}>
									<Image
										source={require("../../assets/icons/apple.png")}
										style={styles.logoImg}
									/>
								</TouchableOpacity>
								<TouchableOpacity style={styles.logoBtn}>
									<Image
										source={require("../../assets/icons/facebook.png")}
										style={styles.logoImg}
									/>
								</TouchableOpacity>
							</View>

							<View style={styles.info}>
								<Text style={{ color: "gray", fontWeight: "600" }}>
									Don't have an account?
								</Text>
								<TouchableOpacity
									onPress={() => navigation.navigate("Register")}
								>
									<Text style={{ fontWeight: "600", color: "#eab308" }}>
										{" "}
										Sign Up
									</Text>
								</TouchableOpacity>
							</View>
						</>
					)}
				</View>
			</SafeAreaView>

			<Modal
				isVisible={toggleModal}
				// onBackdropPress={() => setToggleModal(false)}
			>
				<TouchableOpacity onPress={() => setToggleModal(false)}>
					<View className='flex justify-center items-center'>
						<ActivityIndicator size="large" color="#00ff00" />
					</View>
				</TouchableOpacity>
			</Modal>
		</View>
	);
};
const styles = StyleSheet.create({
	logoImg: { width: 35, height: 35 },
	safeViewContainer: {
		flexDirection: "row",
		justifyContent: "flex-start",
		position: "absolute",
		zIndex: 3,
	},
	backBtn: {
		backgroundColor: "#fbd38d",
		padding: 8,
		borderTopRightRadius: 8,
		borderBottomLeftRadius: 8,
		marginLeft: 16,
		zIndex: 1,
		position: "absolute",
		top: 35,
		left: 0,
	},
	mainContainer: {
		borderTopLeftRadius: 50,
		borderTopRightRadius: 50,
		flex: 1,
		backgroundColor: "white",
		paddingHorizontal: 25,
		paddingTop: 30,
	},
	inputField: {
		padding: 10,
		backgroundColor: "#f3f4f6",
		color: "#374151",
		borderRadius: 16,
		marginBottom: 3,
	},
	loginBtn: {
		backgroundColor: "#facc15",
		borderRadius: 12,
		paddingVertical: 12,
	},
	loginText: {
		fontSize: 15,
		fontWeight: "700",
		textAlign: "center",
		color: "black",
	},
	orText: {
		fontSize: 20,
		color: "gray",
		fontWeight: "600",
		textAlign: "center",
		paddingTop: 5,
		marginVertical: 10,
	},
	logoContainer: {
		flexDirection: "row",
		justifyContent: "center",
		marginVertical: 7,
		display: "flex",
		gap: 15,
	},
	logoBtn: {
		padding: 10,
		backgroundColor: "#f3f4f6",
		borderRadius: 20,
	},
	info: {
		flexDirection: "row",
		justifyContent: "center",
		marginTop: 7,
	},
});

export default LoginScreen;
