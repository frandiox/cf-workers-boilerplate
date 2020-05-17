const path = require('path')
const Dotenv = require('dotenv-webpack')

const mode = process.env.NODE_ENV || 'production'

module.exports = {
  entry: path.join(process.cwd(), 'index.ts'),
  output: {
    filename: `worker.js`,
    path: path.join(process.cwd(), 'dist'),
  },
  devtool: 'source-map',
  mode,
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    plugins: [],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        options: {
          transpileOnly: true,
        },
      },
      { enforce: 'pre', test: /\.js$/, loader: 'source-map-loader' },
    ],
  },
  plugins: [
    new Dotenv({
      path: path.resolve(__dirname, '.env.' + mode),
      safe: path.resolve(__dirname, '.env.development'),
    }),
  ],
}
