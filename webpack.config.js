const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ThemeWatcher = require("@salla.sa/twilight/watcher.js");
const CopyPlugin = require("copy-webpack-plugin");
const path = require("path");

module.exports = {
  entry: {
    theme: [
      './src/assets/js/theme.js',
      './src/assets/css/theme.css'
    ]
  },
  // Salla CLI wraps `webpack --watch` via execSync (no TTY stdin). Webpack 5 would
  // otherwise exit as soon as stdin ends. See: https://webpack.js.org/configuration/watch/#watchoptionsstdin
  watchOptions: {
    stdin: false,
  },
  output: {
    path: path.resolve(__dirname, 'assets'),
    filename: 'js/[name].js',
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
    ],
  },
  plugins: [
    new ThemeWatcher(),
    new MiniCssExtractPlugin({
      filename: 'css/[name].css',
    }),
    new CopyPlugin({
      patterns: [
        { from: 'src/assets/images', to: 'images', noErrorOnMissing: true },
      ],
    }),
  ],
};
