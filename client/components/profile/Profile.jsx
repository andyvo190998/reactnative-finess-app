import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import React from 'react';
import { Link, useNavigation } from 'expo-router';
import { useAuth } from '@/app/context/AuthContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { images } from '@/constants';
import { PAYPAL_CLIENT_ID, PAYPAL_SECRET_KEY, PAYPAL_API } from '@env';
import axios from 'axios';
//https://www.mockplus.com/blog/post/profile-page-design
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
  const date = new Date(userInfo.trialEndDate);

  const handleGetAccessToken = async () => {
    await axios
      .post(PAYPAL_API, 'grant_type=client_credentials', {
        // withCredentials: true,
        // auth: {
        //   username: PAYPAL_CLIENT_ID,
        //   password: PAYPAL_SECRET_KEY,
        // },
        headers: {
          'Content-Type': 'text/plain',
          Authorization: `Basic ${btoa(
            PAYPAL_CLIENT_ID + ':' + PAYPAL_SECRET_KEY
          )}`,
        },
      })
      .then((res) => console.log(res))
      .catch((error) => console.log(error));
  };
  return (
    <ScrollView className=" bg-[#1c1c1d]  ">
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
                Premium Membership
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
              <TouchableOpacity>
                <Link
                  style={{ fontFamily: 'DMBold' }}
                  className="ml-3 text-slate-300 text-lg"
                  href="/subscription"
                >
                  Upgrade
                </Link>
              </TouchableOpacity>
            </TouchableOpacity>
          </View>
        )}
        <View className=" w-full flex flex-row justify-around ">
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

        <View>
          <Text>My Workouts</Text>
        </View>

        <View>
          <Text>My Posts</Text>
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
