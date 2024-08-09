import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, FlatList, Alert } from "react-native";

import styles from "./welcome.style";
import { SIZES } from "@/constants";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useAuth } from "@/app/context/AuthContext";
import * as ScreenOrientation from "expo-screen-orientation";
import axios from "axios";

const Welcome = ({ setTrainingLevel, navigation }) => {
	const { userInfo, setUserInfo } = useAuth();

	const trainingType = ["Beginner", "Advanced", "Pro"];
	const [activeJobType, setActiveJobType] = useState("Beginner");
	const [isAllowedUser, setIsAllowedUser] = useState(null);

	const icons = {
		Beginner: "emoticon-excited-outline",
		Advanced: "emoticon-wink-outline",
		Pro: "emoticon-devil-outline",
	};

	const handleCheckTrial = (userRegisterDate) => {
		if (!userRegisterDate) {
			return;
		}
		const givenDateTimestamp = new Date(userRegisterDate);
		const currentDate = new Date();

		if (givenDateTimestamp >= currentDate) {
			setIsAllowedUser(true);
		} else {
			setIsAllowedUser(false);
		}
	};

	const handleExtendTrial = async () => {
		await axios
			.post(`${"https://reactnative-finess-app.vercel.app"}/api/users/extend_trial`, {
				email: userInfo.email,
			})
			.then((res) => {
				setUserInfo((previous) => ({ ...previous, trialEndDate: res.data.payload }));
				Alert.alert(
					"Extension Completed",
					"You successfully extended trial period to 1 more week."
				);
			})
			.catch((error) => {
				console.log(error);
				Alert.alert(
					"Extension Failed",
					"Please check your internet connection and try again!"
				);
			});
	};

	useEffect(() => {
		if (userInfo.membership === "Free Trial") {
			handleCheckTrial(userInfo.trialEndDate);
		}
	}, [userInfo]);
	return (
		<View>
			<View style={styles.container}>
				<Text style={styles.userName}>Hello {userInfo.userName}</Text>
				<Text style={styles.welcomeMessage}>Let's us help your back</Text>
			</View>

			<View style={styles.tabsContainer}>
				<FlatList
					data={trainingType}
					renderItem={({ item }) => {
						return (
							<TouchableOpacity
								onPress={() => {
									if (!isAllowedUser) {
										Alert.alert(
											"Trial Period was expired",
											"Please upgrade your subscription",
											[
												{
													text: "Cancel",
													onPress: () => Alert.alert("Cancel Pressed"),
													style: "cancel",
												},
												{
													text: "extend trial",
													onPress: () => handleExtendTrial(),
													style: "cancel",
												},
											]
										);
										return;
									}
									setActiveJobType(item);
									setTrainingLevel(item);

									navigation.navigate("Training", {
										trainingLevel: item,
										units:
											item === "Beginner" ? 2 : item === "Advanced" ? 3 : 4,
									});
									ScreenOrientation.lockAsync(
										ScreenOrientation.OrientationLock.LANDSCAPE
									);
								}}
								style={styles.tab(activeJobType, item)}
							>
								<Icon name={icons[item]} size={30} color={"#ff9a00"} />
								<Text className="ml-1" style={styles.tabText(activeJobType, item)}>
									{item}
								</Text>
							</TouchableOpacity>
						);
					}}
					keyExtractor={(item) => item}
					contentContainerStyle={{ columnGap: SIZES.small }}
					horizontal
					showsHorizontalScrollIndicator={false}
				/>
			</View>
		</View>
	);
};

export default Welcome;
