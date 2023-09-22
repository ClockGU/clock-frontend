module.exports = {
  env: {
    test: {
      plugins: [
        ["@babel/plugin-proposal-decorators", { legacy: true }],
        ["transform-require-context"],
        ["@babel/plugin-syntax-import-attributes"]
      ],
      presets: [["@vue/app"], ["@babel/preset-env"]]
    }
  },
  plugins: [["@babel/plugin-proposal-decorators", { legacy: true }], ["@babel/plugin-syntax-import-attributes"]],
  presets: [["@vue/app"], ["@babel/preset-env"]]
};
