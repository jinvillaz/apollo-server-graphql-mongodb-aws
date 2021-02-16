module.exports = {
  root: true,
  plugins: ['node', 'jest', 'prettier'],
  env: {
    node: true,
    jest: true,
    es6: true,
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  extends: ['eslint:recommended', 'plugin:import/errors', 'plugin:import/warnings', 'prettier'],
  parser: 'babel-eslint',
  rules: {
    'prettier/prettier': 'error',
    'lines-between-class-members': ['error', 'always'],
    'no-console': ['error', { allow: ['warn', 'error'] }],
    'no-underscore-dangle': [
      'error',
      {
        allow: ['_id'],
      },
    ],
    'prefer-const': [
      'error',
      {
        destructuring: 'any',
        ignoreReadBeforeAssign: false,
      },
    ],
    'no-underscore-dangle': [
      'error',
      {
        'allow': [
          '_id'
        ]
      }
    ],
  },
};
