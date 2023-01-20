import { NativeModules } from "react-native";
import SnitchTrigger from "../shared/models/SnitchTrigger";


interface NativeModule {
    stopBackgroundLocation(): void;
    startBackgroundLocation(): void;
    getActiveSnitch(cb: (json: string)=>void): void;
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

    getActiveSnitch(cb: (snitch: SnitchTrigger)=>void): void {
        this.getModule().getActiveSnitch(lastSnitch => {
            cb(JSON.parse(lastSnitch));
        });
    }
}

export default new NativeModuleService();