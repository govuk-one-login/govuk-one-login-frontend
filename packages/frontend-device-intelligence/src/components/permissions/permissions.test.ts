import { getBrowserPermissions } from "./permissions";

describe("permissions", () => {
  it("should fetch font data in the correct format", async () => {
    Object.defineProperty(global.navigator, "permissions", {
      writable: true,
      value: {
        query: jest.fn().mockImplementation(({ name }) => ({
          state: name === "push" ? "enabled" : "disabled",
        })),
      },
    });

    expect(await getBrowserPermissions()).toEqual({
      accelerometer: "disabled",
      accessibility: "disabled",
      "accessibility-events": "disabled",
      "ambient-light-sensor": "disabled",
      "background-fetch": "disabled",
      "background-sync": "disabled",
      bluetooth: "disabled",
      camera: "disabled",
      "clipboard-read": "disabled",
      "clipboard-write": "disabled",
      "device-info": "disabled",
      "display-capture": "disabled",
      gyroscope: "disabled",
      geolocation: "disabled",
      "local-fonts": "disabled",
      magnetometer: "disabled",
      microphone: "disabled",
      midi: "disabled",
      nfc: "disabled",
      notifications: "disabled",
      "payment-handler": "disabled",
      "persistent-storage": "disabled",
      push: "enabled",
      speaker: "disabled",
      "storage-access": "disabled",
      "top-level-storage-access": "disabled",
      "window-management": "disabled",
      query: "disabled",
    });
  });
});
