import { isDarkMode } from "@/lib/isDarkMode";
import { applyDarkMode, removeDarkMode } from "@/lib/applyDarkMode";
import { storage } from "#imports";
import { SitePreference } from "@/lib/preferences";
import { RequestStateResponse } from "@/lib/messages";

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

    // Listen for messages from popup
    browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
      switch (message.type) {
        case "request-state": // Send state back to popup when it requests it
          sendResponse({
            type: "dark-mode-state",
            isDark,
            confidence,
            sitePreference: { mode },
            hostname,
          } as RequestStateResponse);
          break;
        case "toggle-dark-mode":
          if (message.hostname === hostname) {
            if (message.enabled) {
              removeDarkMode();
            } else {
              applyDarkMode();
            }
          }
          break;
      }
      return true; // Keep the message channel open for async response
    });
  },
});
