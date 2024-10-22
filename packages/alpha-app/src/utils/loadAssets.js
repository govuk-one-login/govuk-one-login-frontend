// to be moved out to package
// switch to typescript and es6 import
// create roll up - done
// got running on alpha app ok, now to export into own

const fg = require("fast-glob");
// const path = require("path");

function loadAssets(app, assetPath, hashBetween = { start: "-", end: "." }) {
  const assets = fg.sync(assetPath);
  const pathsAndFiles = assets.map((asset) => {
    const pathParts = asset.split("/");
    const hashedFileName = pathParts[pathParts.length - 1];
    const fileName = hashedFileName.split(hashBetween.start)[0];
    const hashedExtension = hashedFileName.split(hashBetween.start)[1];
    const extension = hashedExtension.substring(
      hashedExtension.indexOf(hashBetween.end) + 1,
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
}

module.exports = {
  loadAssets,
};
