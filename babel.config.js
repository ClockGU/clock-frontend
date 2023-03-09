module.exports = {
  env: {
    test: {
      plugins: ["transform-require-context"]
    }
  },
  plugins: ["@babel/plugin-proposal-private-methods"],
  presets: ["@vue/app"]
};
