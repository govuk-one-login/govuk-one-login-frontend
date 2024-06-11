import { configureAxe } from "jest-axe";

// Configure Axe for accessibility testing
const axe = configureAxe({
  rules: {
    "color-contrast": { enabled: true },
    "skip-link": { enabled: true },
    "html-has-lang": { enabled: true },
    "link-name": { enabled: true },
  },
});

// Make Axe globally available for all tests
global.axe = axe;
