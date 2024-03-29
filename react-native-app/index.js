/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

// Setup Dayjs plugins
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

AppRegistry.registerComponent(appName, () => App);
AppRegistry.registerComponent("SnitchActivity", () => App);
