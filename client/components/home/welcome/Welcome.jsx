import { createDrawerNavigator } from '@react-navigation/drawer';
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';

import styles from './welcome.style';
import { useRouter } from 'expo-router';
import { SIZES, icons } from '@/constants';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const Drawer = createDrawerNavigator();
const Welcome = () => {
  const jobTypes = ['Easy', 'Medium', 'Hard', 'Extreme', 'Expert'];
  const router = useRouter();
  const [activeJobType, setActiveJobType] = useState('Cardio');

  const selectIcon = (icon) => {
    if (icon === 'Easy') {
      return 'emoticon-excited-outline';
    } else if (icon === 'Medium') {
      return 'emoticon-wink-outline';
    } else if (icon === 'Hard') {
      return 'emoticon-cool-outline';
    } else if (icon === 'Extreme') {
      return 'emoticon-angry-outline';
    } else {
      return 'emoticon-devil-outline';
    }
  };
  return (
    <View>
      <View style={styles.container}>
        <Text style={styles.userName}>Hello Andy</Text>
        <Text style={styles.welcomeMessage}>Find your perfect course</Text>
      </View>
      <View style={styles.searchContainer}>
        <View style={styles.searchWrapper}>
          <TextInput
            value=""
            onChange={(e) => console.log(e.target)}
            placeholder="What are you looking for!"
            style={styles.searchInput}
          />
        </View>

        <TouchableOpacity
          style={styles.searchBtn}
          onPress={() => console.log('search')}
        >
          <Image
            source={icons.search}
            resizeMode="contain"
            style={styles.searchBtnImage}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.tabsContainer}>
        <FlatList
          data={jobTypes}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  setActiveJobType(item);
                  router.push(`/user/${item.toLowerCase()}`);
                }}
                style={styles.tab(activeJobType, item)}
              >
                <Icon name={selectIcon(item)} size={30} color={'#ff9a00'} />
                <Text
                  className="ml-1"
                  style={styles.tabText(activeJobType, item)}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            );
          }}
          keyExtractor={(item) => item}
          contentContainerStyle={{ columnGap: SIZES.small }}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </View>
    </View>
  );
};

export default Welcome;
