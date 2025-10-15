import { defineConfig } from "wxt";
import customSelectors from "postcss-custom-selectors";

// See https://wxt.dev/api/config.html
export default defineConfig({
  srcDir: "src",
  modules: ["@wxt-dev/module-svelte"],
  manifest: {
    permissions: ["storage"],
  },
  webExt: {
    startUrls: ["http://www.example.com/", "https://www.npmjs.com/package/webext-bridge"],
    openDevtools: true,
    chromiumArgs: ["--user-data-dir=./.wxt/chrome-data"],
  },
  vite: env => {
    return {
      css: {
        postcss: {
          plugins: [customSelectors],
        },
      },
    };
  },
});
