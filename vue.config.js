const SentryWebpackPlugin = require("@sentry/webpack-plugin");

module.exports = {
  transpileDependencies: ["vuetify"],
  productionSourceMap: true,
  devServer: {
    public: process.env.VUE_APP_PUBLIC_URL,
    allowedHosts: [process.env.VUE_APP_ALLOWED_HOST],
    disableHostCheck: true
  },
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
