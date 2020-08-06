const path = require('path');

module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
    browser: true,
  },
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: 'babel-eslint',
    // Allows for the parsing of modern ECMAScript features
    ecmaVersion: 2019,
    // Allows for the use of imports
    sourceType: 'module',
  },
  extends: [
    'airbnb-base',
    // https://eslint.vuejs.org/rules/
    'plugin:vue/recommended',
    '@vue/airbnb',
    '@vue/prettier',
    // Enables eslint-plugin-prettier and displays prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
    'plugin:prettier/recommended',
  ],
  plugins: ['vue'],
  settings: {
    'import/resolver': {
      webpack: {
        config: {
          resolve: {
            alias: {
              '~': path.join(__dirname, 'src'),
            },
            extensions: ['.js', '.jsx', '.ts', '.vue'],
          },
        },
      },
    },
  },
  /**
   * 'off' 或 0 - 关闭规则
   * 'warn' 或 1 - 开启规则，使用警告级别的错误：warn (不会导致程序退出)
   * 'error' 或 2 - 开启规则，使用错误级别的错误：error (当被触发的时候，程序会退出)
   */
  rules: {
    'no-underscore-dangle': 'off',
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    'no-console': process.env.NODE_ENV === 'production' ? 2 : 0,
    // allow async-await
    'generator-star-spacing': 0,
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        vue: 'never',
      },
    ],
    // vuex
    'no-param-reassign': [
      'error',
      {
        props: true,
        ignorePropertyModificationsFor: [
          'state',
          'acc',
          'e',
          'ctx',
          'req',
          'request',
          'res',
          'response',
          '$scope',
        ],
      },
    ],
    // vuex
    'no-shadow': ['error', { allow: ['state'] }],
    // 禁止使用 var
    'no-var': 2,
    'vue/attribute-hyphenation': 2,
    'vue/html-closing-bracket-spacing': 2,
    'vue/html-end-tags': 2,
    'vue/html-self-closing': [
      2,
      {
        html: {
          void: 'always',
          normal: 'always',
          component: 'always',
        },
        svg: 'always',
        math: 'always',
      },
    ],
    'vue/max-attributes-per-line': 0,
    'vue/no-template-shadow': 2,
    'vue/singleline-html-element-content-newline': 0,
    'vue/v-bind-style': 2,
    'vue/v-on-style': 2,
    'vue/attributes-order': 0,
    'vue/this-in-template': 2,
    'import/no-unresolved': 0,
    'import/prefer-default-export': 0,
    'consistent-return': 0,
    'vue/multiline-html-element-content-newline': 0,
    'vue/no-v-html': 0,
    'vue/html-closing-bracket-newline': [
      2,
      {
        singleline: 'never',
        multiline: 'always',
      },
    ],
    'vue/html-self-closing': 0,
    'prettier/prettier': [
      2,
      {
        // 声明结尾使用分号(默认true)
        semi: true,
        // 是否使用尾逗号，三个可选之’<none/es5/all>'
        trailingComma: 'all',
        // 字符串是否使用单引号。默认 false 使用双引号
        singleQuote: true,
        // 一行的字符数，如果超过会进行换行。默认 80
        printWidth: 100,
        // tab 使用 2 个空格
        tabWidth: 2,
        htmlWhitespaceSensitivity: 'ignore',
        // https://stackoverflow.com/questions/53516594/why-do-i-keep-getting-delete-cr-prettier-prettier
        endOfLine: 'auto',
        ignorePath: '.prettierignore',
      },
    ],
  },
  globals: {
    uni: true,
    wx: true,
    App: true,
    getApp: true,
    Page: true,
    getCurrentPages: true,
    Component: true,
    Behavior: true,
  },
};
