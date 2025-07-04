const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const Dotenv = require('dotenv-webpack');

module.exports = {
  entry: './src/index.js',

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    clean: true,
  },

  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },

  plugins: [
    // ✅ Loads from .env file (for local development)
    new Dotenv({
       path: './.env', 
      systemvars: true, // ✅ Allows Vercel system vars to override .env
    }),

    // ✅ DefinePlugin for Vercel's injected build-time variables
    new webpack.DefinePlugin({
      'process.env.REACT_APP_CALENDARIFIC_API_KEY': JSON.stringify(process.env.REACT_APP_CALENDARIFIC_API_KEY),
    }),

    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
  ],

  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },
    compress: true,
    port: 3000,
    open: true,
    hot: true,
  },

  resolve: {
    extensions: ['.js', '.jsx'],
  },
};
