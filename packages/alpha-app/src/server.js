import express from "express";
import { Liquid } from "liquidjs";
import path from "path";

const app = express();
const port = 3000;

const engine = new Liquid({
  root: path.resolve(__dirname, "views"),
  extname: ".liquid",
});

app.engine("liquid", engine.express());
app.set("views", path.resolve(__dirname, "views"));
app.set("view engine", "liquid");

app.use(express.static(path.resolve(__dirname, "public")));

// --- Route ---
app.get("/", (req, res) => {
  // Renders the 'views/index.liquid' file
  res.render("index", {
    title: "Working Setup!",
    message: "This is rendering via LiquidJS.",
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
