import React from "react";
import { TouchableOpacity, Image } from "react-native";

import styles from "./screenheader.style";
import { Text } from "react-native-paper";
import Icon from "react-native-vector-icons/FontAwesome";

const ScreenHeaderBtn = ({ iconUrl, dimension, handlePress, isAvatar }) => {
	return (
		<TouchableOpacity style={styles.btnContainer} onPress={handlePress}>
			{isAvatar ? (
				<Icon name="user-circle" size={30} />
			) : (
				<Image source={iconUrl} resizeMode="cover" style={styles.btnImg(dimension)} />
			)}
		</TouchableOpacity>
	);
};

export default ScreenHeaderBtn;
