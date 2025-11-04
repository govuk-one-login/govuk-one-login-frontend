export default { 
    extends: ['@commitlint/config-conventional'], 
    rules: {
        'subject-case': [0, 'always', ['camel-case', 'sentence-case', 'pascal-case']],
        'body-max-line-length': [2, 'always', 200],
    }
};
