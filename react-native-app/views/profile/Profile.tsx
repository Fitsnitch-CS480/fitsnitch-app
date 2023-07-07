import React, { createContext, useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Button, Modal } from 'react-native';
import SnitchService from '../../services/SnitchService';
import CheatMealService from '../../services/CheatMealService';
import CheatMealEvent from '../../shared/models/CheatMealEvent';
import { UserCheatMealResponse } from '../../shared/models/requests/UserCheatMealRequest';
import { UserSnitchesResponse } from '../../shared/models/requests/UserSnitchesRequest';
import SnitchEvent from '../../shared/models/SnitchEvent';
import User from '../../shared/models/User';
import CheatMealEventCard from '../../components/MealEventCard';
import PaginatedList from '../../components/PaginatedList';
import PartnerAssociationRequestButton from '../../components/PartnerAssociationRequestButton';
import ProfileImage from '../../components/ProfileImage';
import SnitchEventCard from '../../components/SnitchEventCard';
import { observer } from 'mobx-react-lite';
import { ClientStore, PartnerStore, TrainerStore } from '../../stores/PeopleStores';
import ProfilePartners from './ProfilePartners';
import Card from '../../components/Card';
import ProfileTrainer from './ProfileTrainer';
import MatButton from '../../components/MatButton';
import CheatMealSchedule from './CheatMealSchedule';
import SnitchFreeStreak from '../../components/SnitchFreeStreak';
import CheatMealRemaining from './CheatMealRemaining';
import { globalContext } from '../appNavigator';
import Colors from '../../assets/constants/colors';
import Input from '../../components/Input';
import ServerFacade from '../../services/ServerFacade';
import { notifyMessage } from '../../utils/UiUtils';

const PAGE_SIZE = 5;

export var profileContext: React.Context<{
	refresh: () => void,
	profileOwner: User,
	isCurrentUser: boolean,
	isClientOfCurrentUser: boolean,
	isPartnerOfCurrentUser: boolean,
	profilePartnerStore: PartnerStore,
	profileClientStore: ClientStore,
	profileTrainerStore: TrainerStore
}>;


