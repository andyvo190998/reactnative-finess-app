import React, { useRef, useState } from "react";
import { View, Text, ImageBackground, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { trainingImage, trainingVideos } from "@/assets/works";
import Modal from 'react-native-modal';
import { ResizeMode, Video } from "expo-av";

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

	const styles = StyleSheet.create({
		video: {
		  alignSelf: 'center',
		//   width: 200,
		  height: 200,
		},
	  });

	const [toggleModal, setToggleModal] = useState(false)
	const video = useRef(null);
	return (
		<View className='mt-2 flex flex-col'>
			{trainingImage.map((image, idx) => {
				return (
					<TouchableOpacity key={idx} onPress={() => setToggleModal(true)}>
						<ImageBackground
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
					</TouchableOpacity>
				)
			})}
			<Modal
				isVisible={toggleModal}
				onBackdropPress={() => setToggleModal(false)}
			>
				<View className='flex flex-col bg-white justify-center p-2 rounded-lg'>
					<Text className='text-lg font-bold mb-2'>Exercise Instruction</Text>
					<Text>This is instruction text: Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo facilis excepturi deserunt sit debitis reprehenderit repudiandae labore laborum voluptatem similique, repellendus sed a illo autem tempora dignissimos eveniet pariatur? Est.</Text>
					<Text className='my-2 font-bold'>Demo video. (just make an example and it will later change dynamically based on selected exercise)</Text>
					<Video
						ref={video}
						style={{...styles.video, width: Dimensions.get("window").width }}
						source={trainingVideos[0]}
						resizeMode={ResizeMode.CONTAIN}
						isLooping
						shouldPlay={true}
						useNativeControls={false}
					/>
				</View>
			</Modal>
		</View>
	);
};

export default TrainingList;
