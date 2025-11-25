import express from "express";
import { Liquid } from "liquidjs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

const engine = new Liquid({
  root: path.resolve(__dirname, "views", "public/stylesheets"),
  extname: ".liquid",
});

app.engine("liquid", engine.express());
app.set("views", path.resolve(__dirname, "views"));

app.set("view engine", "liquid");
const stylesPath = path.join(__dirname, "..", "public/stylesheets");
app.use(express.static(stylesPath));

const scriptsPath = path.join(__dirname, "..", "public/javascript");
app.use(express.static(scriptsPath));
const publicPath = path.join(__dirname, "..");
console.log(`__dirname is: ${__dirname}`);
console.log(`Express is configured to look in: ${publicPath}`);

app.use(express.static(publicPath));

// app.use(express.static(path.resolve(__dirname, "public", )));
const myFlagBoolean =
  process.env.MY_FLAG && process.env.MY_FLAG.toLowerCase() === "true";
// --- Route ---
app.get("/", (req, res) => {
  // Renders the 'views/index.liquid' file
  res.render("index", {
    title: "Working Setup!",
    message: "This is rendering via LiquidJS.",
    myFlagBoolean: myFlagBoolean,
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
