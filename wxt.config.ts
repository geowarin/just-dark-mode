import { defineConfig } from "wxt";

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
});
