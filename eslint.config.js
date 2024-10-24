import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended"
import eslintPluginReact from "eslint-plugin-react"
import eslintPluginTypescript from "typescript-eslint"

export default [
  // Any other config imports go at the top
  eslintPluginPrettierRecommended,
  ...eslintPluginTypescript.configs.recommended,
  eslintPluginReact.configs.flat.recommended, // This is not a plugin object, but a shareable config object
  eslintPluginReact.configs.flat["jsx-runtime"], // Add this if you are using React 17+
]
