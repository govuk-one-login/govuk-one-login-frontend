(function () {
  'use strict';

  function MyComponent(props) {
    return (
      h('div', null, [
        h('h1', null, ["Hello, ", props.name, "!"]),
        h('p', null, [props.children])
      ])
    );
  }

  let document;
  // Create a dummy element to render into (like React's ReactDOM.render)
  const root = document.getElementById("root");

  // A very basic way to render. For real apps, consider a more robust solution.
  function render(element, container) {
    container.innerHTML = ""; // Clear previous content
    container.appendChild(element);
  }

  const myElement = document.createElement("div");
  myElement.textContent = "";

  // Render the component
  const componentInstance = MyComponent({
    name: "World",
    children: "This is a JSX component without React!",
  });
  render(componentInstance, root);

})();
