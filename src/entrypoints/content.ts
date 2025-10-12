import { isDarkMode } from "@/lib/isDarkMode";
import { applyDarkMode, removeDarkMode } from "@/lib/applyDarkMode";
import { storage } from "#imports";
import { SitePreference } from "@/lib/preferences";
import { onMessage } from "webext-bridge/content-script";

export default defineContentScript({
  matches: ["<all_urls>"],
  // runAt: "document_start",

  async main() {
    const hostname = window.location.hostname;
    const storageKey = `dark-mode-preference:${hostname}`;

    const sitePreference = await storage.getItem<SitePreference>(`local:${storageKey}`);

    const { isDark, confidence } = isDarkMode();
    console.log(`Dark mode: ${isDark} (confidence: ${(confidence * 100).toFixed(0)}%)`);

    const mode = sitePreference?.mode ?? "detect";

    if (mode === "detect") {
      if (!isDark) {
        applyDarkMode();
      }
    } else {
      if (mode === "light") {
        removeDarkMode();
      } else {
        applyDarkMode();
      }
    }

    onMessage("request-state", () => {
      console.log("Requesting state");
      return {
        isDark,
        confidence,
        sitePreference: { mode },
        hostname,
      };
    });

    onMessage("toggle-dark-mode", async message => {
      if (message.data.hostname === hostname) {
        if (message.data.enabled) {
          removeDarkMode();
        } else {
          applyDarkMode();
        }
      }
    });
  },
});
