var path = require('path');
var webpack = require('webpack');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var nodeExternals = require('webpack-node-externals');


module.exports = function (env) {
  return [


    ///----------------------------
    {

      mode: 'development',
      target: 'node',
      devtool: '#source-map',
      node: {
        __dirname: true,
        __filename: true,
      },
      entry: {

        'app': './src/server/app.js',

      },
      output: {
        path: path.join(__dirname, './dist'),
        filename: '[name].js',

      },
      module: {
        rules: [


          {
            test: /\.js$/,
            loader: 'babel-loader',
            // //exclude: /node_modules/
            // use: {
            //   loader: 'babel-loader',
            //   options: {
            //     presets: ['@babel/preset-env', {
            //       // "loose": true,
            //       // "modules": false
            //     }]
            //   }
            // }
          },
          {
            test: /\.html$/,
            loader: 'html-loader',
            query: {
              minimize: false
            }
          },


        ]
      },
      //externals: [/^(?!\.|\/).+/i,],
      externals: [nodeExternals()],
      plugins: [
        new webpack.DefinePlugin({
          'process.env': { NODE_ENV: JSON.stringify(process.env.NODE_ENV || "development") }
        }),

        new CopyWebpackPlugin([
          // { from: 'src/www/favicon/**/*', to:'/www/favicon/' },
          {
            context: 'src/server/txt',
            from: '**/*',
            to: './txt/'
          },

        ])
      ]
    },


  ]
}
