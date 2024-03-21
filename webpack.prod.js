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
          loader: "babel-loader",
        },
        {
          test: /\.obj$/,
          type: 'asset/source',
        }
      ],
    },
    resolve: {
      extensions: ['.ts', '.js'],
    },
    target: ['web','es5'],
    node: {
      __dirname: false,
    },
  }
];
