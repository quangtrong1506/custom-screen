// eslint.config.mjs
import prettier from "eslint-plugin-prettier";
import tailwind from "eslint-plugin-tailwindcss";
import tseslint from "typescript-eslint";
export default [
  {
    ignores: ["node_modules/**", "renderer/.next/**", "dist/**", "app/**"],
  },
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: tseslint.parser,
    },
    plugins: {
      "@typescript-eslint": tseslint.plugin,
      tailwindcss: tailwind,
      prettier: prettier,
    },
    rules: {
      "prettier/prettier": "error",
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_" },
      ],
      "tailwindcss/classnames-order": "warn",
      // 'tailwindcss/no-custom-classname': 'warn',
      // 'tailwindcss/no-contradicting-classname': 'warn'
      // 'tailwindcss/no-duplicate-classname': 'warn',
    },
  },
];
