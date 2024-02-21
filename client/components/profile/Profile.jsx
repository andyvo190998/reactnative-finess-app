import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  FlatList,
  ImageBackground,
} from 'react-native';
import React from 'react';
import { Link, router, useNavigation } from 'expo-router';
import { useAuth } from '@/app/context/AuthContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon1 from 'react-native-vector-icons/Foundation';
import Icon2 from 'react-native-vector-icons/AntDesign';
import Icon3 from 'react-native-vector-icons/FontAwesome';
import { images } from '@/constants';
import {
  work2,
  work3,
  work4,
  work5,
  work6,
  work7,
} from '../../assets/works.js';

import img from '../../assets/images/works/work2.jpg';
//https://www.mockplus.com/blog/post/profile-page-design
const workOutCard = ({ item }) => {
  return (
    <View className=" flex-1 mr-5 w-40 h-32 ">
      <ImageBackground
        source={item.img}
        resizeMode="cover"
        imageStyle={{ borderRadius: 14 }}
        // className="h-full border rounded-lg"
      >
        <View className=" h-full flex justify-end pl-5 border-2 border-neutral-300 rounded-2xl pb-2">
          <Text className="color-slate-200 font-semibold">{item.desc}</Text>
        </View>
      </ImageBackground>
    </View>
  );
};

