const js = require('@eslint/js');
const typescriptParser = require('@typescript-eslint/parser');

module.exports = [
    // Apply recommended JavaScript rules to all JS/TS files
    {
        ...js.configs.recommended,
        files: ['**/*.{js,jsx,ts,tsx,mjs,cjs}'],
    },
    // Global ignores
    {
        ignores: [
            '**/node_modules/**',
            '**/dist/**',
            '**/.turbo/**',
            '**/coverage/**',
            '**/build/**',
            '**/*.config.js',
            '**/*.config.ts',
            '**/*.config.mjs',
            '.eslintrc.js',
        ],
    },
    // TypeScript-specific configuration
    {
        files: ['**/*.{ts,tsx}'],
        languageOptions: {
            parser: typescriptParser,
            parserOptions: {
                ecmaVersion: 2022,
                sourceType: 'module',
            },
        },
        rules: {
            // Disable JavaScript rules that TypeScript handles
            'no-unused-vars': 'off',
            'no-undef': 'off',
            'no-redeclare': 'off',
            
            // Basic rules for now
            'no-console': ['warn', { allow: ['warn', 'error', 'debug'] }],
            'no-debugger': 'error',
        },
    },
    // Test file specific rules
    {
        files: ['**/*.test.{ts,tsx,js,jsx}', '**/*.spec.{ts,tsx,js,jsx}'],
        rules: {
            'no-console': 'off',
        },
    },
    // Storybook files
    {
        files: ['**/*.stories.{ts,tsx,js,jsx}'],
        rules: {
            'no-console': 'off',
        },
    },
];