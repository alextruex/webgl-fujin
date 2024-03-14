const path = require("path");

module.exports = [
  {
    entry: "./src/main.ts",
    output: {
      path: path.join(__dirname, "dist"),
      filename: "main.js",
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          exclude: /node_modules/,
          loader: "ts-loader",
        },
      ],
    },
    resolve: {
      extensions: ['.ts', '.js'],
    },
    target: ['web', 'es6'],
    node: {
      __dirname: false,
    },
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
      static: './dist',
    },
  }
];
