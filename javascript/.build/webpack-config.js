var webpack = require('webpack');
var path = require('path');

function loaders(options) {
  var l = [
    {
      test: /\.css$/,
      loader: 'style-loader!css-loader'
    },
    {
      test: /\.jsx?$/,
      loader: 'babel',
      exclude: /node_modules/,
      query: {
        presets: ['es2015', 'react'],
        cacheDirectory: true
      }
    }
  ];

  if (options.debug) {
    l.unshift({
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loader: 'react-hot'
    });
  }

  return l;
}

function plugins(debug) {
  var pluginsList = [];

  if (!debug) {
    pluginsList.push(new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }));

    pluginsList.push(new webpack.optimize.DedupePlugin());
    pluginsList.push(new webpack.optimize.UglifyJsPlugin());
  } else {
    pluginsList.push(new webpack.NoErrorsPlugin());
  }

  return pluginsList;
}

function entries(mainEntryPoint, debug, port) {
  if (!debug) {
    return mainEntryPoint;
  }

  return [
    'webpack-dev-server/client?http://localhost:' + port,
    'webpack/hot/only-dev-server',
    mainEntryPoint
  ];
}

function buildPublicPath(options) {
  if (options.debug) {
    return 'http://localhost:' + options.devServer.port + '/' + options.devServer.publicPath + '/';
  }

  return '/' + options.devServer.publicPath;
}

module.exports = function webpackDevConfig(options) {
  var paths = options.paths;
  var config;

  config = {
    entry: entries(options.entryPoint, options.debug, options.devServer.port),
    output: {
      path: path.join(__dirname, '..', paths.dest),
      filename: options.output,
      publicPath: buildPublicPath(options)
    },
    debug: options.debug,
    module: {
      loaders: loaders(options)
    },
    plugins: plugins(options.debug)
  };

  if (options.debug) {
    config.devtool = 'eval';
  }

  return config;
};
