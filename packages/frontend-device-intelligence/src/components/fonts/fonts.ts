import { ComponentInterface } from "../index";
import { ephemeralIFrame } from "../../utils/ephemeralIFrame";
import { hash } from "../../utils/hash";
import logger from "../../logger";

const availableFonts = [
  "Arial",
  "Arial Black",
  "Arial Narrow",
  "Arial Rounded MT",
  "Arimo",
  "Archivo",
  "Barlow",
  "Bebas Neue",
  "Bitter",
  "Bookman",
  "Calibri",
  "Cabin",
  "Candara",
  "Century",
  "Century Gothic",
  "Comic Sans MS",
  "Constantia",
  "Courier",
  "Courier New",
  "Crimson Text",
  "DM Mono",
  "DM Sans",
  "DM Serif Display",
  "DM Serif Text",
  "Dosis",
  "Droid Sans",
  "Exo",
  "Fira Code",
  "Fira Sans",
  "Franklin Gothic Medium",
  "Garamond",
  "Geneva",
  "Georgia",
  "Gill Sans",
  "Helvetica",
  "Impact",
  "Inconsolata",
  "Indie Flower",
  "Inter",
  "Josefin Sans",
  "Karla",
  "Lato",
  "Lexend",
  "Lucida Bright",
  "Lucida Console",
  "Lucida Sans Unicode",
  "Manrope",
  "Merriweather",
  "Merriweather Sans",
  "Montserrat",
  "Myriad",
  "Noto Sans",
  "Nunito",
  "Nunito Sans",
  "Open Sans",
  "Optima",
  "Orbitron",
  "Oswald",
  "Pacifico",
  "Palatino",
  "Perpetua",
  "PT Sans",
  "PT Serif",
  "Poppins",
  "Prompt",
  "Public Sans",
  "Quicksand",
  "Rajdhani",
  "Recursive",
  "Roboto",
  "Roboto Condensed",
  "Rockwell",
  "Rubik",
  "Segoe Print",
  "Segoe Script",
  "Segoe UI",
  "Sora",
  "Source Sans Pro",
  "Space Mono",
  "Tahoma",
  "Taviraj",
  "Times",
  "Times New Roman",
  "Titillium Web",
  "Trebuchet MS",
  "Ubuntu",
  "Varela Round",
  "Verdana",
  "Work Sans",
];

export async function getFontMetrics(): Promise<ComponentInterface> {
  return new Promise((resolve) => {
    ephemeralIFrame(({ iframe }) => {
      const canvas = iframe.createElement("canvas");
      const ctx = canvas.getContext("2d");

      const baseFonts = ["monospaces", "sans serif", "serif"];

      const defaultWidths: number[] = baseFonts.map((font) => {
        return measureSingleFont(ctx, font);
      });

      const detectedFontResults: { [k: string]: number } = {};
      availableFonts.forEach((font) => {
        const fontWidth = measureSingleFont(ctx, font);
        if (!defaultWidths.includes(fontWidth))
          detectedFontResults[font] = fontWidth;
      });

      const fontHash = hash(JSON.stringify(detectedFontResults));

      resolve({ fontHash });
    }).catch((error) => {
      logger.error("error retrieving the font hash frame", error);
    });
  });
}

function measureSingleFont(
  ctx: CanvasRenderingContext2D | null,
  font: string,
): number {
  if (!ctx) {
    throw new Error("Canvas context not supported");
  }
  const text: string = "WwMmLli0Oo";
  ctx.font = `72px ${font}`;
  return ctx.measureText(text).width;
}
