'use strict';

module.exports = {
    env: {
        es6: true,
        browser: true
    },
    extends: ['prettier'],
    plugins: ['prettier'],
    rules: {
        'prettier/prettier': 'error'
    },
    parserOptions: {
        sourceType: 'module',
        ecmaVersion: 8
    }
};
