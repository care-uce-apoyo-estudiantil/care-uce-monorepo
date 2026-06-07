const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Esto obliga a Metro a buscar los paquetes SOLO en la carpeta local, 
// evitando que se pierda en el monorepo.
config.resolver.nodeModulesPaths = [
  path.resolve(__dirname, 'node_modules'),
];

module.exports = config;