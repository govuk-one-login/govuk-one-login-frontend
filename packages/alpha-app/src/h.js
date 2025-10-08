export function h(type, props, ...children) {
  const el = document.createElement(type);
  for (const key in props) {
    if (key === "className") el.className = props[key];
    else if (key === "style" && typeof props[key] === "object")
      Object.assign(el.style, props[key]);
    else if (key.startsWith("on") && typeof props[key] === "function")
      el[key.toLowerCase()] = props[key];
    else if (key !== "children") el.setAttribute(key, props[key]);
  }
  children.flat().forEach((child) => {
    if (child == null) return;
    if (typeof child === "string" || typeof child === "number")
      el.appendChild(document.createTextNode(child));
    else el.appendChild(child);
  });
  return el;
}
