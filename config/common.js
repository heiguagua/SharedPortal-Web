const path = require("path"),
  webpack = require("webpack"),
  HtmlWebpackPlugin = require("html-webpack-plugin");

/** common config */
module.exports = {
  context: path.resolve(__dirname, "../sources"),
  entry: {
    app: "./app.js",
    vendor: [
      "vue"
    ],
    vendor1: [
      "vue-router"
    ],
    vendor2: [
      "element-ui"
    ],
    vendor3:[
      "axios"
    ],
    vendor4:[
      "crypto"
    ],
    vendor5:[
      "lodash"
    ]
  },
  resolve: {
    extensions: [".js", ".vue", ".json"],
    alias: {
      "vue$": "vue/dist/vue.esm.js"
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      favicon: "assets/favicon.ico",
      template: "index.html",
      filename: "index.html"
    }),
    new webpack.optimize.CommonsChunkPlugin({
      names: ["vendor5", "vendor4","vendor3","vendor2","vendor1","vendor","manifest"]
    }),
    new webpack.optimize.ModuleConcatenationPlugin(),
    new webpack.ProvidePlugin({
      'window.jQuery': 'jquery',
      jQuery: "jquery",
      $: "jquery"
    })

    // new webpack.ProvidePlugin({
    //     jQuery: "jquery",
    //     $: "jquery"
    // })
  ],
  module: {
    rules: [{
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      }, {
        test: require.resolve('jquery'),
        use: [{
          loader: 'expose-loader',
          options: 'jQuery'
        }, {
          loader: 'expose-loader',
          options: '$'
        }]
      },
      {
        test: /\.css$/,
        use: [
          "style-loader", {
            loader: "css-loader",
            options: {
              importLoaders: 1
            }
          },
          "postcss-loader"
        ]
      }
    ]
  }
};
