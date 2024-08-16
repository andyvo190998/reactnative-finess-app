import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, FlatList, Alert } from "react-native";

import styles from "./welcome.style";
import { SIZES } from "@/constants";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useAuth } from "@/app/context/AuthContext";
import * as ScreenOrientation from "expo-screen-orientation";
import axios from "axios";
import Modal from "react-native-modal";
import useRequest from "@/components/hooks/useRequest";
const TrainingLevel = ({ setTrainingLevel, navigation }) => {
	const { userInfo, setUserInfo } = useAuth();

	const trainingType = [
		{
			name: "Beginner",
			icon: "emoticon-excited-outline",
		},
		{
			name: "Advanced",
			icon: "emoticon-wink-outline",
		},
		{
			name: "Pro",
			icon: "emoticon-devil-outline",
		},
		{
			name: "Custom",
			icon: "circle-edit-outline",
		},
	];
	const [activeJobType, setActiveJobType] = useState("Beginner");
	const [isAllowedUser, setIsAllowedUser] = useState(null);
	const [openCustom, setOpenCustom] = useState(false);

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

	const handleSelectLevel = (item) => {
		if (!isAllowedUser) {
			Alert.alert("Trial Period was expired", "Please upgrade your subscription", [
				{
					text: "Cancel",
					style: "cancel",
				},
				{
					text: "extend trial",
					onPress: () => handleExtendTrial(),
					style: "cancel",
				},
			]);
			return;
		}

		if (item.name === "Custom") {
			setOpenCustom(true);
			return;
		}
		setActiveJobType(item.name);
		setTrainingLevel(item.name);

		navigation.navigate("Training", {
			trainingLevel: item.name,
			units: item.name === "Beginner" ? 2 : item.name === "Advanced" ? 3 : 4,
		});
		ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
	};

	useEffect(() => {
		if (userInfo.membership === "Free Trial") {
			handleCheckTrial(userInfo.trialEndDate);
		} else {
			setIsAllowedUser(true);
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
								onPress={() => handleSelectLevel(item)}
								style={styles.tab(activeJobType, item.name)}
							>
								<Icon name={item.icon} size={30} color={"#ff9a00"} />
								<Text
									className="ml-1"
									style={styles.tabText(activeJobType, item.name)}
								>
									{item.name}
								</Text>
							</TouchableOpacity>
						);
					}}
					keyExtractor={(item) => item.name}
					contentContainerStyle={{ columnGap: SIZES.small }}
					horizontal
					showsHorizontalScrollIndicator={false}
				/>
			</View>
			<Modal isVisible={openCustom} onBackdropPress={() => setOpenCustom(false)}>
				<View className="flex flex-col bg-white justify-center p-2 rounded-lg">
					<Text>Hello world</Text>
				</View>
			</Modal>
		</View>
	);
};

export default TrainingLevel;
