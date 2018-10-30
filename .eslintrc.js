// https://eslint.org/docs/user-guide/configuring

module.exports = {
    root: true,
    parserOptions: {
        parser: 'babel-eslint',
        ecmaVersion: 6,
        sourceType: 'module',
        ecmaFeatures: {
            impliedStrict: true,
            jsx: true
        }
    },
    env: {
        browser: true,
        jquery: true
    },
    globals: {
        window: true,
        Routing: true,
        document: true,
        navigator: false,
        importScripts: true
    },
    extends: [
        // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
        // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
        'plugin:vue/essential',
        'eslint:recommended',
        // https://github.com/standard/standard/blob/master/docs/RULES-en.md
        'standard'
    ],
    // required to lint *.vue files
    plugins: [
        'vue'
    ],
    // add your custom rules here
    rules: {
        // allow console log
        'no-console': 0,
        'no-new': 0,
        // allow async-await
        'generator-star-spacing': 0,
        'space-before-function-paren': 0,
        // allow debugger during development
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 0,
        'indent': 0,
        'no-useless-escape': 0,
        'linebreak-style': [
            'error',
            'unix'
        ],
        'quotes': [
            'error',
            'single'
        ],
        'semi': [
            'error',
            'always'
        ]
    }
};
