 var path = require('path');
 var webpack = require('webpack');
 module.exports = {
     entry: './src/virtual-list.js',
     output: {
         path: path.resolve(__dirname, 'build'),
         filename: 'app.bundle.js'
     },
     module: {
         rules: [
             {
                 use: {
                  loader: "babel-loader",
                  query: {
                    presets: ['es2015', 'react', 'stage-0'],
                  }
                }
             }
         ]
     }
 };