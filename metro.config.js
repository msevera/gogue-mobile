const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');
const {
  wrapWithReanimatedMetroConfig,
} = require('react-native-reanimated/metro-config');

const config = getDefaultConfig(__dirname);

module.exports = wrapWithReanimatedMetroConfig(withNativeWind({
  ...config,
  resolver: {
    ...config.resolver,
    assetExts: [...config.resolver.assetExts, 'bin', 'mil'],  
  },  
}, {
  input: './global.css',
  inlineRem: 16,
}));
