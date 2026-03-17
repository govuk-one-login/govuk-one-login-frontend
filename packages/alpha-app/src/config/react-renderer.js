/* eslint-disable @typescript-eslint/no-require-imports */
require("@babel/register")({
  extensions: [".jsx"],
  presets: ["@babel/preset-react"],
  cache: false,
});

const ReactDOMServer = require("react-dom/server");
const React = require("react");

const configureReact = (app) => {
  app.engine("jsx", (filePath, options, callback) => {
    try {
      delete require.cache[require.resolve(filePath)];
      const component = require(filePath);
      const Component = component.default || component;
      const html =
        "<!DOCTYPE html>" +
        ReactDOMServer.renderToStaticMarkup(
          React.createElement(Component, options),
        );
      callback(null, html);
    } catch (err) {
      callback(err);
    }
  });
  app.set("view engine", "jsx");
};

module.exports = { configureReact };
