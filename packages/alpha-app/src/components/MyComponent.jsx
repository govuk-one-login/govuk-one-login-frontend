import { h } from "../h.js";
window.h = h;
globalThis.h = h;
function MyComponent(props) {
  return (
    <div>
      <h1>Hello, {props.name}!</h1>
      <p>{props.children}</p>
    </div>
  );
}

export default MyComponent;
