import React from "react";
import { View, Text, ImageBackground, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import * as ScreenOrientation from "expo-screen-orientation";
import { trainingImage } from "@/assets/works";

const TrainingList = ({ navigation, trainingLevel }) => {
	const dummyData = [
		{
			uri: "https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
			time: "10 min",
			id: "10",
			trainingLevel: "Beginner",
			units: "2",
		},
		{
			uri: "https://images.pexels.com/photos/949126/pexels-photo-949126.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
			time: "20 min",
			id: "20",
			trainingLevel: "Advanced",
			units: "3",
		},
		{
			uri: "https://images.pexels.com/photos/136410/pexels-photo-136410.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
			time: "30 min",
			id: "30",
			trainingLevel: "Pro",
			units: "4",
		},
	];

	return (
		<View className='mt-2 flex flex-col'>
			{trainingImage.map((image, idx) => {
				return (
					// <TouchableOpacity
					// 	key={idx}
					// 	onPress={() => {
					// 		navigation.navigate("Training", {
					// 			trainingLevel: item.trainingLevel,
					// 			units: item.units,
					// 		})
					// 		ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
					// 	}}
					// >
						<ImageBackground
							key={idx}
							imageStyle={{ borderRadius: 5 }}
							className='w-full h-52 flex flex-row rounded mb-2'
							source={image}
							resizeMode='cover'
						>
							<View className='flex flex-row mt-5 ml-5 justify-center '>
								<Icon
									name='dumbbell'
									size={30}
									color={"white"}
								/>
								<Text className='text-white text-lg font-bold ml-2'>
									Exercise Name...
								</Text>
							</View>
						</ImageBackground>
					// </TouchableOpacity>
				)
			})}
		</View>
	);
};

export default TrainingList;
