export default defineContentScript({
  matches: ['<all_urls>'],
  main() {
    const body = document.body;
    const bgColor = window.getComputedStyle(body).backgroundColor;

      console.log("bg color", bgColor);

    // Parse RGB color
    const rgb = bgColor.match(/\d+/g);
    if (!rgb) return;

    const [r, g, b] = rgb.map(Number);

    // Calculate relative luminance (perceived brightness)
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      console.log("luminance", luminance,)

    // If light background (luminance > 0.5), apply dark mode
    if (luminance > 0.5) {
      const style = document.createElement('style');
      style.textContent = `
        body {
          background-color: #1a1a1a !important;
          color: #e0e0e0 !important;
        }
      `;
      document.head.appendChild(style);
    }
  },
});
