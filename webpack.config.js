const createExpoWebpackConfigAsync = require('@expo/webpack-config');
const webpack = require('webpack');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);

  // Provide fallbacks for Node core modules used by some libs (crypto, stream, buffer)
  config.resolve = config.resolve || {};
  config.resolve.fallback = Object.assign({}, config.resolve.fallback, {
    crypto: require.resolve('crypto-browserify'),
    stream: require.resolve('stream-browserify'),
    buffer: require.resolve('buffer/'),
    process: require.resolve('process/browser'),
    vm: require.resolve('vm-browserify'),
    util: require.resolve('util/'),
    path: require.resolve('path-browserify'),
  });

  // Ensure imports like 'process/browser' resolve correctly
  config.resolve.alias = Object.assign({}, config.resolve.alias, {
    'process/browser': require.resolve('process/browser'),
  });

  config.plugins = config.plugins || [];
  config.plugins.push(
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
      process: 'process/browser',
    })
  );

  return config;
};
