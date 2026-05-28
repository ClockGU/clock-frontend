import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import babel from "vite-plugin-babel";
import eslint from "vite-plugin-eslint";
import { configDefaults } from "vitest/config";
import { sentryVitePlugin } from "@sentry/vite-plugin";

const path = require("path");
export default defineConfig({
  test: {
    globals: true,
    watch: false,
    dir: "./tests",
    setupFiles: "./tests/unit/setup.js",
    exclude: [...configDefaults.exclude, "**/e2e/**"]
  },
  plugins: [
    vue(),
    eslint(),
    babel({
      babelConfig: {
        babelrc: false,
        configFile: false,
        plugins: [
          [
            "@babel/plugin-proposal-decorators",
            { loose: true, version: "2022-03" }
          ]
        ]
      }
    }),
    sentryVitePlugin({
      org: "clockgu",
      project: "clock-frontend-staging",
      authToken: import.meta.env.VITE_SENTRY_AUTH_TOKEN,
      sourcemaps: {
        // As you're enabling client source maps, you probably want to delete them after they're uploaded to Sentry.
        // Set the appropriate glob pattern for your output folder - some glob examples below:
        filesToDeleteAfterUpload: [
          "./**/*.map",
          ".*/**/public/**/*.map",
          "./dist/**/client/**/*.map"
        ]
      }
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src")
    }
  },
  server: {
    port: 8080,
    hmr: {
      clientPort: 443,
      protocol: "wss"
    }
  },
  preview: {
    port: 8080
  },
  build: {
    sourcemap: true
  }
});
