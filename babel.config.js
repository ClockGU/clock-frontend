module.exports = {
  env: {
    test: {
      plugins: [
        ["@babel/plugin-proposal-decorators", { legacy: true }],
        ["transform-require-context"]
      ]
    }
  },
  plugins: ["@babel/plugin-proposal-decorators", { legacy: true }],
  presets: [["@vue/app"], ["@babel/preset-env"]]
};
