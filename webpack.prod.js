const path = require("path");

module.exports = [
  {
    entry: "./src/main.ts",
    output: {
      path: path.join(__dirname, "docs"),
      filename: "main.js",
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          exclude: /node_modules/,
          loader: "babel-loader",
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
