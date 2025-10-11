export default defineContentScript({
  matches: ["<all_urls>"],
  main() {
    // Find element with largest visible area
    function getLargestElement() {
      const candidates = [
        document.body,
        document.querySelector("main"),
        document.querySelector('[role="main"]'),
        document.getElementById("main"),
        document.getElementById("content"),
        document.querySelector("article"),
        document.querySelector("section"),
        [...document.querySelectorAll("body > *")],
      ]
        .flat()
        .filter(Boolean) as HTMLElement[];

      // Calculate visible area for each candidate
      const candidatesWithArea = candidates.map(el => {
        const rect = el.getBoundingClientRect();
        const totalArea = rect.width * rect.height;

        // Check if background is transparent
        const bgColor = window.getComputedStyle(el).backgroundColor;
        const rgba = bgColor.match(/[\d.]+/g);
        const isTransparent = rgba && rgba.length === 4 && parseFloat(rgba[3]) === 0;
        console.log({ el, bgColor, isTransparent });

        // Skip transparent elements
        if (isTransparent) {
          console.log({ el, bgColor, status: "transparent - skipped" });
          return { el, visibleArea: 0 };
        }

        // Check if this element is significantly covered by another candidate
        let coveredArea = 0;
        candidates.forEach(other => {
          if (other === el || !el.contains(other)) return;

          const otherRect = other.getBoundingClientRect();
          const otherArea = otherRect.width * otherRect.height;
          coveredArea += otherArea;
        });

        const visibleArea = Math.max(0, totalArea - coveredArea);
        console.log({ el, totalArea, coveredArea, visibleArea });

        return { el, visibleArea };
      });

      // Return the element with the largest visible area
      const result = candidatesWithArea.reduce((max, curr) => (curr.visibleArea > max.visibleArea ? curr : max));

      return result.el;
    }

    const targetElement = getLargestElement();
    const bgColor = window.getComputedStyle(targetElement).backgroundColor;

    console.log("bg color", targetElement, bgColor);

    // Parse RGB color
    const rgb = bgColor.match(/\d+/g);
    if (!rgb) return;

    const [r, g, b] = rgb.map(Number);

    // Calculate relative luminance (perceived brightness)
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    console.log("luminance", luminance);

    // If light background (luminance > 0.5), apply dark mode
    if (luminance > 0.5) {
      const style = document.createElement("style");
      style.textContent = `
        * {
          background: none !important;
          color: inherit !important;
        }
        body {
          background-color: #1a1a1a !important;
          color: #e0e0e0 !important;
        }
      `;
      document.head.appendChild(style);
    }
  },
});
