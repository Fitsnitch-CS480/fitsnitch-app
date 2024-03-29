import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ServerFacade from '../services/ServerFacade';
import SnitchEvent from '../shared/models/SnitchEvent';
import User from '../shared/models/User';
import ProfileImage from './ProfileImage';
import dayjs from 'dayjs';
import SnitchService from '../services/SnitchService';
import PopupMenu from './SnitchOptionsDropdown';
import CheatMealService from '../services/CheatMealService';
import Colors from '../assets/constants/colors';
import T from '../assets/constants/text';
import { globalContext } from '../views/GlobalContext';
import { observer } from 'mobx-react-lite';

export type Props = {
	snitch: SnitchEvent
	user?: User
	onSwitch?: () => void
};

const SnitchEventCard = observer<Props>(({
	snitch, user, onSwitch
}) => {
	if (!user) return null;

	const [snitchOwner, setSnitchOwner] = useState<User | undefined>(undefined);
	const [error, setError] = useState<string>("");
	const [useCheats, setUseCheats] = useState<boolean>(false);

	const { userStore } = useContext(globalContext);
	const currentUser = userStore.currentUser;

	// The weird notation here is a dirty trick to get the profile to update properly when the current user changes
	const isCurrentUser = ({ user, currentUser }) && user.userId === currentUser.userId;

	async function getCheatMealData() {
		if (!currentUser) return;

		if (user.cheatmealSchedule) {
			let cheatsAllotted = Number(user.cheatmealSchedule.split("_")[1]);
			let cheatMeals = await new CheatMealService().getCheatMeals(user);
			let cheatsUsed;
			let remaining;
			if (cheatMeals) {
				cheatsUsed = cheatMeals.length;
				remaining = cheatsAllotted - cheatsUsed;
				if (remaining > 0) {
					setUseCheats(true);
				}
			}
		}
	}

	useEffect(() => {
		if (user) setSnitchOwner(user);
		else loadSnitchOwner();
		getCheatMealData();
	}, [])

	async function loadSnitchOwner() {
		let user = ServerFacade.getUserById(snitch.userId)
		if (!user) {
			setError("Could not load Snitch")
		}
	}

	const onPopupEvent = (event: any, index: Number) => {
		if (event !== 'itemSelected') return
		if (index === 0) {
			new SnitchService().switchToCheatmeal(snitch);
			if (onSwitch) onSwitch();
			// this.location.reload(false);
			// Alert.alert("This was turned into a cheatmeal!");
		}
	}

	function shareSnitch(snitch: SnitchEvent) {
		new SnitchService().shareSnitch(snitch, snitchOwner)
	}

	if (error) {
		return <Text>{error}</Text>
	}

	if (!snitchOwner) {
		return <Text>{T.loading}</Text>
	}

	return (
		<View style={styles.container}>
			<ProfileImage user={snitchOwner} size={40}></ProfileImage>
			<View style={{ marginLeft: 10, flexGrow: 1 }}>
				<Text style={[styles.text, styles.header]}>{snitchOwner.firstname} {snitchOwner.lastname}</Text>
				<View style={styles.details}>
					<View style={styles.detailRow}>
						<View style={styles.detailRowIcon}><Icon name="place" color={Colors.lightGrey} size={20}></Icon></View>
						<Text style={styles.text}>{snitch.restaurantData?.name}</Text>
					</View>
					<View style={styles.detailRow}>
						<View style={styles.detailRowIcon}><Icon name="event" color={Colors.lightGrey} size={18}></Icon></View>
						<Text style={styles.text}>{getRelativeTime(snitch.created_at)}</Text>
					</View>
				</View>
			</View>

			<View style={styles.menuWrapper}>
				<View style={styles.shareButton} onTouchEnd={() => shareSnitch(snitch)}><Icon name="share" size={20} color={Colors.lightGrey}></Icon></View>
				<View>
					{(isCurrentUser && useCheats) &&
						<PopupMenu actions={['Switch To Cheatmeal']} onPress={onPopupEvent} />
					}
				</View>
			</View>
		</View>
	);
});

function getRelativeTime(time: any) {
	if (dayjs().diff(time, 'd') >= 1) {
		return dayjs(time).format('MMM D, YYYY')
	}
	return dayjs(time).fromNow()
}


const styles = StyleSheet.create({
	container: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'flex-start',
		paddingVertical: 10,
		width: '100%',
		backgroundColor: Colors.background
	},
	text: {
		color: Colors.white,
	},
	header: {
		fontSize: 20
	},
	details: {
		display: 'flex',
		flexDirection: 'row',
		marginTop: 10,
		width: '100%',
	},
	detailRow: {
		flexGrow: 1,
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		fontSize: 15
	},
	detailRowIcon: {
		marginRight: 5
	},
	shareButton: {
	},
	menuWrapper: {
		display: 'flex',
		flexDirection: 'row',
		position: 'absolute',
		right: 0,
		top: 10,
	},
});

export default SnitchEventCard;
