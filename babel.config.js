module.exports = {
  env: {
    test: {
      plugins: [
        ["@babel/plugin-proposal-decorators", { legacy: true }],
        ["transform-require-context"]
      ],
      presets: [["@vue/app"], ["@babel/preset-env"]]
    }
  },
  plugins: [["@babel/plugin-proposal-decorators", { legacy: true }]],
  presets: [["@vue/app"], ["@babel/preset-env"]]
};
