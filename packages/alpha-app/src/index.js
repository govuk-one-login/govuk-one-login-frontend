import { h } from "./h.js";
window.h = h;
globalThis.h = h;

import MyComponent from "./components/MyComponent.jsx";

const root = document.getElementById("root");
const componentInstance = MyComponent({
  name: "World",
  children: "This is a JSX component without React!",
});
root.innerHTML = "";
root.appendChild(componentInstance);