const Profile = observer(({ profileOwner }: any) => {
	const { currentUser, setCurrentUser, clientStore, partnerStore, trainerStore } = useContext(globalContext);

	const [refreshCnt, setRefreshCnt] = useState(0);
	const [showEditProfile, setShowEditProfile] = useState(false);
	const [editData, setEditData] = useState({ ...currentUser });

	// The weird notation here is a dirty trick to get the profile to update properly when the current user changes
	const isCurrentUser = ({ profileOwner, currentUser }) && profileOwner.userId === currentUser.userId;

	const profilePartnerStore = isCurrentUser ? partnerStore : new PartnerStore(profileOwner);
	const profileClientStore = isCurrentUser ? clientStore : new ClientStore(profileOwner);
	const profileTrainerStore = isCurrentUser ? trainerStore : new TrainerStore(profileOwner);

	const isClientOfCurrentUser = isCurrentUser ? false : clientStore.isClientOfUser(profileOwner.userId);
	const isPartnerOfCurrentUser = isCurrentUser ? false : partnerStore.isPartnerOfUser(profileOwner.userId);


	const EditProfileModal = () => {
		const [editData, setEditData] = useState({ ...currentUser });

		useEffect(() => {
			setEditData({ ...currentUser });
		}, [showEditProfile])

		const updateEditData = (props) => {
			setEditData({
				...editData,
				...props,
			})
		}

		const saveEditProfile = async () => {
			try {
				await ServerFacade.updateUser(editData);
				setCurrentUser(editData);
				setShowEditProfile(false);
			}
			catch (e) {
				notifyMessage("Error saving changes")
			}
		}

		return (
			<Modal
				animationType="fade"
				transparent={true}
				visible={showEditProfile}
				onRequestClose={() => setShowEditProfile(false)}
			>
				<View style={styles.modalWrapper}>
					<View style={styles.modalView}>
						<Text style={styles.modalTitle}>Edit Profile</Text>
						<Input
							label="Given Name"
							value={editData.firstname}
							onChange={(firstname) => updateEditData({ firstname })}
						/>
						<Input
							label="Family Name"
							value={editData.lastname}
							onChange={(lastname) => updateEditData({ lastname })}
						/>
						<Input
							label="Phone"
							value={editData.phone}
							onChange={(phone) => updateEditData({ phone })}
						/>
						<View>
							<MatButton
								title="Save"
								color={Colors.lightBlue}
								style={styles.modalButton}
								onPress={saveEditProfile}
							/>
							<MatButton
								title="Cancel"
								color={Colors.lightBackground}
								style={styles.modalButton}
								onPress={() => setShowEditProfile(false)}
							/>
						</View>
					</View>
				</View>
			</Modal>
		)

	};



	const pCtx = {
		refresh() {
			setRefreshCnt(refreshCnt + 1)
		},
		profileOwner,
		isCurrentUser,
		isClientOfCurrentUser,
		isPartnerOfCurrentUser,
		profilePartnerStore,
		profileClientStore,
		profileTrainerStore,
	}
	profileContext = createContext(pCtx)

	async function loadNextCheatMealPage(prevPage?: UserCheatMealResponse) {

		let page = prevPage || { records: [], pageNumber: -1, pageSize: PAGE_SIZE, total: 0 }
		let response = await new CheatMealService().getUserCheatMealFeedPage(profileOwner.userId, page)
		return response;
	}


	const SnitchFeed = () => {
		const [lastSnitch, setLastSnitch] = useState<SnitchEvent | undefined>(undefined);

		async function loadNextSnitchPage(prevPage?: UserSnitchesResponse) {
			let page = prevPage || { records: [], pageNumber: -1, pageSize: PAGE_SIZE, total: 0 }
			let response = await new SnitchService().getUserSnitchFeedPage([profileOwner.userId], page)
			if (!prevPage) {
				// The process of loading the feed also gets all feed user data, so let's save that
				// rather than askig for it again later
				setLastSnitch(response.records[0])
			}
			return response;
		}


		return (
			<Card title="Snitches" headerRight={<SnitchFreeStreak lastSnitch={lastSnitch} size={28} />}>
				<PaginatedList
					loadNextPage={loadNextSnitchPage}
					itemKey={(snitch: SnitchEvent) => snitch.created_at + snitch.userId}
					renderItem={snitch => (
						<View>
							<SnitchEventCard
								onSwitch={() => setRefreshCnt(refreshCnt + 1)}
								snitch={snitch}
								user={profileOwner}
							/>
						</View>
					)}
				/>
			</Card>
		)
	}

	return (
		<profileContext.Provider value={pCtx}>
			<View style={[styles.container]}>
				<ScrollView>
					<View style={[styles.header]}>
						<ProfileImage user={profileOwner} size={75}></ProfileImage>
						<View style={styles.headerDetails}>
							<Text numberOfLines={1} style={styles.profileName}>{profileOwner.firstname || "Test"} {profileOwner.lastname || ""}</Text>
							<View style={{ flexDirection: 'row' }}>
								{isCurrentUser ? (
									<MatButton
										color={Colors.lightBackground}
										textColor={Colors.white}
										title="Edit Profile"
										onPress={() => setShowEditProfile(true)}
									/>
								) : (
									<PartnerAssociationRequestButton profileOwner={profileOwner} />
								)}
							</View>
						</View>
					</View>

					<View style={{}}>

						<View style={styles.profileDetails}>
							<ProfileTrainer />
							<ProfilePartners />
						</View>

						{currentUser === profileOwner || isClientOfCurrentUser || isPartnerOfCurrentUser ?

							<Card title="Cheat Meals">
								{(isClientOfCurrentUser || isCurrentUser) &&
									<View style={{ marginBottom: 10 }}>
										<CheatMealRemaining />
										<CheatMealSchedule profileOwner={profileOwner} canEdit={isClientOfCurrentUser || !trainerStore.data} />
									</View>
								}
								<PaginatedList
									loadNextPage={loadNextCheatMealPage}
									itemKey={(meal: CheatMealEvent) => meal.created_at + meal.userId}
									renderItem={(meal => (
										<View>
											<CheatMealEventCard meal={meal} user={profileOwner}></CheatMealEventCard>
										</View>
									))}
								/>
							</Card>
							: null}

						{currentUser === profileOwner || isClientOfCurrentUser || isPartnerOfCurrentUser ?
							<SnitchFeed />

							: <></>}

					</View>
				</ScrollView>
				<EditProfileModal />
			</View>
		</profileContext.Provider>
	);
});


const EMPTY_COLOR = "grey";
const PROGRESS_COLOR = "green";
const SIZE = 45;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.background
	},
	header: {
		flex: 1,
		maxHeight: 150,
		position: 'relative',
		flexDirection: 'row',
		paddingVertical: 20,
		paddingHorizontal: 15,
		textAlign: 'left',
		alignItems: 'center',
	},
	headerDetails: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'space-evenly',
		padding: 3,
		marginLeft: 15
	},
	profileName: {
		flex: 2,
		fontSize: 28,
		lineHeight: 28,
		fontWeight: 'bold',
		color: Colors.white
	},
	profileDetails: {
		padding: 10,
		marginVertical: 5
	},
	progressCircle: {
		flexDirection: 'row',
		borderColor: EMPTY_COLOR,
		justifyContent: 'center',
		alignItems: 'center',
		width: SIZE,
		height: SIZE,
		borderRadius: SIZE / 2,
		borderWidth: 7,
	},
	indicator: {
		width: SIZE,
		height: SIZE,
		borderRadius: SIZE / 2,
		borderWidth: 7,
		position: 'absolute',
		borderLeftColor: PROGRESS_COLOR,
		borderTopColor: PROGRESS_COLOR,
		borderRightColor: 'transparent',
		borderBottomColor: 'transparent',
	},
	modalWrapper: {
		position: 'absolute',
		width: '100%',
		height: '100%',
		backgroundColor: '#00000088',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		padding: 30
	},
	modalView: {
		backgroundColor: Colors.charcoal,
		padding: 20,
		borderRadius: 10,
		width: '100%',
		maxWidth: 400
	},
	modalTitle: {
		color: 'white',
		fontSize: 18
	},
	modalButton: {
		marginTop: 10
	}
});

export default Profile;

