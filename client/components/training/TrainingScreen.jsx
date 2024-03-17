import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	Image,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { Audio, Video } from 'expo-av';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer';
const soundSource = require('../../assets/sounds/count-down-tick.mp3');
const successSource = require('../../assets/sounds/success.mp3');
import Modal from 'react-native-modal';
import { images } from '@/constants';
import { trainingVideos } from '@/assets/works';

const styles = StyleSheet.create({
	container: {
		flex: 1,
		height: '100%',
		alignItems: 'flex-start',
		justifyContent: 'flex-start',
	},
	funcBtn: {
		borderWidth: 1,
		borderRadius: 5,
		paddingHorizontal: 30,
		paddingVertical: 10,
	},
	text: {
		fontWeight: '600',
	},
	video: {
		flex: 0.5,
		alignSelf: 'stretch',
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
	const trainingLevel = route.params.trainingLevel;
	const maxUnits = route.params.units;
	const exerciseLong = 45
	const exerciseBreak = 15;
	const exerciseUnitBreak = 60;
	const [count, setCount] = useState(1);
	const [unit, setUnit] = useState(1);
	const [isTraining, setIsTraining] = useState(true);
	const video = React.useRef(null);
	const [isPlaying, setIsPlaying] = useState(false);
	const [key, setKey] = useState(0);
	const [videoList, setVideoList] = useState([...trainingVideos])
	const [playedVideos, setPlayedVideos] = useState([])
	const firstPlay = trainingVideos[Math.floor(Math.random() * trainingVideos.length)]
	const [videoToPlay, setVideoToPlay] = useState(firstPlay)
	const [toggleModal, setToggleModal] = useState(false);
	const [playedIndex, setPlayedIndex] = useState(firstPlay)
	const [sound, setSound] = useState();

	const turnToMinute = (second) => {
		let hours = Math.floor(second / 3600);
		let minutes = Math.floor((second % 3600) / 60);
		let remainingSeconds = second % 60;

		hours = hours < 10 ? '0' + hours : hours;
		minutes = minutes < 10 ? '0' + minutes : minutes;
		remainingSeconds =
			remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds;

		return hours + ':' + minutes + ':' + remainingSeconds;
	};

	const playSuccessSound = async () => {
		const { sound } = await Audio.Sound.createAsync(successSource);
		await sound.playAsync();
	};

	const playSound = async () => {
		setIsPlaying(false);
		const { sound } = await Audio.Sound.createAsync(soundSource);
		setSound(sound);

		await sound.playAsync();
		setTimeout(() => {
			if (unit <= maxUnits) {
				setIsPlaying(true);
			}
		}, 3000);
	};

	const playRandomVideo = () => {
		const availableVideos = videoList.slice(0, playedIndex).concat(videoList.slice(playedIndex + 1));
		setVideoList(availableVideos)
		const randomIndex = Math.floor(Math.random() * availableVideos.length);
		setPlayedIndex(randomIndex)
		const videoToPlay = availableVideos[randomIndex];
	  	setVideoToPlay(videoToPlay)
		setPlayedVideos(previous => [...previous, videoToPlay])
	}

	useEffect(() => {
		if (playedVideos.length === trainingVideos.length) {
			console.log('here')
			setPlayedVideos([])
			setVideoList([...trainingVideos])
		  }
	},[playedVideos.length])

	useEffect(() => {
		setKey((prevKey) => prevKey + 1);
		playSound();
		playRandomVideo()
	}, []);

	return (
		<View style={styles.container}>
			<Video
				ref={video}
				style={styles.video}
				source={videoToPlay}
				useNativeControls
				resizeMode='cover'
				// resizeMode={ResizeMode.CONTAIN}
				isLooping
				shouldPlay
				// onPlaybackStatusUpdate={setStatus}
			/>
			<View
				style={styles.control}
				className='h-ful'
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
				<CountdownCircleTimer
					key={key}
					isPlaying={isPlaying}
					duration={
						isTraining === null
							? exerciseUnitBreak
							: isTraining === true
							? exerciseLong
							: exerciseBreak
					}
					colors={
						isTraining
							? ['#004777', '#F7B801', '#A30000', '#A30000']
							: ['#A30000', '#F7B801', '#004777', '#A30000']
					}
					colorsTime={[
						exerciseLong,
						exerciseLong / 2,
						exerciseLong / 2,
						0,
					]}
					size={250}
					strokeWidth={20}
					onUpdate={(remainingTime) => {
						if (remainingTime === 0) {
							if (count < 5 && count !== 0) {
								playSound();
								if (isTraining === false) {
									setCount((previous) => previous + 1);
								} else {
									playRandomVideo()
								}
								setIsTraining(!isTraining);
								setKey((prevKey) => prevKey + 1);
							} else if (count === 0) {
								playSound();
								setCount((previous) => previous + 1);
								// setIsPlaying(true);
								setIsTraining(true);
								setKey((prevKey) => prevKey + 1);
							} else {
								playRandomVideo()
								if (unit < maxUnits) {
									playSound();
									setUnit((previous) => previous + 1);
									setIsTraining(null);
									setCount(0);
									setKey((prevKey) => prevKey + 1);
								} else {
									playSuccessSound();
									setIsPlaying(false);
									setToggleModal(true);

									setIsTraining(true);
									// setExerciseLong(45);
									setUnit(1);
									setCount(1);
									setKey((prevKey) => prevKey + 1);

									return;
								}
							}
						}
					}}
					onComplete={() => {
						return {
							shouldRepeat: isPlaying && unit < maxUnits,
							delay: 0,
						};
					}}
				>
					{({ remainingTime }) => (
						<Text className='text-4xl font-semibold'>
							{turnToMinute(remainingTime)}
						</Text>
					)}
				</CountdownCircleTimer>
				<Text className='text-2xl font-semibold'>
					{isTraining ? 'TRAINING TIME' : 'RESTING TIME'}
				</Text>
				<View className='flex flex-row items-center justify-center gap-2 w-full'>
					<TouchableOpacity
						onPress={() => {
							setIsTraining(true);
							// setExerciseLong(45);
							setUnit(1);
							setCount(1);
							setKey((prevKey) => prevKey + 1);
						}}
						style={styles.funcBtn}
					>
						<Text style={styles.text}>RESET</Text>
					</TouchableOpacity>
					<TouchableOpacity onPress={() => setIsPlaying(!isPlaying)}>
						<Icon
							name={isPlaying ? 'pause' : 'play'}
							size={80}
							color={'#ff9a00'}
						/>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={() => {
							if (!isTraining) {
								setKey((prevKey) => prevKey + 1);
								return;
							}
							if (count < 5) {
								setCount((previous) => previous + 1);
							} else {
								setCount(0);
								setUnit((previous) => previous + 1);
							}
							setIsTraining(false);

							setKey((prevKey) => prevKey + 1);
						}}
						style={styles.funcBtn}
					>
						<Text style={styles.text}>REST</Text>
					</TouchableOpacity>
				</View>
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
