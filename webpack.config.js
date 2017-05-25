var path = require('path');

module.exports = {
  entry: './js/main.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  devServer: {
  contentBase: path.join(__dirname, "dist"),
  compress: true,
  port: 8080
} 
};