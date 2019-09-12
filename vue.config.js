const SentryCliPlugin = require("@sentry/webpack-plugin");

module.exports = {
  productionSourceMap: false,
  configureWebpack: config => {
    if (
      process.env.NODE_ENV === "production" ||
      process.env.NODE_ENV === "staging"
    ) {
      config.plugins.push(
        new SentryCliPlugin({
          release: process.env.VUE_APP_SENTRY_RELEASE,
          include: "./dist",
          ignore: ["node_modules", "webpack.config.js"]
        })
      );
    }
  }
};
