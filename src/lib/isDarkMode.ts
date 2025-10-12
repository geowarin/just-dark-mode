export function isDarkMode(): { isDark: boolean; confidence: number } {
  let darkScore = 0;
  let checks = 0;

  // Check 1: Media query preference
  if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    darkScore += 2; // Higher weight
  }
  checks += 2;

  // Check 2: Explicit classes/attributes
  const body = document.body;
  const html = document.documentElement;

  if (
    body.classList.contains("dark") ||
    body.classList.contains("dark-mode") ||
    html.classList.contains("dark") ||
    html.classList.contains("dark-mode") ||
    body.dataset.theme === "dark" ||
    html.dataset.theme === "dark"
  ) {
    darkScore += 2;
  }
  checks += 2;

  // Check 3: Background luminance
  const bodyBg = window.getComputedStyle(body).backgroundColor;
  const htmlBg = window.getComputedStyle(html).backgroundColor;

  const bodyLuminance = getLuminance(bodyBg);
  const htmlLuminance = getLuminance(htmlBg);
  const bgLuminance = Math.min(bodyLuminance, htmlLuminance);

  if (bgLuminance < 0.3) {
    darkScore += 1;
  } else if (bgLuminance < 0.5) {
    darkScore += 0.5;
  }
  checks += 1;

  // Check 4: Text color luminance
  const bodyColor = window.getComputedStyle(body).color;
  const textLuminance = getLuminance(bodyColor);

  if (textLuminance > 0.5) {
    darkScore += 1;
  }
  checks += 1;

  const confidence = darkScore / checks;
  return {
    isDark: confidence > 0.5,
    confidence,
  };
}

function getLuminance(color: string): number {
  // Parse RGB color
  const rgb = parseRGB(color);
  if (!rgb) return 1; // Default to light if unable to parse

  // Convert to relative luminance using WCAG formula
  const [r, g, b] = rgb.map(val => {
    const channel = val / 255;
    return channel <= 0.03928 ? channel / 12.92 : Math.pow((channel + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function parseRGB(color: string): [number, number, number] | null {
  // Handle rgba and rgb formats
  const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (match) {
    return [parseInt(match[1]), parseInt(match[2]), parseInt(match[3])];
  }

  // Handle transparent (treat as white background)
  if (color === "transparent" || color === "rgba(0, 0, 0, 0)") {
    return [255, 255, 255];
  }

  return null;
}
