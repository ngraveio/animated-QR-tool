const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);
  // Customize the config before returning it.
  config.resolve.fallback = { stream: require.resolve("readable-stream"), crypto: require.resolve("react-native-crypto-js") };
  return config;
};
