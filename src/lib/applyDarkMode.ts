import darkMode from "./css/dark.pcss?inline";

export function applyDarkMode() {
  // Check if already applied
  if (document.querySelector("#dark-mode-override")) {
    return;
  }

  // language=css
  const darkModeCSS = darkMode;
  const style = document.createElement("style");
  style.id = "dark-mode-override";
  style.textContent = darkModeCSS;
  document.documentElement.appendChild(style);
}

export function removeDarkMode() {
  const existingStyle = document.querySelector("#dark-mode-override");
  if (existingStyle) {
    existingStyle.remove();
    console.log("Dark mode override removed");
  }
}
