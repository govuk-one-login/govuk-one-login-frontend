import fg from 'fast-glob';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const loadAssets = (app: any, assetPath: string, hashBetween = { start: "-", end: "." }) => {
  const assets = fg.sync(assetPath);
  const pathsAndFiles = assets.map((asset) => {
    const pathParts = asset.split("/");
    const hashedFileName = pathParts[pathParts.length - 1];
    const fileName = hashedFileName.split(hashBetween.start)[0];
    const hashedExtension = hashedFileName.split(hashBetween.start)[1];
    const extension = hashedExtension.substring(
      hashedExtension.indexOf(hashBetween.end) + 1
    );
    return { hashedFileName, fileName: `${fileName}.${extension}` };
  });

  pathsAndFiles.forEach((pathAndFile) => {
    app.locals = app.locals || {};
    app.locals.assets = app.locals.assets || {};
    app.locals.assets[pathAndFile.fileName] = pathAndFile.hashedFileName;
  });
  // fail safe check to ensure non hashed names are still saved to object
  // check for double hashes, check stylesheet
};
