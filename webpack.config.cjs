const path = require('path');

module.exports = {
  entry: './src/index.ts',
  target: 'node',
  mode: 'production',
  devtool: false,

  output: {
    filename: 'bundled.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'policy',
    libraryTarget: 'global',
    globalObject: 'globalThis',
  },

  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },

  resolve: {
    extensions: ['.ts', '.js'],
  },
};
