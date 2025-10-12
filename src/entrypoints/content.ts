import { isDarkMode } from "@/lib/isDarkMode";

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

function applyDarkMode() {
  // Check if already applied
  if (document.querySelector("#dark-mode-override")) {
    return;
  }

  const darkModeCSS = `
  * {
    background-color: #1e1e1e !important;
    color: #e0e0e0 !important;
  }
  
  /* More specific overrides */
  html, body, div, main, section, article {
    background-color: #1e1e1e !important;
    color: #e0e0e0 !important;
  }
  
  a {
    color: #4da6ff !important;
  }
  a:visited { 
    color: #b47eff !important; 
  }
  
  input, textarea, select, button {
    background-color: #2d2d2d !important;
    color: #e0e0e0 !important;
    border-color: #444 !important;
  }
`;

  const style = document.createElement("style");
  style.id = "dark-mode-override";
  style.textContent = darkModeCSS;
  document.documentElement.appendChild(style);
}
