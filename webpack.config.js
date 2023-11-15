const createExpoWebpackConfigAsync = require('@expo/webpack-config');
const nodePolyfill = require("node-libs-react-native");

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);
  // Customize the config before returning it.
  config.resolve.fallback = { 
    ...nodePolyfill,
    stream: require.resolve("readable-stream"),
    crypto: require.resolve("react-native-crypto-js")
  };
  return config;
};
