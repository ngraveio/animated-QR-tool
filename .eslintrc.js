module.exports = {
    root: true,
    parser: '@typescript-eslint/parser', // Specifies the ESLint parser
    parserOptions: {
      //ecmaVersion: 2021, // Allows for the parsing of modern ECMAScript features
      sourceType: 'module', // Allows for the use of imports
      tsconfigRootDir: __dirname, // Specifies the root directory to resolve relative paths in
      project: [
        './tsconfig.eslint.json',
        // 'apps/*/tsconfig.json',
        // 'common/*/tsconfig.json',
        // 'coins/*/tsconfig.json',
        // 'services/*/tsconfig.json',
      ], // Specifies the project to use
    },
    plugins: ['@typescript-eslint'],
    extends: [
      'eslint:recommended',
      'plugin:@typescript-eslint/eslint-recommended',
      'plugin:@typescript-eslint/recommended',
      'plugin:@typescript-eslint/recommended-requiring-type-checking',
      'plugin:prettier/recommended',
      //'prettier',
    ],
    env: {
      //es2021: true,
      node: true,
      es6: true,
    },
    rules: {
      // Place to specify ESLint rules. Can be used to overwrite rules specified from the extended configs
      // e.g. "@typescript-eslint/explicit-function-return-type": "off",
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-unused-expressions': 'warn',
      //"@typescript-eslint/ban-types": "warn",
      '@typescript-eslint/ban-ts-comment': 'warn',
      '@typescript-eslint/no-unsafe-return': 'warn',
      '@typescript-eslint/no-unsafe-assignment': 'warn',
      '@typescript-eslint/no-empty-function': 'warn',
      'no-unsafe-optional-chaining': 'warn',
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      // TODO: set back to 'error'
      'prettier/prettier': 'warn',
      // TODO: Turn back on.
      '@typescript-eslint/no-inferrable-types': 'off',
      // TODO: Set back to 'error'
      '@typescript-eslint/no-explicit-any': 'off',
      // TODO: Set back to 'error'
      '@typescript-eslint/no-var-requires': 'off',
      // TODO: Set back to 'error'
      'prefer-const': 'warn',
      // TODO: Turn back on.
      '@typescript-eslint/ban-types': 'warn',
      // TODO: Turn back on.
      '@typescript-eslint/no-empty-function': 'off',
      // TODO: Turn back on.
      'no-unsafe-optional-chaining': 'off',
      // TODO: Turn back on.
      '@typescript-eslint/require-await': 'warn',
      '@typescript-eslint/ban-ts-comment': 'warn',
      // TODO: Turn back on.
      '@typescript-eslint/no-unsafe-member-access': 'warn',
      // "@typescript-eslint/naming-convention": [
      //   "error",
      //   {
      //     "selector": "variable",
      //     "format": ["camelCase", "UPPER_CASE"]
      //   },
      //   {
      //     "selector": "function",
      //     "format": ["camelCase"]
      //   }
      // ]
    },
  };
  