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
import { SIZES } from '@/constants';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAuth } from '@/app/context/AuthContext';
import * as ScreenOrientation from "expo-screen-orientation";

const Welcome = ({ setTrainingLevel, navigation }) => {
	const { userInfo } = useAuth();

	const trainingType = ['Beginner', 'Advanced', 'Pro'];
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
					Let's us help your back
				</Text>
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

									navigation.navigate("Training", {
										trainingLevel: item,
										units: item === 'Beginner' ? 2 : item === 'Advanced' ? 3 : 4,
									})
									ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
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
			</View>
		</View>
	);
};

export default Welcome;
