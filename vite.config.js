import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import babel from 'vite-plugin-babel';

const path = require("path");
export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return defineConfig({
  plugins: [vue(), babel({
    babelConfig: {
      babelrc: false,
      configFile: false,
      plugins: [
        [
          "@babel/plugin-proposal-decorators",
          { loose: true, version: "2022-03" },
        ],
      ],
    },
  }),],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port:8080
  },
});};