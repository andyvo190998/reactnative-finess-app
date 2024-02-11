import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation } from 'expo-router';
import { Video } from 'expo-av';
// import Video from 'react-native-video';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer';

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
    // height: '150%',
    // width: 200,
    alignSelf: 'stretch',
  },
  control: {
    flex: 1.5,
    // height: '150%',
    // width: 200,
    alignSelf: 'stretch',
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
  },
});
const TrainingScreen = ({ navigation, route }) => {
  const [trainingDuration, setTrainingDuration] = useState(
    route.params.id * 60
  );
  const [isTraining, setIsTraining] = useState(true);
  const video = React.useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [key, setKey] = useState(0);
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
  console.log(key);
  useEffect(() => {
    console.log('render');
  }, [trainingDuration]);
  return (
    <View style={styles.container}>
      <Video
        ref={video}
        style={styles.video}
        source={require('../../assets/videos/video1.mp4')}
        useNativeControls
        resizeMode="cover"
        isLooping
        shouldPlay
        // onPlaybackStatusUpdate={setStatus}
      />
      <View style={styles.control} className="h-full">
        <CountdownCircleTimer
          key={key}
          isPlaying={isPlaying}
          duration={trainingDuration}
          colors={
            isTraining
              ? ['#004777', '#F7B801', '#A30000', '#A30000']
              : ['#A30000', '#F7B801', '#004777', '#A30000']
          }
          colorsTime={[
            trainingDuration,
            trainingDuration / 2,
            trainingDuration / 2,
            0,
          ]}
          size={250}
          strokeWidth={20}
          onComplete={() => {
            if (!isTraining) {
              console.log(route.params.id * 60);
              setTrainingDuration(route.params.id * 60 + 30);
            }
            setIsTraining((previous) => !previous);
            return { shouldRepeat: true, delay: 2 }; // repeat animation in 2 seconds
          }}
        >
          {({ remainingTime }) => (
            <Text className="text-4xl font-semibold">
              {turnToMinute(remainingTime)}
            </Text>
          )}
        </CountdownCircleTimer>
        <Text className="text-2xl font-semibold">
          {isTraining ? 'TRAINING TIME' : 'RESTING TIME'}
        </Text>
        <View className="flex flex-row items-center justify-center gap-2 w-full">
          <TouchableOpacity
            onPress={() => setKey((prevKey) => prevKey + 1)}
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
              setIsTraining(false);
              setKey((prevKey) => prevKey + 1);
              setTrainingDuration(30);
            }}
            style={styles.funcBtn}
          >
            <Text style={styles.text}>REST</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default TrainingScreen;
