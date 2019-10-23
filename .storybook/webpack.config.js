const path = require('path');

module.exports = {
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "../src/")
    },
    extensions: ['.js', '.vue', '.css', 'sass', 'scss', '.png', '.jpg', '.gif', '.jpeg'],
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.s(c|a)ss$/,
        use: [
          'vue-style-loader',
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              implementation: require('sass'),
              fiber: require('fibers'),
              indentedSyntax: true // optional
            }
          }
        ]
      },
      {
        test: /\.(jpg|png|gif|jpeg)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 65000,
          },
        },
      },
      {
        test: /\.woff$/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[path][name].[ext]',
            outputPath: 'fonts',
            publicPath: '../fonts',
          },
        },
      },
    ],
  },
}
