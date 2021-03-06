module.exports = {
  parserOptions: {
    ecmaVersion: 2018,
    ecmaFeatures: {
      impliedStrict: true
    }
  },
  extends: [
    'eslint:recommended',
    'standard'
  ],
  env: {
    es6: true,
    mocha: true,
    node: true
  },
  // ADD ANY GLOBALS HERE!
  globals: {
    'jest': true
  },
  rules: {
    quotes: [2, 'single', { avoidEscape: true }],
    'promise/param-names': 0,
    'camelcase': 1,
    'prefer-promise-reject-errors': 1,
    'no-template-curly-in-string': 2,
    'no-unused-expressions': 1, //for testing
    'no-extra-parens': [1, 'all'],
    'no-misleading-character-class': 1,
    'no-prototype-builtins': 1,
    'no-await-in-loop': 0, // should probably be on for perf dependent application
    'require-atomic-updates': 1,
    // best practices
    'accessor-pairs': 1,
    'array-callback-return': 0, // this best practice calls out the use of map over forEach
    'complexity': 2,
    'curly': [1, 'multi-or-nest', 'consistent'],
    'space-before-function-paren': ['error', {
      'named': 'never',
    }],
    'standard/computed-property-even-spacing': 0, //prettier compatibility
    'dot-location': [2, 'property'],
    'no-empty-function': 1,
    'no-empty': 1,
    'no-eval': 2,
    'no-extend-native': 1,
    'no-extra-bind': 1,
    'no-implicit-coercion': 1,
    'no-implicit-globals': 2,
    'no-implied-eval': 2,
    'no-lone-blocks': 1,
    'no-loop-func': 1,
    'no-magic-numbers': 0, // could be useful?
    'no-new': 1,
    'no-new-func': 2,
    'no-new-wrappers': 1,
    'new-cap': 0, //since token name start with 'p'
    'no-param-reassign': 2,
    'no-redeclare': [2, { 'builtinGlobals': true }],
    'no-shadow': [1, {
      'builtinGlobals': true,
      'allow': [
        'done',
        'resolve',
        'reject',
        'TextEncoder',
        'TextDecoder',
        'cb',
      ]
    }],
    'no-return-await': 1,
    'no-script-url': 1,
    'no-self-compare': 1,
    'no-sequences': 1,
    'no-throw-literal': 2,
    'no-unmodified-loop-condition': 1,
    'no-unexpected-multiline': 0,
    'no-useless-call': 1,
    'no-useless-catch': 1,
    'no-useless-concat': 2,
    'no-useless-escape': 2,
    'no-useless-return': 0,
    'no-console': ['error', {
      allow: [
        'warn',
        'error',
        'info',
      ]
    }],
    'no-warning-comments': [1, {
      terms: [
        'fixme',
        'todo',
      ],
      location: 'anywhere' // useful to highlight comments that need addressing
    }],
    'require-await': 1,
    'vars-on-top': 2,
    'wrap-iife': [2, 'inside'],
    // strict mode
    'strict': [2, 'safe'],
    // variables
    'no-use-before-define': [2, {
      variables: false, //in order to declare arrow functions in alphabetical order
      functions: true,
      classes: true
    }],
    // node
    'handle-callback-err': 1,
    'no-buffer-constructor': 2,
    'no-mixed-requires': 2,
    'no-new-require': 0,
    'no-path-concat': 1,
    'no-sync': 1
    // stylistic (leaving up to standard)

    // ECMAScript 6 (tbd)
  }
}