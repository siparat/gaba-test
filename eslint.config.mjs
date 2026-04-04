import eslint from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import prettierConfig from 'eslint-config-prettier';
import prettierRecommended from 'eslint-plugin-prettier/recommended';
import unicorn from 'eslint-plugin-unicorn';
import globals from 'globals';

export default [
	{
		ignores: ['eslint.config.mjs']
	},

	eslint.configs.recommended,

	{
		files: ['**/*.ts'],
		languageOptions: {
			parser: tsParser,
			ecmaVersion: 'latest',
			sourceType: 'module',
			globals: {
				...globals.node,
				...globals.jest
			},
			parserOptions: {
				projectService: true,
				tsconfigRootDir: import.meta.dirname
			}
		},
		plugins: {
			'@typescript-eslint': tseslint,
			unicorn
		},
		rules: {
			...tseslint.configs.recommended.rules,

			'@typescript-eslint/explicit-function-return-type': 'warn',
			'@typescript-eslint/no-explicit-any': 'off',
			'@typescript-eslint/no-namespace': 'off',
			'@typescript-eslint/no-unused-vars': [
				'warn',
				{
					ignoreRestSiblings: true,
					varsIgnorePattern: '_^',
					caughtErrors: 'none'
				}
			],

			'@typescript-eslint/naming-convention': [
				'error',
				{
					selector: 'default',
					format: ['camelCase'],
					leadingUnderscore: 'allow',
					trailingUnderscore: 'allow'
				},
				{
					selector: 'variable',
					format: ['camelCase', 'UPPER_CASE']
				},
				{
					selector: 'variable',
					modifiers: ['const', 'global'],
					format: ['camelCase', 'UPPER_CASE', 'PascalCase']
				},
				{
					selector: 'typeLike',
					format: ['PascalCase']
				},
				{
					selector: 'import',
					format: ['camelCase', 'UPPER_CASE', 'PascalCase']
				},
				{
					selector: 'interface',
					format: ['PascalCase'],
					custom: {
						regex: '^I[A-Z]',
						match: true
					}
				},
				{
					selector: 'property',
					format: ['camelCase', 'UPPER_CASE', 'PascalCase']
				},
				{
					selector: 'enumMember',
					format: ['UPPER_CASE']
				}
			],

			...unicorn.configs.recommended.rules,
			'unicorn/filename-case': ['error', { case: 'kebabCase' }],
			'unicorn/prefer-top-level-await': ['off'],
			...prettierConfig.rules
		}
	},

	{
		files: ['**/*.spec.ts', '**/*.test.ts', '**/jest.config.ts', '**/jest.config.cts', '**/jest.preset.js'],
		rules: {
			'@typescript-eslint/explicit-function-return-type': 'off',
			'@typescript-eslint/no-explicit-any': 'off',
			'@typescript-eslint/naming-convention': 'off'
		}
	},

	prettierRecommended
];
