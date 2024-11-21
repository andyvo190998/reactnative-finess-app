import { View, StyleSheet, Alert } from "react-native";
import React, { useState } from "react";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import {
	Avatar,
	Title,
	Caption,
	Drawer,
	Paragraph,
	Text,
	TouchableRipple,
	Switch,
} from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Icon1 from "react-native-vector-icons/Ionicons";
import { useAuth } from "@/app/context/AuthContext";
import Modal from "react-native-modal";
import { Calendar, LocaleConfig } from "react-native-calendars";

const DrawerContent = (props) => {
	const { onLogOut } = useAuth();
	const [openStreak, setOpenStreak] = useState();
	return (
		<View style={{ flex: 1 }}>
			<DrawerContentScrollView {...props}>
				<View style={styles.drawerContent}>
					<View style={styles.userInfoSection}>
						<View style={{ flexDirection: "row", marginTop: 15 }}>
							<Avatar.Image
								source={require("../../assets/images/kemal.jpg")}
								size={50}
							/>
							<View style={{ marginLeft: 15, flexDirection: "column" }}>
								<Title style={styles.title}>Andy Vo</Title>
								<Caption style={styles.caption}>@a_vo</Caption>
							</View>
						</View>

						<View style={styles.row}>
							<TouchableRipple
								onPress={() => {
									setOpenStreak(true);
								}}
							>
								<View style={styles.section}>
									<Icon name="fire" size={30} color={"#ff9a00"} />
									<Paragraph style={[styles.paragraph, styles.caption]}>
										80
									</Paragraph>
									<Caption style={styles.caption}>days streak!</Caption>
								</View>
							</TouchableRipple>
						</View>
					</View>

					<Drawer.Section style={styles.drawerSection}>
						<DrawerItem
							icon={({ color, size }) => (
								<Icon name="home-outline" color={color} size={size} />
							)}
							label="Home"
							onPress={() => {
								props.navigation.navigate("Home");
							}}
						/>
						<DrawerItem
							icon={({ color, size }) => (
								<Icon name="account-outline" color={color} size={size} />
							)}
							label="Profile"
							onPress={() => {
								props.navigation.navigate("Profile");
							}}
						/>
						<DrawerItem
							icon={({ color, size }) => (
								<Icon name="bookmark-outline" color={color} size={size} />
							)}
							label="Bookmarks"
							onPress={() => {
								// props.navigation.navigate('BookmarkScreen');
								Alert.alert("Info", "This feature is temporarily disable");
							}}
						/>

						<DrawerItem
							icon={({ color, size }) => (
								<Icon1 name="settings-outline" color={color} size={size} />
							)}
							label="Settings"
							onPress={() => {
								// props.navigation.navigate('SettingsScreen');
								Alert.alert("Info", "This feature is temporarily disable");
							}}
						/>
						<DrawerItem
							icon={({ color, size }) => (
								<Icon name="account-check-outline" color={color} size={size} />
							)}
							label="Support"
							onPress={() => {
								// props.navigation.navigate('Login');
								Alert.alert("Info", "This feature is temporarily disable");
							}}
						/>
					</Drawer.Section>
					<Drawer.Section title="Preferences">
						<TouchableRipple
							onPress={() => {
								Alert.alert("Info", "This feature is temporarily disable");
							}}
						>
							<View style={styles.preference}>
								<Text>Dark Theme</Text>
								<View pointerEvents="none">
									{/* <Switch value={paperTheme.dark}/> */}
								</View>
							</View>
						</TouchableRipple>
					</Drawer.Section>
				</View>
			</DrawerContentScrollView>
			<Drawer.Section style={styles.bottomDrawerSection}>
				<DrawerItem
					icon={({ color, size }) => (
						<Icon name="exit-to-app" color={color} size={size} />
					)}
					label="Sign Out"
					onPress={async () => {
						await onLogOut();
						props.navigation.navigate("Login");
					}}
				/>
			</Drawer.Section>
			<Modal isVisible={openStreak} onBackdropPress={() => setOpenStreak(false)}>
				<View className="flex flex-col bg-white justify-center items-center p-2 rounded-lg">
					<Calendar
						//   onDayPress={day => {
						//     setSelected(day.dateString);
						//   }}
						// markedDates={{
						// 	[selected]: {
						// 		selected: true,
						// 		disableTouchEvent: true,
						// 		selectedDotColor: "orange",
						// 	},
						// }}
						markingType={"period"}
						markedDates={{
							"2024-11-21": { startingDay: true, textColor: "green" },
							"2024-11-22": { color: "green" },
							"2024-11-23": {
								selected: true,
								endingDay: true,
								color: "green",
								textColor: "gray",
							},
							"2024-11-04": {
								disabled: true,
								startingDay: true,
								color: "green",
								endingDay: true,
							},
						}}
					/>
				</View>
			</Modal>
		</View>
	);
};

export default DrawerContent;

const styles = StyleSheet.create({
	drawerContent: {
		flex: 1,
	},
	userInfoSection: {
		paddingLeft: 20,
	},
	title: {
		fontSize: 16,
		marginTop: 3,
		fontWeight: "bold",
	},
	caption: {
		fontSize: 14,
		lineHeight: 14,
	},
	row: {
		marginTop: 20,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
	},
	section: {
		flexDirection: "row",
		alignItems: "center",
		marginRight: 15,
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
	},
	paragraph: {
		fontWeight: "bold",
		marginRight: 3,
	},
	drawerSection: {
		marginTop: 15,
	},
	bottomDrawerSection: {
		marginBottom: 15,
		borderTopColor: "#f4f4f4",
		borderTopWidth: 1,
	},
	preference: {
		flexDirection: "row",
		justifyContent: "space-between",
		paddingVertical: 12,
		paddingHorizontal: 16,
	},
});
