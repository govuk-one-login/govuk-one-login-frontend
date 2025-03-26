import { ComponentInterface } from "../index";

export function screenDetails(): Promise<ComponentInterface> {
  return Promise.resolve({
    is_touchscreen: navigator.maxTouchPoints > 0,
    maxTouchPoints: navigator.maxTouchPoints,
    colorDepth: screen.colorDepth,
    mediaMatches: matchMedias(),
  });
}

function matchMedias(): string[] {
  const results: string[] = [];

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_media_queries/Using_media_queries
   */

  const mediaQueries: { [k: string]: string[] } = {
    "prefers-contrast": [
      "high",
      "more",
      "low",
      "less",
      "forced",
      "no-preference",
    ],
    "any-hover": ["hover", "none"],
    "any-pointer": ["none", "coarse", "fine"],
    pointer: ["none", "coarse", "fine"],
    hover: ["hover", "none"],
    update: ["fast", "slow"],
    "inverted-colors": ["inverted", "none"],
    "prefers-reduced-motion": ["reduce", "no-preference"],
    "prefers-reduced-transparency": ["reduce", "no-preference"],
    scripting: ["none", "initial-only", "enabled"],
    "forced-colors": ["active", "none"],
  };

  Object.keys(mediaQueries).forEach((key) => {
    mediaQueries[key].forEach((value) => {
      if (matchMedia(`(${key}: ${value})`).matches)
        results.push(`${key}: ${value}`);
    });
  });
  return results;
}
