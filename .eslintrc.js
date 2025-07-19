module.exports = {
  parser: "@typescript-eslint/parser", // Явно указываем TypeScript-парсер
  extends: [
    "airbnb",
    "airbnb-typescript",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:jsx-a11y/recommended",
    "plugin:prettier/recommended",
    "next/core-web-vitals",
  ],
  parserOptions: {
    project: "./tsconfig.json",
  },
  rules: {
    "react/react-in-jsx-scope": "off", // Next.js не требует импорт React
    "import/prefer-default-export": "off", // Разрешает именованные экспорты
    "react/jsx-props-no-spreading": "off", // Разрешает spread-пропсы
    "@typescript-eslint/no-unused-vars": ["error"],
    "prettier/prettier": "off",
  },
};
