import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	Image,
	Dimensions,
	BackHandler,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Audio, ResizeMode, Video } from 'expo-av';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
const soundSource = require('../../assets/sounds/count-down-tick.mp3');
const successSource = require('../../assets/sounds/success.mp3');
import Modal from 'react-native-modal';
import { images } from '@/constants';
import { trainingVideos } from '@/assets/works';
import CountdownTimerComponent from './CountdownTimerComponent'
import * as ScreenOrientation from "expo-screen-orientation";
const styles = StyleSheet.create({
	container: {
		flex: 1,
		height: '100%',
		alignItems: 'flex-start',
		justifyContent: 'flex-start',
		position: 'relative',
		backgroundColor: 'black'
	},
	funcBtn: {
		borderWidth: 1,
		borderRadius: 5,
		paddingHorizontal: 20,
		paddingVertical: 10,
	},
	text: {
		fontWeight: '600',
	},
	video: {
		flex: 1,
	},
	control: {
		flex: 1.5,
		alignSelf: 'stretch',
		justifyContent: 'center',
		alignItems: 'center',
		display: 'flex',
		flexDirection: 'column',
		gap: 20,
	},
});
const TrainingScreen = ({ navigation, route }) => {
	const maxUnits = route.params.units;
	const firstPlay = trainingVideos[Math.floor(Math.random() * trainingVideos.length)]
	const trainingLevel = route.params.trainingLevel;
	const [isTraining, setIsTraining] = useState(true);
	const [isPlaying, setIsPlaying] = useState(false);
	const [count, setCount] = useState(1);
	const [unit, setUnit] = useState(1);
	const [videoList, setVideoList] = useState([...trainingVideos])
	const [playedVideos, setPlayedVideos] = useState([])
	const [videoToPlay, setVideoToPlay] = useState(firstPlay)
	const [toggleModal, setToggleModal] = useState(false);
	const [playedIndex, setPlayedIndex] = useState(firstPlay)
	const [shouldPlay, setShouldPlay] = useState(true)
	const [dimensions, setDimensions] = useState(Dimensions.get('window'));
	const [time, setTime] = useState(45)
	const [mode, setMode] = useState("Training")
	const [isPaused, setIsPaused] = useState(false)
	const [onReset, setOnReset] = useState(false)

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
		const availableVideos = videoList.slice(0, playedIndex).concat(videoList.slice(playedIndex + 1));
		setTimeout(() => setVideoList(availableVideos), 0)
		const randomIndex = Math.floor(Math.random() * availableVideos.length);
		setTimeout(() => setPlayedIndex(randomIndex), 0)
		const videoToPlay = availableVideos[randomIndex];
		setTimeout(() => setVideoToPlay(videoToPlay ?? videoList[Math.floor(Math.random() * videoList.length)]), 0)
		setTimeout(() => setPlayedVideos(previous => [...previous, videoToPlay]), 0)
	}

	const handleOnfinish = async () => {
		if (count >= 5){
			if (unit < maxUnits) {
				await playRandomVideo()
				setTimeout(() => setUnit(previous => previous + 1), 0)
				setTimeout(() => setCount(1), 0)
				setTimeout(() => setMode("Rest"), 0)
				setTimeout(() => setTime(60), 0)
			} else {
				await handleComplete()
			}
			return
		}
		if (mode === "Training") {
			await playRandomVideo()
			setTimeout(() => setMode("Rest"), 0)
			setTimeout(() => setTime(15), 0)
		} else if (mode === "Rest") {
			setTimeout(() => setCount(previous => previous + 1), 0)
			setTimeout(() => setMode("Training"), 0)
			setTimeout(() => setTime(45), 0)
		}
	}

	const handleComplete = async () => {
		await playSuccessSound();
		setToggleModal(true);
		setIsPaused(true)
		setUnit(1)
		setCount(1)
	}

	const handleBackButtonClick = () => {
		ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
		navigation.goBack();
		setShouldPlay(false)
		setIsPaused(true)
		return true;
	}


	useEffect(() => {
		if (playedVideos.length === trainingVideos.length) {
			setPlayedVideos([])
			setVideoList([...trainingVideos])
		}
	},[playedVideos.length])

	useEffect(() => {
		const updateDimensions = () => {
			setDimensions(Dimensions.get('window'));
		};
		Dimensions.addEventListener('change', updateDimensions);
		playRandomVideo()
	}, []);

	useEffect(() => {
		BackHandler.addEventListener("hardwareBackPress", handleBackButtonClick);
		return () => {
			BackHandler.removeEventListener("hardwareBackPress", handleBackButtonClick);
		};
	}, []);

	useEffect(() => {
		setShouldPlay(true)
		setIsPaused(false)
	}, [route])
	return (
		<View style={styles.container}>
			<Video
				ref={video}
				style={{...styles.video, width: dimensions.width, height: dimensions.height}}
				source={videoToPlay}
				useNativeControls={false}
				resizeMode={ResizeMode.CONTAIN}
				isLooping
				shouldPlay={shouldPlay}
				// onLoad={()=>{video?.current?.presentFullscreenPlayer()}}
				// onFullscreenUpdate={async ({ fullscreenUpdate }) => {
				// 	if (fullscreenUpdate === VideoFullscreenUpdate.PLAYER_DID_DISMISS) {
				// 		await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
				// 		return
				// 	}
				// 	await ScreenOrientation.lockAsync(
				// 	  orientationIsLandscape ? ScreenOrientation.OrientationLock.PORTRAIT :
				// 	  ScreenOrientation.OrientationLock.LANDSCAPE_LEFT,
				//   );
				// }}
			/>
			<View
				className='absolute flex flex-col justify-center items-center top-7 left-32'
			>
				<View className='flex flex-row gap-5'>
					<Text className='text-lg'>
						Exercise :{' '}
						<Text style={{ fontFamily: 'DMBold' }}>{count}</Text>
					</Text>
					<Text className='text-lg'>
						Unit :{' '}
						<Text style={{ fontFamily: 'DMBold' }}>
							{unit}/{maxUnits}
						</Text>
					</Text>
				</View>
				 <CountdownTimerComponent
				 	durationInSeconds={time}
					isPaused={isPaused}
					onFinish={async (e) => {await handleOnfinish()}}
					onChange={async (e) => {
						if (e === 4) {
							await playSound()
						}
					}}
					onReset={onReset}
					setOnReset={setOnReset}
				/>

				<Text className='text-2xl font-semibold'>
					{mode}
				</Text>
				{/* <View className='flex flex-row items-center justify-center gap-1 z-10'>
					<TouchableOpacity
						onPress={() => {
							setUnit(1)
							setCount(1)
							setIsPaused(true)
							setMode("Training")
							setTime(45)
							setOnReset(true)
						}}
						style={styles.funcBtn}
					>
						<Text style={styles.text}>RESET</Text>
					</TouchableOpacity>
					<TouchableOpacity onPress={() => setIsPaused(!isPaused)}>
						<Icon
							name={isPaused ? 'play' : 'pause'}
							size={80}
							color={'#ff9a00'}
						/>
					</TouchableOpacity>
					<TouchableOpacity
						style={styles.funcBtn}
						onPress={() => {
							setMode("Rest")
							setTime(15)
						}}
					>
						<Text style={styles.text}>REST</Text>
					</TouchableOpacity>
				</View> */}
			</View>
			<Modal
				isVisible={toggleModal}
				onBackdropPress={() => setToggleModal(false)}
			>
				<TouchableOpacity onPress={() => setToggleModal(false)}>
					<View className='flex justify-center items-center'>
						<Image
							source={images.reward}
							resizeMode='contain'
							style={{
								width: '100%',
								height: undefined,
								aspectRatio: 1,
							}}
						/>
						<Text
							className='text-slate-300 text-2xl'
							style={{ fontFamily: 'DMBold' }}
						>
							Congratulation!
						</Text>
						<Text
							className='text-slate-300 text-lg'
							style={{ fontFamily: 'DMBold' }}
						>
							You have completed today's training.
						</Text>
					</View>
				</TouchableOpacity>
			</Modal>
		</View>
	);
};

export default TrainingScreen;
