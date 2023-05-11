// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require("expo/metro-config");

config = getDefaultConfig(__dirname);

config.resolver.extraNodeModules = {
  // needed for @keystonehq/bc-ur-registry
  stream: require.resolve("readable-stream"),
  // needed for @keystonehq/ur-decoder
  crypto: require.resolve("react-native-crypto-js"),
};
module.exports = config;
