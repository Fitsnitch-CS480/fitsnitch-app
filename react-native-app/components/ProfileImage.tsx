import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Colors from '../assets/constants/colors';
import User from '../shared/models/User';

export type Props = {
	user: User,
	size: number,
};
const ProfileImage: React.FC<Props> = ({
	user, size
}) => {
	const nav = useNavigation();

	const initials = (user.firstname && user.lastname) ? `${user.firstname[0] + user.lastname[0]}` : undefined;

	return (
		<View style={[styles.imageWrapper, { width: size, height: size }]}
			onTouchEnd={() => nav.navigate('OtherUserProfile', { profileOwner: user })}
		>
			{user.image ?
				<Image style={{width: size + 2, height: size + 2}} source={{ uri: user.image }} />
				: initials ?
				<Text style={[styles.initials, { fontSize: size * .4 }]}>{initials}</Text>
				:
				<Icon name="person" size={size * .75} color="white"></Icon>
			}
		</View>
	);
};

const styles = StyleSheet.create({
	imageWrapper: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 1000,
		overflow: 'hidden',
		backgroundColor: Colors.white,
	},
	initials: {
		fontWeight: 'bold',
		textTransform: 'uppercase',
		color: Colors.charcoal
	},
})

export default ProfileImage;