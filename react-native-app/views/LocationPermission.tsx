import React, { useContext, useEffect } from "react";
import { globalContext } from "./GlobalContext";
import { observer } from "mobx-react-lite";
import { Modal, StyleSheet, Text, View } from "react-native";
import MatButton from "../components/MatButton";
import Colors from "../assets/constants/colors";
import NativeModuleService from "../services/NativeModuleService";

const LocationPermission = observer<any>(({onCancel, onAllow}) => {
	const {userStore} = useContext(globalContext);

	const acceptAndContinue = async () => {
		await NativeModuleService.checkPermissions();
		userStore.updateUserStorage({acceptedLocation: true})
		onAllow?.call();
	}

	return (
		<Modal
			animationType="slide"
			visible={true}
		>
			<View style={style.container}>
				<Text style={style.heading}>Welcome to FitSnitch!</Text>
				<Text style={style.p}>
					FitSnitch accesses your current location to enable fast-food restaurant alerts even when the app is closed.
				</Text>
				<Text style={style.p}>
					Please grant background location access.
				</Text>
				<View style={style.gap} />
				<View style={style.footer}>
					<MatButton
						title="Maybe later"
						color="transparent"
						textColor={Colors.lightBlue}
						onPress={onCancel}
						shadow={false}
						size={16}
					/>
					<MatButton
						title="Allow"
						color={Colors.lightBlue}
						onPress={acceptAndContinue}
						style={{ paddingHorizontal: 20 }}
						size={16}
					/>
				</View>
			</View>
		</Modal>
	);
})

const style = StyleSheet.create({
	container: {
		padding: 40,
		display: 'flex',
		height: '100%',
		backgroundColor: Colors.background,
	},
	heading: {
		fontSize: 28,
		marginBottom: 50,
		fontWeight: 'bold',
		color: 'white',
	},
	p: {
		color: 'white',
		marginVertical: 10,
		fontSize: 16
	},
	gap: {
		flexGrow: 1
	},
	footer: {
		display: 'flex',
		justifyContent: 'space-between',
		flexDirection: 'row'
	}
});

export default LocationPermission;
