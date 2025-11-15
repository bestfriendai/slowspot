// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Ensure assets are resolved correctly
config.resolver = {
  ...config.resolver,
  assetExts: [...(config.resolver?.assetExts || []), 'mp3', 'wav', 'ogg'],
};

// Make sure Metro can find files in the mobile directory
config.watchFolders = [path.resolve(__dirname)];

module.exports = config;
