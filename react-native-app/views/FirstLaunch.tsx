import React, { useContext, useEffect } from "react";
import { globalContext } from "./GlobalContext";
import { observer } from "mobx-react-lite";
import { StyleSheet, Text, View } from "react-native";
import MatButton from "../components/MatButton";
import Colors from "../assets/constants/colors";
import NativeModuleService from "../services/NativeModuleService";
import LocationPermission from "./LocationPermission";

const FirstLaunch = observer(() => {
	const {userStore} = useContext(globalContext);

	const setDidFirstLaunch = async () => {
		userStore.updateUserStorage({didFirstLaunch: true})
	}

	return (
		<LocationPermission
			onAllow={setDidFirstLaunch}
			onCancel={setDidFirstLaunch}
		/>
	);
})

export default FirstLaunch;
