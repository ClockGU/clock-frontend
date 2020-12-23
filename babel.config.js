module.exports = {
  env: {
    test: {
      plugins: ["transform-require-context"]
    }
  },
  presets: ["@vue/app"]
};
