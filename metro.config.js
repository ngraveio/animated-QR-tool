// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require("expo/metro-config");
// https://www.npmjs.com/package/node-libs-react-native 
const nodePolyfill = require("node-libs-react-native");

console.log(nodePolyfill);

const path = require('path');

// Find the project and workspace directories
const projectRoot = __dirname;
// This can be replaced with `find-yarn-workspace-root`
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// 1. Watch all files within the monorepo
config.watchFolders = [workspaceRoot];
// 2. Let Metro know where to resolve packages and in what order
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];
// 3. Force Metro to resolve (sub)dependencies only from the `nodeModulesPaths`
config.resolver.disableHierarchicalLookup = true;

// 4. Enable symlinks support
config.resolver.unstable_enableSymlinks = true;
// config.resolver.unstable_enablePackageExports = true;

// 5. Add extra node modules
config.resolver.extraNodeModules = {
  ...nodePolyfill,
  // needed for @keystonehq/bc-ur-registry
  stream: require.resolve("readable-stream"),
  // needed for @keystonehq/ur-decoder
  crypto: require.resolve("react-native-crypto-js"),
};

console.log(config.resolver.extraNodeModules);

module.exports = config;
