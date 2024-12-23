import React, { useState } from "react";
import { View, Text, ImageBackground, TouchableOpacity, StyleSheet, Image } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Modal from "react-native-modal";
import useRequest from "@/components/hooks/useRequest";

const TrainingList = () => {
	const styles = StyleSheet.create({
		video: {
			alignSelf: "center",
			aspectRatio: 16 / 9,
		},
	});

	const {
		data: photos,
		loading: loadingPhotos,
		error: errorPhotos,
	} = useRequest("https://reactnative-finess-app.vercel.app/api/training/photos", "get");
	const [toggleModal, setToggleModal] = useState(false);
	const [selectedExercise, setSelectedExercise] = useState("");
	const webViewURL = "https://drive.google.com/uc?export=view&id=";

	if (loadingPhotos) {
		return (
			<View className="flex flex-row gap-1 w-full justify-center items-center mt-2">
				<Text>Loading exercise ... </Text>
			</View>
		);
	}

	if (errorPhotos) {
		return (
			<View className="flex flex-row gap-1 w-full justify-center items-center mt-2">
				<MaterialIcons name="error-outline" />
				<Text>Loading Image Error</Text>
			</View>
		);
	}

	return (
		<View className="mt-2 flex flex-col">
			{photos.map((image, idx) => {
				const splitDot = image.name.split(".");
				const exerciseName = splitDot.length ? splitDot[0] : "Undefined Name";
				if (idx < 19) {
					return (
						<TouchableOpacity
							activeOpacity={1}
							key={idx}
							onPress={() => {
								setToggleModal(true);
								setSelectedExercise({
									name: exerciseName,
									id: image.id,
								});
							}}
						>
							<ImageBackground
								imageStyle={{ borderRadius: 5 }}
								className="w-full aspect-video flex flex-row rounded mb-2"
								source={{
									uri: `${webViewURL}${image.id}`,
								}}
								resizeMode="cover"
							>
								<View className="flex flex-row mt-5 ml-5 justify-center ">
									<Icon name="dumbbell" size={30} color={"white"} />
									<Text className="text-white text-lg font-bold ml-2">
										{exerciseName}
									</Text>
								</View>
							</ImageBackground>
						</TouchableOpacity>
					);
				}
			})}
			{photos ? (
				<Text>
					There are {photos.length} photos totally. But for testing I just show 20
				</Text>
			) : null}
			<Modal
				isVisible={toggleModal}
				onBackdropPress={() => {
					setToggleModal(false);
					setSelectedExercise("");
				}}
			>
				<View className="flex flex-col bg-white justify-center p-2 rounded-lg">
					<Text className="text-lg font-bold mb-2">{selectedExercise.name}</Text>
					<Text className="mb-2">
						This is instruction text: Lorem ipsum dolor sit amet consectetur adipisicing
						elit. Nemo facilis excepturi deserunt sit debitis reprehenderit repudiandae
						labore laborum voluptatem similique, repellendus sed a illo autem tempora
						dignissimos eveniet pariatur? Est.
					</Text>
					{!selectedExercise.id ? (
						<Text className="color-red-500">Image Not Found</Text>
					) : (
						<Image
							className="w-full aspect-video rounded-lg"
							source={{ uri: `${webViewURL}${selectedExercise.id}` }}
						/>
					)}
				</View>
			</Modal>
		</View>
	);
};

export default TrainingList;
