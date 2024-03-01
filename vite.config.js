import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import babel from "vite-plugin-babel";
import { configDefaults } from "vitest/config";

const path = require("path");
export default defineConfig({
  test: {
    globals: true,
    watch: false,
    browser: {
      enabled: true,
      name: "firefox",
      headless: true
    },
    exclude: [...configDefaults.exclude, "**/tests/e2e/**"]
  },
  plugins: [
    vue(),
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
  }
});
