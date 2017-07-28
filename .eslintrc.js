// http://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    browser: true,
  },
  // https://github.com/feross/standard/blob/master/RULES.md#javascript-standard-style
  extends: 'standard',
  // required to lint *.vue files
  plugins: [
    'html'
  ],
  // add your custom rules here
  'rules': {
    // allow paren-less arrow functions
    'arrow-parens': 0,
    // allow async-await
    'generator-star-spacing': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    // allows trailing whitespace on empty lines
    'no-trailing-spaces': ["error", { "skipBlankLines": true }],
    'eol-last': 0,  // 不检测一个文件的末尾是否有空行
    'indent': 0,
    "space-before-function-paren": 0  // 不检查一个函数括号前是否有空格
  }
}
