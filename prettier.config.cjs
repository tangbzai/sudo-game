module.exports = {
  printWidth: 100,
  proseWrap: 'always',
  tabWidth: 2,
  semi: false,
  trailingComma: 'es5',
  singleQuote: true,
  arrowParens: 'always',
  plugins: [require('@trivago/prettier-plugin-sort-imports')],
  importOrder: ['^[a-zA-Z-]+$', '^@[^/]+/.*', '^@.*', '^[.]+/'],
  importOrderSeparation: false,
  importOrderSortSpecifiers: true,
  importOrderCaseInsensitive: true,
}
