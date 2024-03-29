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
import { useAuth } from '@/app/context/AuthContext';
import { jwtDecode } from 'jwt-decode';

const Drawer = createDrawerNavigator();
const Welcome = ({ setTrainingLevel }) => {
	const { authState, userInfo } = useAuth();

	const trainingType = ['Beginner', 'Advanced', 'Pro'];
	const router = useRouter();
	const [activeJobType, setActiveJobType] = useState('Beginner');

	const icons = {
		Beginner: 'emoticon-excited-outline',
		Advanced: 'emoticon-wink-outline',
		Pro: 'emoticon-devil-outline',
	};
	return (
		<View>
			<View style={styles.container}>
				<Text style={styles.userName}>Hello {userInfo.userName}</Text>
				<Text style={styles.welcomeMessage}>
					Find your perfect course
				</Text>
			</View>
			<View style={styles.searchContainer}>
				<View style={styles.searchWrapper}>
					<TextInput
						value=''
						placeholder='What are you looking for!'
						style={styles.searchInput}
					/>
				</View>

				<TouchableOpacity style={styles.searchBtn}>
					<Image
						source={icons.search}
						resizeMode='contain'
						style={styles.searchBtnImage}
					/>
				</TouchableOpacity>
			</View>

			<View style={styles.tabsContainer}>
				<FlatList
					data={trainingType}
					renderItem={({ item }) => {
						return (
							<TouchableOpacity
								onPress={() => {
									setActiveJobType(item);
									setTrainingLevel(item);
								}}
								style={styles.tab(activeJobType, item)}
							>
								<Icon
									name={icons[item]}
									size={30}
									color={'#ff9a00'}
								/>
								<Text
									className='ml-1'
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
				{/* {
          trainingType.map(item => (
            <TouchableOpacity
            key={item}
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
          ))
        } */}
			</View>
		</View>
	);
};

export default Welcome;
