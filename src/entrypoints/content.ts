import { isDarkMode } from "@/lib/isDarkMode";
import { applyDarkMode } from "@/lib/applyDarkMode";

export default defineContentScript({
  matches: ["<all_urls>"],
  // runAt: "document_start",

  main() {
    const { isDark, confidence } = isDarkMode();
    console.log(`Dark mode: ${isDark} (confidence: ${(confidence * 100).toFixed(0)}%)`);

    if (!isDark) {
      applyDarkMode();
    }
  },
});
