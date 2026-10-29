import logger from "loglevel";
import type { PageViewParametersInterface } from "../../analytics/pageViewTracker/pageViewTracker.interface";
import { getTaxonomy, setTaxonomies } from "./taxonomyUtils";

const PERSISTED = "persisted from previous page";

const getParameters = (
  override: Partial<PageViewParametersInterface> = {},
): PageViewParametersInterface => ({
  statusCode: 200,
  englishPageTitle: "home",
  taxonomy_level1: "taxo1",
  taxonomy_level2: "taxo2",
  taxonomy_level3: "taxo3",
  taxonomy_level4: "taxo4",
  taxonomy_level5: "taxo5",
  content_id: "<e4a3603d-2d3c-4ff1-9b80-d72c1e6b7a58>",
  logged_in_status: true,
  dynamic: true,
  ...override,
});

describe("taxonomyUtils", () => {
  const originalLocalStorage = window.localStorage;

  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    // Restore the real localStorage in case a test replaced it.
    Object.defineProperty(window, "localStorage", {
      configurable: true,
      value: originalLocalStorage,
    });
  });

  describe("when localStorage is available", () => {
    test("setTaxonomies writes non-persisted taxonomy values", () => {
      setTaxonomies(getParameters());

      expect(localStorage.getItem("taxonomy_level2")).toBe("taxo2");
      expect(localStorage.getItem("taxonomy_level3")).toBe("taxo3");
      expect(localStorage.getItem("taxonomy_level4")).toBe("taxo4");
      expect(localStorage.getItem("taxonomy_level5")).toBe("taxo5");
    });

    test("setTaxonomies does not overwrite with 'persisted from previous page'", () => {
      setTaxonomies(getParameters());
      setTaxonomies(getParameters({ taxonomy_level2: PERSISTED }));

      expect(localStorage.getItem("taxonomy_level2")).toBe("taxo2");
    });

    test("getTaxonomy returns the stored value for a persisted level", () => {
      setTaxonomies(getParameters());

      expect(getTaxonomy(PERSISTED, "Level2")).toBe("taxo2");
    });

    test("getTaxonomy returns the passed value when not persisted", () => {
      expect(getTaxonomy("taxo2", "Level2")).toBe("taxo2");
    });

    test("getTaxonomy falls back when the persisted value was never stored", () => {
      expect(getTaxonomy(PERSISTED, "Level2")).toBe(PERSISTED);
    });
  });

  describe("when window.localStorage is null", () => {
    beforeEach(() => {
      Object.defineProperty(window, "localStorage", {
        configurable: true,
        value: null,
      });
    });

    test("setTaxonomies does not throw and logs a warning", () => {
      const warnSpy = vi.spyOn(logger, "warn").mockImplementation(() => {});

      expect(() => setTaxonomies(getParameters())).not.toThrow();
      expect(warnSpy).toHaveBeenCalledTimes(1);
    });

    test("getTaxonomy returns the persisted literal and logs a warning", () => {
      const warnSpy = vi.spyOn(logger, "warn").mockImplementation(() => {});

      let result: string | undefined;
      expect(() => {
        result = getTaxonomy(PERSISTED, "Level2");
      }).not.toThrow();

      expect(result).toBe(PERSISTED);
      expect(warnSpy).toHaveBeenCalledTimes(1);
    });

    test("getTaxonomy still returns a non-persisted value without touching storage", () => {
      expect(getTaxonomy("taxo2", "Level2")).toBe("taxo2");
    });
  });

  describe("when localStorage access throws (e.g. Safari private mode)", () => {
    beforeEach(() => {
      const throwingStorage = {
        getItem: () => {
          throw new DOMException("denied", "SecurityError");
        },
        setItem: () => {
          throw new DOMException("denied", "SecurityError");
        },
        removeItem: () => {
          throw new DOMException("denied", "SecurityError");
        },
        clear: () => {},
        key: () => null,
        length: 0,
      };
      Object.defineProperty(window, "localStorage", {
        configurable: true,
        value: throwingStorage,
      });
    });

    test("setTaxonomies does not throw and logs a warning", () => {
      const warnSpy = vi.spyOn(logger, "warn").mockImplementation(() => {});

      expect(() => setTaxonomies(getParameters())).not.toThrow();
      expect(warnSpy).toHaveBeenCalledTimes(1);
    });

    test("getTaxonomy returns the persisted literal and logs a warning", () => {
      const warnSpy = vi.spyOn(logger, "warn").mockImplementation(() => {});

      expect(getTaxonomy(PERSISTED, "Level2")).toBe(PERSISTED);
      expect(warnSpy).toHaveBeenCalledTimes(1);
    });
  });
});
