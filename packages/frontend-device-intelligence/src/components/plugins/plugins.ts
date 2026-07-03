import { ComponentInterface } from "../index";

interface PluginInfo {
  name: string;
  filename: string;
  description: string;
}

export function getInstalledPlugins(): Promise<ComponentInterface> {
  const plugins: string[] = [];

  if (navigator.plugins) {
    for (const plugin of navigator.plugins) {
      const { name, filename, description } = plugin as unknown as PluginInfo;
      plugins.push([name, filename, description].join("|"));
    }
  }

  return Promise.resolve({ plugins });
}
