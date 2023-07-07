import { NativeModules, NativeEventEmitter, Platform, AppState, PermissionsAndroid } from "react-native";
import SnitchTrigger from "../shared/models/SnitchTrigger";


interface NativeModule {
	stopBackgroundLocation(): void;
	startBackgroundLocation(): void;
	getActiveSnitch(cb: (json: string) => void): void;
	// setWillLeave(): void;
	setUsedCheat(): void;
	saveUserId(id: string): void;
}

class NativeModuleService {
	isInitialized: boolean = false;

	init() {
		if (this.isInitialized) return;
		this.getModule().startBackgroundLocation();
		this.isInitialized = true;
	}

	getModule(): NativeModule {
		return NativeModules.LocationManager;
	}

	getActiveSnitch(cb: (snitch: SnitchTrigger) => void): void {
		this.getModule().getActiveSnitch(lastSnitch => {
			cb(JSON.parse(lastSnitch));
		});
	}

	async checkPermissions() {
		try {
			if (Platform.OS === "ios") {

			}
			else if (Platform.OS === "android") {
				let granted = await PermissionsAndroid.request(
					PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
					{
						title: 'FitSnitch Permission',
						message:
							'FitSnitch needs to access your precise location in order to work.',
						buttonNegative: 'Cancel',
						buttonPositive: 'OK',
					}
				);
				
				granted = await PermissionsAndroid.request(
					PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
					{
						title: 'FitSnitch Permission',
						message:
							'Please allow FitSnitch to access your location in the background.',
						buttonNegative: 'Cancel',
						buttonPositive: 'OK',
					},
				);

				return granted;
			}

		} catch (err) {
			console.warn(err);
			return '';
		}
		return '';
	};
}

export default new NativeModuleService();