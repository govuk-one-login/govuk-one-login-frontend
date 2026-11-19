import { defineConfig, mergeConfig } from "vitest/config";
import rootConfig from "../../vitest.config";

// Inherit shared settings (globals, jsdom, coverage, etc.) from the repo root config
export default mergeConfig(rootConfig, defineConfig({}));
