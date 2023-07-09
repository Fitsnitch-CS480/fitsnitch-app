import React, { } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import SnitchEvent from '../shared/models/SnitchEvent';
import dayjs from 'dayjs';
import Colors from '../assets/constants/colors';
import MatIcon from './MatIcon';
import { observer } from 'mobx-react-lite';

export type Props = {
	lastSnitch?: SnitchEvent;
	size: number;
};

const SnitchFreeStreak = observer<Props>(({
	lastSnitch, size
}) => {

	let streak = (() => {
		if (!lastSnitch) return '--';
		else return dayjs().diff(dayjs(lastSnitch.created_at), 'd')
	})();

	const fireColor = streak === 0 || streak === '--' ? '#999' : 'red'

	const fireSize = size * .8;
	const numberSize = size * .8;

	const styles = StyleSheet.create({
		streakWrapper: {
			height: size,
			width: (fireSize) + size * String(streak).length * .6,
			position: 'relative',
			alignSelf: 'flex-start',
			textAlign: 'right',
		},
		streakFire: {
			position: "absolute",
			left: 0,
			top: '50%',
			transform: [{ translateY: -(fireSize * .5) }],
			zIndex: 5
		},
		streakQty: {
			position: "absolute",
			right: 0,
			top: '50%',
			transform: [{ translateY: -(numberSize * .65) }],
			fontSize: numberSize,
			lineHeight: size,
			color: Colors.white
		},
	});


	return (
		<View style={styles.streakWrapper}>
			<Text style={styles.streakQty}>{streak}</Text>
			<View style={styles.streakFire}><MatIcon name="whatshot" color={fireColor} size={fireSize} /></View>
		</View>
	);
});


export default SnitchFreeStreak;
