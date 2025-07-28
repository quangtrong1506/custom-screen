// eslint.config.mjs
import tseslint from 'typescript-eslint';
import tailwind from 'eslint-plugin-tailwindcss';

export default [
   {
      ignores: ['node_modules/**', 'renderer/.next/**', 'dist/**'],
   },
   {
      files: ['**/*.ts', '**/*.tsx'],
      languageOptions: {
         parser: tseslint.parser,
      },
      plugins: {
         '@typescript-eslint': tseslint.plugin,
         tailwindcss: tailwind,
      },
      rules: {
         '@typescript-eslint/no-explicit-any': 'error',
         '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
         'tailwindcss/classnames-order': 'warn',
         'tailwindcss/no-custom-classname': 'warn',
         'tailwindcss/no-contradicting-classname': 'warn',
         // 'tailwindcss/no-duplicate-classname': 'warn',
      },
   },
];
