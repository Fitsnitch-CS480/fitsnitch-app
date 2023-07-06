import React, { createContext, useEffect, useState } from "react";
import { Alert, Pressable, StyleSheet, Text } from 'react-native';
import NativeModuleService from "../services/NativeModuleService";
import Colors from "../assets/constants/colors";
import MatIcon from "../components/MatIcon";

type props = {}

const PermissionCheckBanner: React.FC<props> = ({}) => {
	const [permissionStatus, setPermissionStatus] = useState('');

	useEffect(() => {
		NativeModuleService.checkPermissions().then((status) => {
			setPermissionStatus(status);
		});
	}, []);

	const manualRecheck = async () => {
		let newStatus = await NativeModuleService.checkPermissions();
		if (newStatus === 'never_ask_again') {
			Alert.alert(
				"Insufficient Permissions",
				"Please open your settings and allow FitSnitch to access your location when the app is closed.",
				[
					{
						text: 'Ok',
					}
				],
			)
		}
		else if (newStatus !== 'granted') {
			Alert.alert(
				"Insufficient Permissions",
				"Please allow FitSnitch the permission it needs to operate.",
				[
					{
						text: 'Cancel'
					},
					{
						text: 'Ok',
						onPress: manualRecheck
					}
				],
			)
		}
	}

	if (permissionStatus === 'granted') return null;

	return <Pressable onPress={manualRecheck}>
		<Text style={styles.container}><MatIcon name="warning"  size={12} />  Insufficient permissions</Text>
	</Pressable>
}



const styles = StyleSheet.create({
	container: {
		color: 'white',
		backgroundColor: Colors.red,
		padding: 10,
		textAlign: 'center',
		display: 'flex',
		alignItems: 'center'
	}
});

export default PermissionCheckBanner;