import eslint from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import prettierConfig from 'eslint-config-prettier';
import checkFile from 'eslint-plugin-check-file';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import unicorn from 'eslint-plugin-unicorn';
import globals from 'globals';

export default [
	{
		ignores: ['eslint.config.mjs']
	},
	tseslint.configs.recommended,
	eslint.configs.recommended,
	checkFile.configs.recommended,
	unicorn.configs.recommended,
	tseslint.configs.recommended,
	eslintPluginPrettierRecommended,
	{
		languageOptions: {
			globals: {
				...globals.node,
				...globals.jest
			},
			ecmaVersion: 5,
			sourceType: 'module',
			parserOptions: {
				projectService: true,
				tsconfigRootDir: import.meta.dirname
			}
		}
	},
	{
		files: [
			'**/*.spec.ts',
			'**/*.test.ts',
			'**/jest.config.ts',
			'**/jest.config.cts',
			'**/jest.preset.js',
			'eslint.config.mjs'
		],
		rules: {
			'@typescript-eslint/explicit-function-return-type': 'off',
			'@typescript-eslint/no-explicit-any': 'off',
			'@typescript-eslint/naming-convention': 'off'
		}
	},
	{
		rules: {
			'@typescript-eslint/no-explicit-any': 'off',
			'@typescript-eslint/recommended-type-checked': 'off',
			'@typescript-eslint/no-unused-expressions': 'off',
			'@typescript-eslint/no-namespace': 'off',
			'@typescript-eslint/interface-name-prefix': 'off',
			'@typescript-eslint/explicit-function-return-type': 'warn',
			'@typescript-eslint/explicit-module-boundary-types': 'off',
			'@typescript-eslint/no-unused-vars': [
				'warn',
				{
					ignoreRestSiblings: true,
					varsIgnorePattern: '_',
					caughtErrors: 'none'
				}
			],
			'unicorn/filename-case': [
				'error',
				{
					case: 'kebabCase'
				}
			],
			'check-file/folder-naming-convention': [
				'error',
				{
					'**/': 'KEBAB_CASE'
				}
			],
			'@typescript-eslint/no-explicit-any': 'off',
			...prettierConfig.rules,
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
					format: ['camelCase', 'UPPER_CASE'],
					leadingUnderscore: 'allow',
					trailingUnderscore: 'allow'
				},
				{
					selector: 'variable',
					modifiers: ['const', 'global'],
					format: ['camelCase', 'UPPER_CASE', 'PascalCase'],
					leadingUnderscore: 'forbid'
				},
				{
					selector: 'objectLiteralProperty',
					format: ['camelCase', 'PascalCase', 'UPPER_CASE', 'snake_case']
				},
				{
					selector: 'variable',
					types: ['boolean'],
					format: ['camelCase'],
					custom: {
						regex: '^(is|has|can|should|must)[A-Z]',
						match: true
					}
				},
				{
					selector: 'typeLike',
					format: ['PascalCase']
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
					selector: 'enumMember',
					format: ['UPPER_CASE']
				},
				{
					selector: 'enum',
					format: ['PascalCase']
				},
				{
					selector: 'property',
					format: ['camelCase', 'UPPER_CASE']
				}
			]
		}
	}
];
