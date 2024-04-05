import { View, Text, Image, ImageBackground } from "react-native";
import React from "react";
import { Button } from "react-native-paper";
import { useAuth } from "@/app/context/AuthContext";
import { images } from "@/constants";

const StartingPage = ({ navigation }) => {
	const { authState } = useAuth();
	const btn = {
		border: "1px solid white",
		width: "80vw",
		marginBottom: 10,
		color: "black",
		border: "none",
	};
	return (
		<ImageBackground
			imageStyle={{ borderRadius: 5 }}
			className='w-full h-full flex flex-col rounded  justify-between items-center'
			source={require("../../assets/images/login-page.jpg")}
			resizeMode='cover'
		>
			<View className='w-full h-full  flex -flex-col justify-between items-center py-10'>
				<Image
					resizeMode='contain'
					source={images.logo}
					style={{
						width: "50%",
						height: undefined,
						aspectRatio: 1,
					}}
				/>

				<View>
					<Text
						style={{
							color: "white",
							textAlign: "center",
							fontSize: 40,
							marginBottom: 20,
						}}
					>
						Best <Text className='text-red-600'>Workouts</Text>{" "}
						{"\n"} For You
					</Text>
					<Button
						mode='elevated'
						textColor='black'
						dark={true}
						buttonColor='rgb(177 177 77)'
						onPress={() => {
							if (authState.authenticated) {
								navigation.navigate("Home", { id: 1 });
							} else {
								navigation.navigate("Login", { id: 1 });
							}
						}}
						style={btn}
						className='color-white'
					>
						Get Started
					</Button>
				</View>
			</View>
		</ImageBackground>

		// </View>
	);
};

export default StartingPage;
