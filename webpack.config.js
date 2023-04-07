const { join } = require("path");

module.exports = {
  entry: join(__dirname, "./public/src/index.js"),
  mode: "development",
  output: {
    path: join(__dirname, "./public/dist/"),
  },
  
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: join(__dirname, "node_modules/"),
        use: "babel-loader",
      },

      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader", "postcss-loader"]
      }
    ]
  },

  resolve: {
    extensions: [".js", ".jsx"]
  }
}
