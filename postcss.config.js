module.exports = ctx => ({
  plugins: {
    'postcss-import': {},
    'postcss-cssnext': {
      flexbox: true,
      browsers: ['last 10 versions', 'ie>=8', '>1% in CN']
    },
    autoprefixer: {},
    cssnano: ctx.env === 'production' ? {} : false
  }
});
