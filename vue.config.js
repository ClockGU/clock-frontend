const SentryWebpackPlugin = require("@sentry/webpack-plugin");

module.exports = {
  transpileDependencies: ["vuetify"],
  productionSourceMap: true,
  configureWebpack: config => {
    if (
      process.env.NODE_ENV === "production" ||
      process.env.NODE_ENV === "staging"
    ) {
      config.plugins.push(
        new SentryWebpackPlugin({
          release: process.env.VUE_APP_SENTRY_RELEASE,
          include: "./dist",
          ignore: ["node_modules", "vue.config.js"]
        })
      );
    }
  }
};
