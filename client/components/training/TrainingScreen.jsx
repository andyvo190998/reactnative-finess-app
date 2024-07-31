import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	Image,
	Dimensions,
	BackHandler,
	ActivityIndicator,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { Audio, ResizeMode, Video } from "expo-av";
const soundSource = require("../../assets/sounds/count-down-ticket-1.mp3");
const successSource = require("../../assets/sounds/success.mp3");
import Modal from "react-native-modal";
import { images } from "@/constants";
import { relaxVideo, trainingVideos } from "@/assets/works";
import CountdownTimerComponent from "./CountdownTimerComponent";
import * as ScreenOrientation from "expo-screen-orientation";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useKeepAwake } from "expo-keep-awake";
import * as FileSystem from "expo-file-system";
import { useRequest } from "../hooks/useRequest";
import axios from "axios";
import SystemNavigationBar from "react-native-system-navigation-bar";

const styles = StyleSheet.create({
	container: {
		flex: 1,
		height: "100%",
		alignItems: "flex-start",
		justifyContent: "flex-start",
		position: "relative",
		backgroundColor: "black",
	},
	funcBtn: {
		borderWidth: 1,
		borderRadius: 5,
		paddingHorizontal: 20,
		paddingVertical: 10,
	},
	text: {
		fontWeight: "600",
	},
	video: {
		flex: 1,
	},
	control: {
		flex: 1.5,
		alignSelf: "stretch",
		justifyContent: "center",
		alignItems: "center",
		display: "flex",
		flexDirection: "column",
		gap: 20,
	},
});
const TrainingScreen = ({ navigation, route }) => {
	useKeepAwake();
	const maxUnits = route.params.units;
	const [count, setCount] = useState(1);
	const [unit, setUnit] = useState(1);
	const [videoList, setVideoList] = useState([]);
	const [videoToPlay, setVideoToPlay] = useState(null);
	const [toggleModal, setToggleModal] = useState(false);
	const [shouldPlay, setShouldPlay] = useState(true);
	const [dimensions, setDimensions] = useState(Dimensions.get("window"));
	const [time, setTime] = useState(15);
	const [mode, setMode] = useState("Get Ready");
	const [isPaused, setIsPaused] = useState(false);
	const [onReset, setOnReset] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	function shuffleArray(array) {
		let arrayCopy = [...array];
		for (var i = arrayCopy.length - 1; i > 0; i--) {
			var j = Math.floor(Math.random() * (i + 1));
			var temp = arrayCopy[i];
			arrayCopy[i] = arrayCopy[j];
			arrayCopy[j] = temp;
		}
		return arrayCopy;
	}

	const video = useRef(null);

	const playSuccessSound = async () => {
		const { sound } = await Audio.Sound.createAsync(successSource);
		await sound.playAsync();
	};

	const playSound = async () => {
		const { sound } = await Audio.Sound.createAsync(soundSource);

		await sound.playAsync();
	};

	const playRandomVideo = async () => {
		if (videoList) {
			setTimeout(() => setVideoToPlay(videoList[count - 1]), 0);
		}
	};

	const handleOnfinish = async () => {
		if (count > 5) {
			if (unit < maxUnits) {
				// await playRandomVideo()

				setTimeout(() => setVideoToPlay(relaxVideo), 0);
				setTimeout(() => setUnit((previous) => previous + 1), 0);
				setTimeout(() => setCount(1), 0);
				setTimeout(() => setMode("Long Break"), 0);
				setTimeout(() => setTime(5), 0);
			} else {
				await handleComplete();
			}
			return;
		}
		if (mode === "Training") {
			await playRandomVideo();
			setTimeout(() => setMode("Rest"), 0);
			setTimeout(() => setTime(15), 0);
		} else if (mode === "Rest" || mode === "Get Ready") {
			setTimeout(() => setCount((previous) => previous + 1), 0);
			setTimeout(() => setMode("Training"), 0);
			if (video.current) {
				await video.current.setPositionAsync(0);
				video.current.playAsync();
			}
			if (count !== 0) {
				setTimeout(() => setTime(5), 0);
			}
		} else if (mode === "Long Break") {
			setTimeout(() => setMode("Get Ready"), 0);
			await playRandomVideo();
			setTimeout(() => setTime(15), 0);
		}
	};

	const handleComplete = async () => {
		const suffledArr = shuffleArray(trainingVideos);
		setTimeout(() => setVideoList(suffledArr), 0);
		await playSuccessSound();
		setTimeout(() => setToggleModal(true), 0);
		setTimeout(() => setIsPaused(true), 0);
		setTimeout(() => setUnit(1), 0);
		setTimeout(() => setCount(1), 0);
		setTimeout(() => setMode("Get Ready"), 0);
		setTimeout(() => setTime(15), 0);
		setTimeout(() => setShouldPlay(false), 0);
	};

	const handleBackButtonClick = () => {
		ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
		navigation.goBack();
		setShouldPlay(false);
		setIsPaused(true);
		return true;
	};

	const onResetExercise = () => {
		setUnit(1);
		setCount(1);
		setIsPaused(false);
		setMode("Get Ready");
		setTime(15);
		setOnReset(true);
	};

	useEffect(() => {
		const downloadVideo = async (id) => {
			const googleDriveUri = `https://drive.google.com/uc?export=view&id=${id}`;
			// const fileUri = FileSystem.cacheDirectory + "video.mp4";
			const fileUri = `${FileSystem.documentDirectory}${id}.mp4`;
			const { exists } = await FileSystem.getInfoAsync(fileUri);
			if (!exists) {
				await FileSystem.downloadAsync(googleDriveUri, fileUri);
			}
			setVideoList((previous) => {
				setVideoToPlay(previous[0]);
				return [...previous, fileUri];
			});
		};

		const doRequest = async () => {
			axios
				.get("https://reactnative-finess-app.vercel.app/videos")
				.then(function (response) {
					const suffledData = shuffleArray(response.data);
					suffledData.forEach((item) => {
						downloadVideo(item.id);
					});
				})
				.catch(function (error) {
					console.log(error);
				});
		};
		doRequest();
	}, []);

	useEffect(() => {
		const updateDimensions = () => {
			setDimensions(Dimensions.get("window"));
		};
		Dimensions.addEventListener("change", updateDimensions);
		playRandomVideo();
	}, []);

	useEffect(() => {
		BackHandler.addEventListener("hardwareBackPress", handleBackButtonClick);
		return () => {
			BackHandler.removeEventListener("hardwareBackPress", handleBackButtonClick);
		};
	}, []);

	useEffect(() => {
		setShouldPlay(true);
		setIsPaused(false);
	}, [route]);

	useEffect(() => {
		onResetExercise();
	}, [route, navigation]);

	return (
		<View style={styles.container}>
			{videoToPlay && (
				<Video
					ref={video}
					style={{ ...styles.video, width: dimensions.width, height: dimensions.height }}
					source={
						mode === "Long Break"
							? videoToPlay
							: {
									uri: videoToPlay,
							  }
					}
					useNativeControls={false}
					resizeMode={ResizeMode.CONTAIN}
					isLooping
					shouldPlay={shouldPlay}
				/>
			)}
			<View className="absolute flex flex-col justify-center items-center top-7 left-32">
				<View className="flex flex-row gap-5">
					<Text className="text-lg">
						Exercise : <Text style={{ fontFamily: "DMBold" }}>{count - 1}</Text>
					</Text>
					<Text className="text-lg">
						Unit :{" "}
						<Text style={{ fontFamily: "DMBold" }}>
							{unit}/{maxUnits}
						</Text>
					</Text>
				</View>
				<CountdownTimerComponent
					durationInSeconds={time}
					isPaused={isPaused}
					onFinish={async (e) => {
						await handleOnfinish();
					}}
					onChange={async (e) => {
						if (e === 6) {
							await playSound();
						}
					}}
					onReset={onReset}
					setOnReset={setOnReset}
				/>

				<Text className="text-2xl font-semibold">{mode}</Text>
				{/* <View className="flex flex-row items-center justify-center gap-1 z-10">
					<TouchableOpacity onPress={() => onResetExercise()} style={styles.funcBtn}>
						<Text style={styles.text}>RESET</Text>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={() => {
							setIsPaused(!isPaused);
							setShouldPlay(!shouldPlay);
						}}
					>
						<Icon name={isPaused ? "play" : "pause"} size={80} color={"#ff9a00"} />
					</TouchableOpacity>
					<TouchableOpacity
						style={styles.funcBtn}
						onPress={() => {
							setMode("Rest");
							setTime(15);
						}}
					>
						<Text style={styles.text}>REST</Text>
					</TouchableOpacity>
				</View> */}
			</View>
			<Modal isVisible={toggleModal} onBackdropPress={() => setToggleModal(false)}>
				<TouchableOpacity onPress={() => setToggleModal(false)}>
					<View className="flex justify-center items-center">
						<Image
							source={images.reward}
							resizeMode="contain"
							style={{
								width: "100%",
								height: undefined,
								aspectRatio: 1,
							}}
						/>
						<Text className="text-slate-300 text-2xl" style={{ fontFamily: "DMBold" }}>
							Congratulation!
						</Text>
						<Text className="text-slate-300 text-lg" style={{ fontFamily: "DMBold" }}>
							You have completed today's training.
						</Text>
					</View>
				</TouchableOpacity>
			</Modal>
		</View>
	);
};

export default TrainingScreen;
