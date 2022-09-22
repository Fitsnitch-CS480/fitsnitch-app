/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './MainActivity';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);
AppRegistry.registerComponent("SnitchActivity", () => App);
