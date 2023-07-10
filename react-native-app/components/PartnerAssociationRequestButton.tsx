import { observer } from 'mobx-react-lite';
import React, { useContext, useState } from 'react';
import { StyleSheet, Text, View, Button, Alert } from 'react-native';
import PartnerAssociationService from '../services/PartnerAssociationService';
import { globalContext } from '../views/GlobalContext';
import RelationshipStatus from '../shared/constants/RelationshipStatus';
import PartnerStatusResponse from '../shared/models/requests/PartnerStatusResponse';
import User from '../shared/models/User';
import MatButton from './MatButton';

type state = {
	processing: boolean,
	relationship?: PartnerStatusResponse
}

export type Props = {
	profileOwner: User;
	relationship?: PartnerStatusResponse
};
const PartnerAssociationRequestButton = observer(({ profileOwner, relationship }: Props) => {
	const [state, setState] = useState<state>({
		processing: false,
		relationship: relationship,
	});

	let flexibleState: state = { ...state };
	function updateState(props: Partial<state>) {
		flexibleState = { ...flexibleState, ...props };
		setState({ ...flexibleState })
	}

	const { userStore, partnerStore, partnerRequestsForUser } = useContext(globalContext);
	const currentUser = userStore.currentUser;

	if (!state.relationship) {
		loadRelationships(currentUser, profileOwner);
	}

	// This component still needs to use the relationship endpoint
	// because that's currently the only way to get the status of
	// a request sent by the current user. In other cases, the data
	// in the stores.
	async function loadRelationships(currentUser: User, profileOwner: User) {
		let partnership = await new PartnerAssociationService().getPartnerStatus(currentUser, profileOwner);

		updateState({
			relationship: partnership,
			processing: false,
		})
	}

	async function requestPartner(requester: User, requestee: User) {
		updateState({ processing: true })
		await new PartnerAssociationService().requestPartnerForUser(requester, requestee)
		updateState({ relationship: undefined })
	}

	async function cancelRequest(requester: User, requestee: User) {
		updateState({ processing: true })
		await new PartnerAssociationService().deleteRequest(requester, requestee)
		// Only bother fetching new requests when the currentuser
		// is the requestee because we don't currently have a store
		// for partner requests FROM the currentuser.
		if (requestee === currentUser) {
			partnerRequestsForUser.fetch()
		}
		updateState({ relationship: undefined })
	}

	async function approveUser(requester: User, requestee: User) {
		updateState({ processing: true })
		await new PartnerAssociationService().approveRequest(requester, requestee)
		partnerStore.fetch();
		partnerRequestsForUser.fetch()
		updateState({ relationship: undefined })
	}

	function promptEndRelationship(partner: User, user: User) {
		Alert.alert("Remove partner?", "Are you sure you want to end this partnership?", [
			{ text: 'Cancel', style: 'cancel' },
			{ text: 'Remove', style: 'destructive', onPress: () => endRelationship(partner, user) }
		]);
	}

	async function endRelationship(partner: User, user: User) {
		updateState({ processing: true })
		await new PartnerAssociationService().removePartnerFromUser(partner, user)
		partnerStore.fetch();
		updateState({ relationship: undefined })
	}

	return (
		<View style={styles.container}>
			{state.processing || !state.relationship ?
				<MatButton loading secondary />
				:
				state.relationship.status == RelationshipStatus.APPROVED ?
					<View>
						<MatButton title="End Partnership"
							icon="person-remove"
							secondary
							onPress={() => promptEndRelationship(profileOwner, currentUser)} />
					</View>
					:
					state.relationship.status == RelationshipStatus.PENDING && currentUser.userId == state.relationship.request?.requester ?
						<View>
							<MatButton title="Cancel Request"
								icon="delete"
								secondary
								onPress={() => cancelRequest(currentUser, profileOwner)} />
						</View>
						:
						state.relationship.status == RelationshipStatus.PENDING && currentUser.userId == state.relationship.request?.requestee ?
							<View style={styles.buttonContainerSideBySide}>
								<View style={styles.mainButton}>
									<MatButton title="Accept"
										icon="check"
										onPress={() => approveUser(profileOwner, currentUser)} />
								</View>
								<View style={[styles.secondButton]}>
									<MatButton icon="delete"
										color="#0000"
										textColor="#444"
										shadow={false}
										onPress={() => cancelRequest(profileOwner, currentUser)} />
								</View>
							</View>
							:
							state.relationship.status == RelationshipStatus.NONEXISTENT ?
								<View>
									<MatButton title="Partner Up"
										icon="person-add"
										onPress={() => requestPartner(currentUser, profileOwner)} />
								</View>
								:
								<></>}

		</View>
	);
});

const styles = StyleSheet.create({
	container: {
		minWidth: 150
	},
	buttonContainerSideBySide: {
		display: 'flex',
		flexDirection: 'row',
	},
	mainButton: {
		flexGrow: 1,
	},
	secondButton: {
		flexGrow: 1,
		maxWidth: 60
	}
})

export default PartnerAssociationRequestButton;