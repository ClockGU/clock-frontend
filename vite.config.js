import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import babel from "vite-plugin-babel";
import eslint from "vite-plugin-eslint";
import { configDefaults } from "vitest/config";

const path = require("path");
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), "VITE");
  throw Error(
    JSON.stringify({
      VITE_API_URL: env.VITE_API_URL,
      VITE_PUBLIC_URL: env.VITE_PUBLIC_URL,
      VITE_ALLOWED_HOST: env.VITE_ALLOWED_HOST,
      VITE_I18N_LOCALE: env.VITE_I18N_LOCALE,
      VITE_I18N_FALLBACK_LOCALE: env.VITE_I18N_FALLBACK_LOCALE,
      VITE_MATOMO_URL: env.VITE_MATOMO_URL,
      VITE_MATOMO_SIDE_ID: env.VITE_MATOMO_SIDE_ID,
      VITE_MATOMO_DOMAINS: env.VITE_MATOMO_DOMAINS,
      VITE_ENV: env.VITE_ENV,
      VITE_LOCAL: env.VITE_LOCAL
    })
  );
  return {
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
    define: {
      VITE_API_URL: env.VITE_API_URL,
      VITE_PUBLIC_URL: env.VITE_PUBLIC_URL,
      VITE_ALLOWED_HOST: env.VITE_ALLOWED_HOST,
      VITE_I18N_LOCALE: env.VITE_I18N_LOCALE,
      VITE_I18N_FALLBACK_LOCALE: env.VITE_I18N_FALLBACK_LOCALE,
      VITE_MATOMO_URL: env.VITE_MATOMO_URL,
      VITE_MATOMO_SIDE_ID: env.VITE_MATOMO_SIDE_ID,
      VITE_MATOMO_DOMAINS: env.VITE_MATOMO_DOMAINS,
      VITE_ENV: env.VITE_ENV,
      VITE_LOCAL: env.VITE_LOCAL
    }
  };
});
