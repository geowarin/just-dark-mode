type Measurement = {
  element: Element;
  ratio: number;
  area: number;
  rgba: [number, number, number, number];
};

export default defineContentScript({
  matches: ["<all_urls>"],
  async main() {
    async function findMostSignificantElement(): Promise<Measurement | undefined> {
      const elements = Array.from(document.querySelectorAll("body *")).concat(document.body);
      const measurements: Array<Measurement> = [];

      const observerPromises = elements.map(element => {
        return new Promise<void>(resolve => {
          const observer = new IntersectionObserver(
            entries => {
              for (const entry of entries) {
                const rect = entry.boundingClientRect;
                const area = rect.width * rect.height;
                const visibleArea = area * entry.intersectionRatio;

                const backgroundColor = window.getComputedStyle(entry.target).backgroundColor;
                const opacity = window.getComputedStyle(entry.target).opacity;

                const rgb = backgroundColor.match(/\d+/g) ?? [0, 0, 0, 0];
                const rgba = rgb.map(Number) as [number, number, number, number];

                const alphaIsZero = rgba[3] === 0;
                const isTransparent = alphaIsZero || opacity === "0";

                if (isTransparent || visibleArea === 0) {
                  continue;
                }

                const measure: Measurement = {
                  element: entry.target,
                  ratio: entry.intersectionRatio,
                  area: visibleArea,
                  rgba,
                };
                console.log(measure);
                measurements.push(measure);
              }
              observer.disconnect();
              resolve();
            },
            { threshold: [0, 0.25, 0.5, 0.75, 1.0] },
          );

          observer.observe(element);
        });
      });

      await Promise.all(observerPromises);

      // Sort by visible area
      measurements.sort((a, b) => b.area - a.area);

      return measurements[0];
    }

    const measure = await findMostSignificantElement();
    if (measure === undefined) {
      return;
    }

    const [r, g, b] = measure.rgba.map(Number);

    // Calculate relative luminance (perceived brightness)
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    console.log("luminance", measure, luminance);

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
