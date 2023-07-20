import React, { createContext, useContext, useEffect, useState } from "react";
import { Alert, Pressable, StyleSheet, Text } from 'react-native';
import NativeModuleService from "../services/NativeModuleService";
import Colors from "../assets/constants/colors";
import MatIcon from "../components/MatIcon";
import { observer } from "mobx-react-lite";
import { globalContext } from "./GlobalContext";
import LocationPermission from "./LocationPermission";

const PermissionCheckBanner= observer(() => {
	const { userStore } = useContext(globalContext);
	const [showPermissions, setShowPermissions] = useState(false);


	if (showPermissions) {
		return <LocationPermission
			onAllow={()=>setShowPermissions(false)}
			onCancel={()=>setShowPermissions(false)}
		/>
	}

	if (!userStore.userStorage?.acceptedLocation) {
		return <Pressable onPress={()=>setShowPermissions(true)}>
			<Text style={styles.container}><MatIcon name="warning"  size={12} />  Please grant location permissions</Text>
		</Pressable>
	}

	return null;
})



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