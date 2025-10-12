export function applyDarkMode() {
  // Check if already applied
  if (document.querySelector("#dark-mode-override")) {
    return;
  }

  // language=css
  const darkModeCSS = `
  @layer dark-mode-override {
    /* Reset and base styles */
    * {
      background-color: #1e1e1e !important;
      color: #e0e0e0 !important;
      border-color: #444 !important;
    }

    /* Preserve transparent backgrounds */
    [style*="background: transparent"],
    [style*="background-color: transparent"],
    [class*="transparent"],
    [class*="overlay"],
    [class*="overContent"] {
      background-color: transparent !important;
    }

    /* Preserve elements with opacity or backdrop effects */
    [style*="opacity"],
    [style*="backdrop"],
    [class*="backdrop"],
    [class*="modal"],
    [class*="overlay"] {
      background-color: transparent !important;
    }
    
    /* Specific elements */
    html, body, div, main, section, article, header, footer, nav, aside {
      background-color: #1e1e1e !important;
      color: #e0e0e0 !important;
    }
    
    /* Preserve images and media */
    img, picture, video, canvas, svg, iframe {
      filter: none !important;
      background-color: transparent !important;
    }
    
    /* Better image container handling */
    [class*="image"], [class*="img"], [class*="photo"], 
    [class*="picture"], [class*="thumbnail"], [class*="avatar"] {
      background-color: #2d2d2d !important;
    }
    
    /* Links */
    a {
      color: #4da6ff !important;
    }
    a:visited { 
      color: #b47eff !important; 
    }
    
    /* Form elements */
    input, textarea, select, button {
      background-color: #2d2d2d !important;
      color: #e0e0e0 !important;
      border-color: #444 !important;
    }
    
    /* Handle pre-existing inline styles more aggressively */
    [style*="background"] {
      background-color: #1e1e1e !important;
    }
    
    [style*="color"]:not(img):not(svg) {
      color: #e0e0e0 !important;
    }
    
    /* Common framework classes that might resist */
    [class*="bg-white"], [class*="bg-light"], 
    .bg-white, .bg-light, .bg-gray-50, .bg-gray-100 {
      background-color: #1e1e1e !important;
    }
    
    [class*="text-dark"], [class*="text-black"],
    .text-dark, .text-black, .text-gray-900 {
      color: #e0e0e0 !important;
    }
    
    /* Preserve syntax highlighting */
    code[class*="language-"], pre[class*="language-"],
    .hljs, [class*="highlight"] {
      filter: none !important;
      background-color: #2d2d2d !important;
    }
    
    /* Shadow DOM handling - some sites use it */
    ::part(*) {
      background-color: #1e1e1e !important;
      color: #e0e0e0 !important;
    }

    /* Pseudo-elements */
    *::before, *::after {
      color: inherit !important;
      border-color: #444 !important;
      background-color: inherit !important;
    }
  }
`;
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
