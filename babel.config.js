module.exports = {
  env: {
    test: {
      plugins: ["transform-require-context"]
    }
  },
  plugins: ["@babel/plugin-proposal-decorators", { legacy: true }],
  presets: [["@vue/app"], ["@babel/preset-env"]]
};
