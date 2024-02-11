import { useNavigation, useRouter } from 'expo-router';
import React from 'react';
import {
  View,
  Text,
  ImageBackground,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const TrainingList = ({ navigation }) => {
  const dummyData = [
    {
      uri: 'https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      time: '10 min',
      id: '10',
    },
    {
      uri: 'https://images.pexels.com/photos/949126/pexels-photo-949126.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      time: '20 min',
      id: '20',
    },
    {
      uri: 'https://images.pexels.com/photos/136410/pexels-photo-136410.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      time: '30 min',
      id: '30',
    },
  ];

  // const navigation = useNavigation();
  return (
    <View className="mt-2 flex flex-col">
      <FlatList
        data={dummyData}
        renderItem={({ item }) => {
          return (
            <View className="mt-2 rounded-sm">
              <TouchableOpacity
                // onPress={() => router.push(`/training/${item.id}`)}
                onPress={() => navigation.navigate('Training', { id: item.id })}
              >
                <ImageBackground
                  imageStyle={{ borderRadius: 5 }}
                  className="w-full h-52 flex flex-row rounded"
                  source={{
                    uri: item.uri,
                  }}
                  resizeMode="cover"
                >
                  <View className="flex flex-row mt-5 ml-5">
                    <Icon name="timer-outline" size={30} color={'white'} />
                    <Text className="text-white text-lg font-bold">
                      {item.time}
                    </Text>
                  </View>
                </ImageBackground>
              </TouchableOpacity>
            </View>
          );
        }}
        keyExtractor={(item) => item.uri}
        // contentContainerStyle={{ columnGap: SIZES.small }}
        // horizontal
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

export default TrainingList;
