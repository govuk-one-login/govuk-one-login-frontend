import { parseAssets } from "../utils/utils";

describe("parseAssets", () => {
  const input = [
    "public/stylesheets/application-ifsdjkn.css",
    "public/stylesheets/stylesheet-dhkjsddf.css",
    "public/javascript/ua/init-hskdjf.js",
  ];

  const pathAndFiles = [
    {
      hashedFileName: "application-ifsdjkn.css",
      fileName: "application.css",
      hash: "ifsdjkn",
    },
    {
      hashedFileName: "stylesheet-dhkjsddf.css",
      fileName: "stylesheet.css",
      hash: "dhkjsddf",
    },
    {
      hashedFileName: "init-hskdjf.js",
      fileName: "init.js",
      hash: "hskdjf",
    },
  ];
  it("returns object with validHashName", () => {
    expect(parseAssets(input, { start: "-", end: "." })).toEqual(pathAndFiles);
  });

  it("parses path and files with invalid fileNames", () => {
    const inputWithTooManyIdentifiers = "fileName-WithManyHash-45sdfvsd.css";
    const tooManyIdentifiers = {
      hashedFileName: "fileName-WithManyHash-45sdfvsd.css",
      fileName: "fileName-WithManyHash-45sdfvsd.css",
    };

    expect(
      parseAssets([...input, inputWithTooManyIdentifiers], {
        start: "-",
        end: ".",
      }),
    ).toEqual([...pathAndFiles, tooManyIdentifiers]);
  });
});
