/** To make coin packages work */
import 'node-libs-react-native/globals';

// Import the crypto getRandomValues shim (**BEFORE** the shims)
import "react-native-get-random-values"

// Import the the ethers shims (**BEFORE** ethers)
import "@ethersproject/shims"

/** End of: To make coin packages work */

import { registerRootComponent } from 'expo';

import App from './App';

const a = Buffer.from("hello world");
console.log(a.toString('utf-8'));

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
