const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");

module.exports = env => {
  const isProduction = env === "production";

  return {
    entry: "./src/app.js",
    output: {
      path: path.join(__dirname, "public"),
      filename: "bundle.js",
      publicPath: "/"
    },
    module: {
      rules: [
        {
          loader: "babel-loader",
          test: /\.js$/,
          exclude: /node_modules/
        },

        {
          test: /\.s?css$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader
            },
            {
              loader: "css-loader",
              options: {
                sourceMap: true
              }
            },
            {
              loader: "sass-loader",
              options: {
                sourceMap: true
              }
            }
          ]
        }
      ]
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: "styles.css"
      })
    ],
    devtool: isProduction ? "source-map" : "inline-source-map",
    devServer: {
      historyApiFallback: {
        disableDotRule: true
      },
      contentBase: path.resolve(__dirname, "public"),
      proxy: {
        "/api": "http://localhost:5000/"
      }
    }
  };
};
