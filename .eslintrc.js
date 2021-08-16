module.exports = {
  root: true,
  env: {
    node: true
  },
  plugins: ["vuetify"],
  extends: [
    "plugin:vue/recommended",
    "plugin:prettier/recommended",
    "eslint:recommended",
    "prettier/vue"
  ],
  rules: {
    "vue/component-name-in-template-casing": ["error", "PascalCase"],
    "vue/valid-v-slot": "off",
    "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
    "vuetify/no-deprecated-classes": "error"
  },
  parserOptions: {
    parser: "babel-eslint"
  }
};
