import { ComponentInterface } from "../index";

type ExtendedNavigator = Navigator & { deviceMemory?: number };
type ExtendedPerformance = Performance & {
  memory?: {
    totalJSHeapSize: number;
    usedJSHeapSize: number;
    jsHeapSizeLimit: number;
  };
};

export function getHardwareInfo(): Promise<ComponentInterface> {
  return new Promise((resolve) => {
    const navigatorWithMemory: ExtendedNavigator =
      navigator as ExtendedNavigator;
    const deviceMemory = navigatorWithMemory.deviceMemory ?? 0;

    const extendedPerformance: ExtendedPerformance = window.performance;
    const memoryInfo =
      window.performance && extendedPerformance.memory
        ? extendedPerformance.memory
        : 0;
    resolve({
      videocard: getVideoCard(),
      architecture: getArchitecture(),
      deviceMemory: deviceMemory.toString() || "undefined",
      jsHeapSizeLimit: memoryInfo ? memoryInfo?.jsHeapSizeLimit : 0,
    });
  });
}

function getVideoCard(): ComponentInterface | string {
  const canvas = document.createElement("canvas");
  const gl =
    canvas.getContext("webgl") ?? canvas.getContext("experimental-webgl");

  if (!gl || !("getParameter" in gl)) {
    return "undefined";
  }

  const result = buildVideoCardInfo(gl);
  return addUnmaskedInfo(gl, result);
}

function buildVideoCardInfo(gl: WebGLRenderingContext): ComponentInterface {
  return {
    vendor: (gl.getParameter(gl.VENDOR) || "").toString(),
    renderer: (gl.getParameter(gl.RENDERER) || "").toString(),
    version: (gl.getParameter(gl.VERSION) || "").toString(),
    shadingLanguageVersion: (
      gl.getParameter(gl.SHADING_LANGUAGE_VERSION) || ""
    ).toString(),
  };
}

function addUnmaskedInfo(
  gl: WebGLRenderingContext,
  result: ComponentInterface,
): ComponentInterface {
  if (
    (typeof result.vendor === "string" && !result.vendor.length) ||
    (typeof result.renderer === "string" && !result.renderer.length)
  ) {
    const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
    if (debugInfo) {
      const vendorUnmasked = (
        gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) || ""
      ).toString();
      const rendererUnmasked = (
        gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || ""
      ).toString();

      if (vendorUnmasked) result.vendorUnmasked = vendorUnmasked;
      if (rendererUnmasked) result.rendererUnmasked = rendererUnmasked;
    }
  }
  return result;
}

function getArchitecture(): number {
  const f = new Float32Array(1);
  const u8 = new Uint8Array(f.buffer);
  f[0] = Infinity;
  f[0] = f[0] - f[0];

  return u8[3];
}
