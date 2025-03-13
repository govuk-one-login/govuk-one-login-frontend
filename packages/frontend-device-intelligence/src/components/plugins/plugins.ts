import { componentInterface, includeComponent } from "../../factory";

export default function getInstalledPlugins(): Promise<componentInterface> {
  return Promise.resolve({
    plugins: [],
  });
}

includeComponent("plugins", getInstalledPlugins);
