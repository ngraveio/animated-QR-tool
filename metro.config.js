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
  path.resolve(workspaceRoot, 'node_modules'),
  path.resolve(projectRoot, 'node_modules'),
];

// Whether to automatically resolve references to first-party packages (e.g. workspaces) in your project. Any package.json file with a valid name property within projectRoot or watchFolders (but outside of node_modules) counts as a package for this purpose. Defaults to false.
config.resolver.enableGlobalPackages = true;

// If we enable this, then dependencies cannot import their own dependencies from their path eg: ethereum-cryptography v2.0.0 and v0.0.2
// root/node_modules/@ethereumjs/util/node_modules/ethereum-cryptography/index
// root/node_modules/ethereum-cryptography/index
// 3. Force Metro to resolve (sub)dependencies only from the `nodeModulesPaths`
config.resolver.disableHierarchicalLookup = false; // true

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
  // needed for ?
  fs: require.resolve("memfs"),
};

console.log(config.resolver);

module.exports = config;
