import React, { useState, useEffect } from 'react';
import { Text, View } from 'react-native';

const CountdownTimerComponent = ({
  durationInSeconds,
  isPaused = false,
  onFinish,
  onChange,
  onReset,
  setOnReset
}) => {
  const [secondsRemaining, setSecondsRemaining] = useState(durationInSeconds);
  const [minutes, setMinutes] = useState(Math.floor(durationInSeconds / 60));
  const [seconds, setSeconds] = useState(durationInSeconds % 60);

  const minuteFunc = () => {
    return `${minutes < 10 ? '0' : ''}${minutes}`
  }

  const secondFunc = () => {
    return `${seconds < 10 ? '0' : ''}${seconds}`
  }

  useEffect(() => {
    setSecondsRemaining(durationInSeconds);
    setMinutes(Math.floor(durationInSeconds / 60));
    setSeconds(durationInSeconds % 60);
  }, [durationInSeconds]);

  useEffect(() => {
    let interval;
    if (!isPaused) {
      interval = setInterval(() => {
        setSecondsRemaining(prevSeconds => {
          onChange(prevSeconds)
          if (prevSeconds === 0) {
            clearInterval(interval);
            onFinish(prevSeconds)
            setSecondsRemaining(durationInSeconds)
            return 0;
          } else {
            setMinutes(Math.floor((prevSeconds - 1) / 60));
            setSeconds((prevSeconds - 1) % 60);
            return prevSeconds - 1;
          }
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isPaused, durationInSeconds, secondsRemaining]);

  useEffect(() => {
    console.log(onReset, secondsRemaining)
    if (onReset === true) {
      setSecondsRemaining(durationInSeconds);
      setMinutes(Math.floor(durationInSeconds / 60));
      setSeconds(durationInSeconds % 60);
      setOnReset(false)
    }
  }, [onReset])

  return (
    <View className="flex flex-row gap-1">
      <View className="bg-white h-14 w-14 flex justify-center items-center rounded-lg">
        <Text className="font-bold text-2xl text-[#1CC625]">{minuteFunc()}</Text>
      </View>
      <View className="bg-white h-14 w-14 flex justify-center items-center rounded-lg">
        <Text className="font-bold text-2xl text-[#1CC625]">{secondFunc()}</Text>
      </View>
    </View>
  );
};

export default CountdownTimerComponent;
