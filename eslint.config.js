import { defineConfig } from "eslint/config";
import pluginVue from "eslint-plugin-vue";
import vueParser from "vue-eslint-parser";
import eslintConfigPrettier from "eslint-config-prettier/flat";
export default defineConfig([
  {
    plugins: {
      vue: pluginVue
    },
    extends: [...pluginVue.configs["flat/recommended"]],
    rules: {
      "vue/component-name-in-template-casing": ["error", "PascalCase"],
      "vue/valid-v-slot": "off",
      "vue/no-v-text-v-html-on-component": "off",
      "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
      "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off"
    },
    languageOptions: {
      parser: vueParser
    }
  },
  eslintConfigPrettier
]);
