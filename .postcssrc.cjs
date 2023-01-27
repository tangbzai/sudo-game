module.exports = {
  plugins: [
    require('postcss-preset-env')({ stage: 1, browsers: 'last 2 versions' }),
  ],
}
