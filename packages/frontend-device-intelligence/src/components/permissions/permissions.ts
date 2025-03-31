import { ComponentInterface } from "../index";
import { mostFrequentValuesInArrayOfDictionaries } from "../../utils/getMostFrequent";

function getPermissionKeys(): PermissionName[] {
  return [
    "accelerometer",
    "accessibility",
    "accessibility-events",
    "ambient-light-sensor",
    "background-fetch",
    "background-sync",
    "bluetooth",
    "camera",
    "clipboard-read",
    "clipboard-write",
    "device-info",
    "display-capture",
    "gyroscope",
    "geolocation",
    "local-fonts",
    "magnetometer",
    "microphone",
    "midi",
    "nfc",
    "notifications",
    "payment-handler",
    "persistent-storage",
    "push",
    "speaker",
    "storage-access",
    "top-level-storage-access",
    "window-management",
    "query",
  ] as PermissionName[];
}

export async function getBrowserPermissions(): Promise<ComponentInterface> {
  const permissionKeys = getPermissionKeys();
  const permissionPromises: Promise<ComponentInterface>[] = Array.from(
    { length: 3 },
    () => getBrowserPermissionsOnce(permissionKeys),
  );
  return Promise.all(permissionPromises).then((resolvedPermissions) => {
    const permission = mostFrequentValuesInArrayOfDictionaries(
      resolvedPermissions,
      permissionKeys,
    );
    return permission;
  });
}

async function getBrowserPermissionsOnce(
  permissionKeys: PermissionName[],
): Promise<ComponentInterface> {
  const permissionStatus: { [key: string]: string } = {};

  for (const feature of permissionKeys) {
    try {
      // Request permission status for each feature
      const status = await navigator.permissions.query({ name: feature });

      // Assign permission status to the object
      permissionStatus[feature] = status.state.toString();
      // eslint-disable-next-line
    } catch (error) {
      // In case of errors (unsupported features, etc.), do nothing. Not listing them is the same as not supported
    }
  }

  return permissionStatus;
}
