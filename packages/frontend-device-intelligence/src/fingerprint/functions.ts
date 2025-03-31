import {
  type ComponentInterface,
  getComponentPromises,
} from "../components/index";
import { hash } from "../utils/hash";
import { raceAll } from "../utils/raceAll";
import { getFontMetrics } from "../components/fonts/fonts";

const timeoutInstance: ComponentInterface = {
  timeout: "true",
};

export async function getFingerprintData(): Promise<ComponentInterface> {
  const promiseMap: Record<
    string,
    Promise<ComponentInterface>
  > = getComponentPromises();
  const keys: string[] = Object.keys(promiseMap);
  const promises: Promise<ComponentInterface>[] = Object.values(promiseMap);
  const resolvedValues: (ComponentInterface | undefined)[] = await raceAll(
    promises,
    1000,
    timeoutInstance,
  );
  const validValues: ComponentInterface[] = resolvedValues.filter(
    (value): value is ComponentInterface => value !== undefined,
  );
  const resolvedComponents: Record<string, ComponentInterface> = {};
  validValues.forEach((value, index) => {
    resolvedComponents[keys[index]] = value;
  });

  const deviceHash = hash(JSON.stringify(resolvedComponents));
  resolvedComponents.thumbmark = { deviceHash };

  try {
    const { fontHash } = await getFontMetrics();
    resolvedComponents.fonts = { fontHash };
  } catch (error) {
    console.error("Error Retrieving the font hash:", error);
  }

  return filterFingerprintData(resolvedComponents, [], [], "");
}

/**
 * This function filters the fingerprint data based on the exclude and include list
 * @param {ComponentInterface} obj - components objects from main ComponentInterface
 * @param {string[]} excludeList - elements to exclude from components objects (e.g : 'canvas', 'system.browser')
 * @param {string[]} includeList - elements to only include from components objects (e.g : 'canvas', 'system.browser')
 * @param {string} path - auto-increment path iterating on key objects from components objects
 * @returns {ComponentInterface} result - returns the final object before hashing in order to get fingerprint
 */
export function filterFingerprintData(
  obj: ComponentInterface,
  excludeList: string[],
  includeList: string[],
  path: string = "",
): ComponentInterface {
  const result: ComponentInterface = {};

  for (const [key, value] of Object.entries(obj)) {
    const currentPath = path + key + ".";

    if (typeof value === "object" && !Array.isArray(value)) {
      const filtered = filterFingerprintData(
        value,
        excludeList,
        includeList,
        currentPath,
      );
      if (Object.keys(filtered).length > 0) {
        result[key] = filtered;
      }
    } else {
      const isExcluded = excludeList.some((exclusion) =>
        currentPath.startsWith(exclusion),
      );
      const isIncluded = includeList.some((inclusion) =>
        currentPath.startsWith(inclusion),
      );

      if (!isExcluded || isIncluded) {
        result[key] = value;
      }
    }
  }

  return result;
}

export async function getFingerprint(includeData?: false): Promise<string>;
export async function getFingerprint(
  includeData: true,
): Promise<{ hash: string; data: ComponentInterface }>;

export async function getFingerprint(
  includeData?: boolean,
): Promise<string | { hash: string; data: ComponentInterface }> {
  const fingerprintData = await getFingerprintData();
  const thisHash = hash(JSON.stringify(fingerprintData));
  if (includeData) {
    return { hash: thisHash.toString(), data: fingerprintData };
  } else {
    return thisHash.toString();
  }
}

export async function setFingerprintCookie(): Promise<void> {
  if (typeof window === "undefined") {
    console.warn("fingerprint cookie logic should only run on the client side");
    return;
  }

  try {
    const fingerprint = await getFingerprintData();
    const encodedFingerprint = btoa(JSON.stringify(fingerprint));
    document.cookie = `device_intelligence_fingerprint=${encodedFingerprint}; path=/; secure; SameSite=Strict`;
    console.log("Fingerprint cookie set:", encodedFingerprint);
  } catch (error) {
    console.error("Error setting fingerprint cookie:", error);
  }
}
