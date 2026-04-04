export default {
	maxWorkers: 2,
	testEnvironment: 'node',
	transform: {
		'^.+\\.[tj]sx?$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }]
	},
	transformIgnorePatterns: ['node_modules/(?!(@faker-js/faker|.*@faker-js))'],
	moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'html']
};
