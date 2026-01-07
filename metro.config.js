const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Ignore problematic directories
config.watchFolders = [__dirname];
config.resolver.blockList = [
  /.*\\AppData\\Local\\Microsoft\\Windows\\Explorer\\IconCacheToDelete.*/,
  /.*\\AppData\\Local\\Temp\\WinSAT.*/,
];

module.exports = config;
