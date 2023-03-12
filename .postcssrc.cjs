module.exports = {
  plugins: {
    'postcss-preset-env': { stage: 1, browsers: 'last 2 versions' },
    'postcss-pxtorem': { rootValue: 75, propList: ['*'] },
  },
}