const PostCards = ({ item }) => {
  return (
    <View
      key={item.id}
      className=" w-full flex flex-col bg-white rounded-2xl p-2 mb-2"
    >
      <View className=" flex flex-row mb-1 items-center">
        <View className="border-2 border-slate-50 w-12 h-12 rounded-full flex justify-center items-center">
          <Image
            resizeMode="contain"
            source={images.profile}
            className="rounded-full"
            style={{
              width: '100%',
              height: undefined,
              aspectRatio: 1,
            }}
          />
        </View>
        <View className="flex-1 mx-3 ">
          <Text className="  text-lg" style={{ fontFamily: 'DMBold' }}>
            {item.user}
          </Text>
          <Text>Post: Feb 02, 2024</Text>
        </View>
        <TouchableOpacity className=" h-9 w-9 flex justify-center items-center">
          <Icon name="dots-vertical" size={20} />
        </TouchableOpacity>
      </View>
      <Text className="flex-1">{item.desc}</Text>
      {/* </View> */}
      <View className="flex-1 mb-1">
        <Image
          // resizeMode="con"
          source={item.img}
          style={{
            width: '100%',
            height: undefined,
            aspectRatio: 1,
            borderRadius: 14,
          }}
        />
      </View>
      <View className="w-full items-center">
        <View className="flex flex-row justify-between items-center w-full px-2 mb-1">
          <View className="flex flex-row gap-1">
            <Icon1 name="like" color={'blue'} size={20} />
            <Text>36</Text>
          </View>
          <Text>2 comments</Text>
        </View>
        <View className="border-t border-gray-200 w-full flex flex-row justify-between px-2 pt-1">
          <View className="flex flex-row gap-1">
            <Icon2 name="like2" size={20} />
            <Text>Like</Text>
          </View>
          <View className="flex flex-row gap-1">
            <Icon3 name="comment-o" size={20} />
            <Text>Comment</Text>
          </View>
          <View className="flex flex-row gap-1">
            <Icon name="share" size={20} />

            <Text>Share</Text>
          </View>
        </View>
      </View>
    </View>
  );
};
const Profile = () => {
  const navigation = useNavigation();
  const { authState, userInfo } = useAuth();
  function TimeConverter(UNIX_timestamp) {
    var a = new Date(UNIX_timestamp);
    var months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate() <= 9 ? `0${a.getDate()}` : a.getDate();
    var time = date + ' ' + month + ' ' + year;
    return time;
  }
  const date = new Date(userInfo.trialEndDate && userInfo.trialEndDate);

  const handleNavigateToSubscription = () => {
    navigation.navigate('Subscription');
  };

  const myWorkDummy = [
    {
      id: 1,
      desc: 'My work part 1',
      img: work7,
    },
    {
      id: 2,
      desc: 'My work part 2',
      img: work5,
    },
    {
      id: 3,
      desc: 'My work part 3',
      img: work4,
    },
    {
      id: 4,
      desc: 'My work part 4',
      img: work3,
    },
    {
      id: 5,
      desc: 'My work part 5',
      img: work6,
    },
    {
      id: 6,
      desc: 'My work part 6',
      img: work2,
    },
  ];

  const postDummy = [
    {
      id: 1,
      user: 'User A',
      desc: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Est nulla quidem quia iste voluptatum adipisci in nobis ad ducimus sed! ',
      img: work7,
    },
    {
      id: 2,
      user: 'User B',
      desc: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Est nulla quidem quia iste voluptatum adipisci in nobis ad ducimus sed!',
      img: work5,
    },
    {
      id: 3,
      user: 'User C',
      desc: 'Loremipsum dolor sit amet consectetur, adipisicing elit. Est nulla quidem quia iste voluptatum adipisci in nobis ad ducimus sed!',
      img: work4,
    },
    {
      id: 4,
      user: 'User D',
      desc: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Est nulla quidem quia iste voluptatum adipisci in nobis ad ducimus sed!',
      img: work3,
    },
    {
      id: 5,
      user: 'User E',
      desc: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Est nulla quidem quia iste voluptatum adipisci in nobis ad ducimus sed!',
      img: work6,
    },
    {
      id: 6,
      user: 'User F',
      desc: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Est nulla quidem quia iste voluptatum adipisci in nobis ad ducimus sed!',
      img: work2,
    },
  ];
  return (
    <ScrollView
      className=" bg-[#1c1c1d]"
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
    >
      <View className="flex justify-center items-center h-full">
        <View className=" w-full flex justify-center items-center flex-row pt-20 px-5 mb-5">
          <View className="border-2 border-slate-50 w-24 h-24 rounded-full flex justify-center items-center">
            <Image
              resizeMode="contain"
              source={images.profile}
              className="rounded-full"
              style={{
                width: '100%',
                height: undefined,
                aspectRatio: 1,
              }}
            />
          </View>
          <View className="flex-1 mx-3  flex justify-center">
            <Text
              className="text-slate-300  text-2xl mb-2"
              style={{ fontFamily: 'DMBold' }}
            >
              {userInfo.userName}
            </Text>
            {userInfo.membership === 'Free Trial' ? (
              <Text
                style={{ fontFamily: 'DMBold' }}
                className="text-green-600 font-medium"
              >
                Free Trial until: {TimeConverter(date)}
              </Text>
            ) : (
              <Text className="text-green-600 font-medium">
                {userInfo.membership} Membership
              </Text>
            )}
          </View>
          <TouchableOpacity className="bg-slate-50 rounded-lg h-9 w-9 flex justify-center items-center">
            <Icon name="lead-pencil" size={20} />
          </TouchableOpacity>
        </View>
        {userInfo.membership === 'Free Trial' && (
          <View className=" mb-10 flex items-center justify-center">
            <TouchableOpacity className="border bg-green-600 rounded-3xl flex flex-row justify-center items-center h-10 px-5">
              <Icon name="crown" size={20} color={'yellow'} />
              <TouchableOpacity onPress={handleNavigateToSubscription}>
                <Text
                  style={{ fontFamily: 'DMBold' }}
                  className="ml-3 text-slate-300 text-lg"
                  // href="/subscription"
                >
                  Upgrade
                </Text>
              </TouchableOpacity>
            </TouchableOpacity>
          </View>
        )}
        <View className=" w-full flex flex-row justify-around mb-5">
          <View className="flex items-center">
            <Text
              style={{ fontFamily: 'DMBold' }}
              className="text-slate-300 text-xl"
            >
              108
            </Text>
            <Text className="text-gray-600 font-medium text-lg">Posts</Text>
          </View>
          <View className="flex items-center">
            <Text
              style={{ fontFamily: 'DMBold' }}
              className="text-slate-300  text-xl"
            >
              3,471
            </Text>
            <Text className="text-gray-600 font-medium text-lg">Followers</Text>
          </View>
          <View className="flex items-center">
            <Text
              style={{ fontFamily: 'DMBold' }}
              className="text-slate-300  text-xl"
            >
              6,840
            </Text>
            <Text className="text-gray-600 font-medium text-lg">Following</Text>
          </View>
        </View>

        <View className="w-full px-5  flex flex-col mb-5">
          <Text
            className="color-slate-300 mb-3 pl-1"
            style={{ fontFamily: 'DMBold' }}
          >
            My Workouts
          </Text>
          <ScrollView
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
          >
            <FlatList
              data={myWorkDummy}
              keyExtractor={(item) => item.id.toString()}
              horizontal
              renderItem={workOutCard}
            />
          </ScrollView>
        </View>

        <View className="w-full px-5 flex flex-col">
          <Text
            className="color-slate-300 mb-3 pl-1"
            style={{ fontFamily: 'DMBold' }}
          >
            My Posts
          </Text>
          <ScrollView
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
          >
            {/* <FlatList
              data={myWorkDummy}
              keyExtractor={(item) => item.id.toString()}
              renderItem={workOutCard}
            /> */}
            {postDummy.map((item) => (
              <PostCards item={item} />
            ))}
          </ScrollView>
        </View>

        <View className="flex-1">
          <Text>Profile</Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text>Go back</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default Profile;
