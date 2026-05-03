const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ThemeWatcher = require("@salla.sa/twilight/watcher.js");
const CopyPlugin = require("copy-webpack-plugin");
const { InitialTwigSyncPlugin } = require("./scripts/salla-theme-sync.js");
const path = require("path");

const isWin = process.platform === "win32";
const isWatch = process.argv.includes("--watch");

module.exports = {
  entry: {
    theme: [
      './src/assets/js/theme.js',
      './src/assets/css/theme.css',
      './src/assets/css/luxe-perfume-blocks.css'
    ]
  },
  // Salla CLI wraps `webpack --watch` via execSync (no TTY stdin). Webpack 5 would
  // otherwise exit as soon as stdin ends. See: https://webpack.js.org/configuration/watch/#watchoptionsstdin
  watchOptions: {
    stdin: false,
    // OneDrive / cloud-synced folders on Windows often break native file watchers; webpack
    // can exit right after the first successful build and Salla CLI then reports
    // "Command failed: pnpm run watch". Polling avoids that.
    // OneDrive: slower poll can be more stable than native watchers + rapid clean cycles
    ...(isWin ? { poll: 2000 } : {}),
  },
  output: {
    path: path.resolve(__dirname, 'assets'),
    filename: 'js/[name].js',
    // Avoid deleting/rebuilding the whole output folder on every watch tick (often trips OneDrive / AV locks).
    clean: !isWatch,
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
    // First preview watch: push all Twig + twilight.json to draft so the store doesn’t keep showing Raed.
    new InitialTwigSyncPlugin(),
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
