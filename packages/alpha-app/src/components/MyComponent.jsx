import { h } from "..h.js";
let window;
window.h = h;
function MyComponent(props) {
  return (
    <div>
      <h1>Hello, {props.name}!</h1>
      <p>{props.children}</p>
    </div>
  );
}

export default MyComponent;
