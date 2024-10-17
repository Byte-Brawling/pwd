// extension/webpack.config.js
import path from 'path';
import CopyPlugin from 'copy-webpack-plugin';

module.exports = {
  entry: {
    popup: './src/popup/index.ts',
    content: './src/content-scripts/index.ts',
    background: './src/background/index.ts',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: 'public', to: '.' },
        { from: 'src/popup/index.html', to: 'popup.html' },
      ],
    }),
  ],
};