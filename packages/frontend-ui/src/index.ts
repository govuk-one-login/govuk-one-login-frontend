/* eslint-disable @typescript-eslint/no-require-imports */

import i18next from "i18next";
import path from 'path';

export const loadFrontendUiTranslations = () => {
  const nodeModules = (modulePath: string) =>
    `${path.resolve(__dirname, "../../../node_modules/", modulePath)}`;
  
  const nodeModuleLocalesPath = path.join(
    nodeModules("@govuk-one-login/frontend-ui/components/cookie-banner/locales"),
  );

  console.log(__dirname);
  
  i18next.addResourceBundle(
    "en",
    "translation",
    require(
      path.join(path.join(nodeModuleLocalesPath, "en", `translation.json`)),
    ),
    true,
    false,
  );
  
  i18next.addResourceBundle(
    "cy",
    "translation",
    require(
      path.join(path.join(nodeModuleLocalesPath, "cy", `translation.json`)),
    ),
    true,
    false,
  );
};
