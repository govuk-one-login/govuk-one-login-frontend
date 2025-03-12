import { ComponentInterface } from "../index";

export function getInstalledPlugins(): Promise<ComponentInterface> {
  const plugins: string[] = [];

  if (navigator.plugins) {
    for (const plugin of navigator.plugins) {
      plugins.push(
        [plugin.name, plugin.filename, plugin.description].join("|"),
      );
    }
  }

  return Promise.resolve({ plugins });
}
