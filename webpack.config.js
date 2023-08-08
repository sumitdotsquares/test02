const path = require('path');
const Dotenv = require('dotenv-webpack');

module.exports = {
  mode: 'development',
  entry: ['./src/app.js'],
  output: {
    path: path.join(__dirname, 'dist/'),
    filename: 'bundle.min.js',
  },
  module: {
    rules: [
      {
        loader: 'babel-loader',
        test: /\.js$/,
        exclude: /node_modules\/(?!(query-string|strict-uri-encode)\/).*/,
      },
      {
        test: /\.s?css$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'style-loader',
            options: {
              // sourceMap: true,
              injectType: 'singletonStyleTag'
            },
          },
          {
            loader: 'css-loader',
            options: {
              url: false,
              sourceMap: true,
            },
          },
          {
            loader: 'sass-loader',
            options: {
              // url: false,
              sourceMap: true
            },
          },
        ],
      },
    ],
  },
  devtool: 'source-map',
  plugins: [new Dotenv({ path: path.resolve(__dirname, './.env') })],
  devServer: {
    contentBase: [path.join(__dirname, 'dist/'), path.join(__dirname, 'public/')],
    inline: true,
    port: 5001,
    hot: true,
    host: 'localhost',
    compress: true,
    historyApiFallback: true,
    overlay: true,
    publicPath: '/dist/',
  },
};
