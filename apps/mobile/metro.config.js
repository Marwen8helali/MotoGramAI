const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Ajout de la configuration pour gérer les dépendances de Clerk
config.resolver.nodeModulesPaths = [
  ...config.resolver.nodeModulesPaths,
  './node_modules',
];

config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  'react-dom': require.resolve('react-dom'),
};

config.resolver.assetExts.push(
  // Ajoutez ici les extensions de fichiers d'assets que vous utilisez
  'png',
  'jpg',
  'jpeg',
  'gif',
  'webp'
);

module.exports = config; 