import { FormField } from "./formTracker.interface";
import {
  getFormElement,
  getFieldType,
  FREE_TEXT_FIELD_TYPE,
  getSubmitUrl,
  getSectionValue,
} from "./formTrackerUtils";

window.DI = { analyticsGa4: { cookie: { consent: true } } };
describe("formTrackerUtils", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  // getFormElement Tests PASS
  describe("getFormElement", () => {
    test("getFormElement should return the form element", () => {
      const divElement = document.createElement("div");
      divElement.id = "main-content";
      const form = document.createElement("form");
      form.innerHTML =
        '<input id="text" name="text" value="text value" type="text"/>' +
        ' <label for="checkbox">checkbox value</label>' +
        '<input id="checkbox" name="checkbox" value="checkbox value" type="checkbox" checked/>' +
        '<label for="selectField">Select Field:</label>' +
        '<select id="selectField" name="selectField">' +
        '  <option value="Option 1">Option 1</option>' +
        '  <option value="Option 2" selected>Option 2</option>' +
        "</select>";
      divElement.appendChild(form);
      document.body.appendChild(divElement);
      expect(getFormElement()).toEqual(form);
    });
  });

  describe("getFieldType", () => {
    test("getFieldType should return free text field if type is text", () => {
      const fields: FormField[] = [
        { id: "test", name: "test", value: "test value", type: "text" },
      ];
      expect(getFieldType(fields)).toBe(FREE_TEXT_FIELD_TYPE);
    });

    test("getFieldType should return free text field if type is textarea", () => {
      const fields: FormField[] = [
        { id: "test", name: "test", value: "test value", type: "textarea" },
      ];
      expect(getFieldType(fields)).toBe(FREE_TEXT_FIELD_TYPE);
    });

    test("getFieldType should return drop-down list if type is select-one", () => {
      const fields: FormField[] = [
        { id: "test", name: "test", value: "test value", type: "select-one" },
      ];
      expect(getFieldType(fields)).toBe("drop-down list");
    });

    test("getFieldType should return checkbox if type is checkbox", () => {
      const fields: FormField[] = [
        { id: "test", name: "test", value: "test value", type: "checkbox" },
      ];
      expect(getFieldType(fields)).toBe("checkbox");
    });

    test("getFieldType should return radio buttons if type is radio", () => {
      const fields: FormField[] = [
        { id: "test", name: "test", value: "test value", type: "radio" },
      ];
      expect(getFieldType(fields)).toBe("radio buttons");
    });
  });

  describe("getSubmitUrl", () => {
    test("getSubmitUrl should return submit url", () => {
      const form = document.createElement("form");
      form.action = "/test-url";
      form.innerHTML =
        '<input id="test" name="test" value="test value" type="text"/>';
      document.body.appendChild(form);
      expect(getSubmitUrl(form)).toBe("http://localhost/test-url");
    });

    test("getSubmitUrl should return submit url with the query params also", () => {
      const form = document.createElement("form");
      form.action = "/test-url?edit=true";
      form.innerHTML =
        '<input id="test" name="test" value="test value" type="text"/>';
      document.body.appendChild(form);
      expect(getSubmitUrl(form)).toBe("http://localhost/test-url?edit=true");
    });
  });

  // describe("getHeadingText", () => {
  //   test("getHeadingText should return h1 content if it has a rel attribute matching commonId", () => {
  //     // create h1 with rel attribute

  //     const h1 = document.createElement("h1");
  //     h1.textContent = "H1 with rel attribute";
  //     h1.setAttribute("rel", "example");

  //     document.body.appendChild(h1);

  //     expect(getHeadingText("example_1")).toBe(
  //       "H1 with rel attribute",
  //     );
  //   });

  //   test("getHeadingText should return undefined if there is no h1/h2 with a rel attribute matching commonId", () => {
  //     // create h2
  //     const h2 = document.createElement("h2");
  //     document.body.appendChild(h2);

  //     expect(getHeadingText("example_1")).toBe("undefined");
  //   });
  // });

  describe("getSectionValue", () => {
    test("getSectionValue should return label text if field is not within a fieldset ", () => {
      const formField: FormField = {
        id: "fieldId",
        name: "fieldName",
        value: "fieldValue",
        type: "text",
      };

      // Create label and set for attribute

      const label = document.createElement("label");
      label.htmlFor = formField.id;
      label.textContent = "test label";
      document.body.appendChild(label);

      // Create input and set ID attribute to the same as label FOR attribute

      const input = document.createElement("input");
      input.id = formField.id;
      document.body.appendChild(input);
      expect(getSectionValue(formField)).toBe("test label");
    });
    test("getSectionValue returns legend text when input is inside a fieldset with legend , i.e radio", () => {
      const formField: FormField = {
        id: "fieldId",
        name: "fieldName",
        value: "fieldValue",
        type: "radio buttons",
      };
      // Create fieldset and legend
      const fieldset = document.createElement("fieldset");
      const legend = document.createElement("legend");
      legend.textContent = "test legend";
      fieldset.appendChild(legend);

      // Create radio and append to fieldset
      const input = document.createElement("input");
      input.type = "radio buttons";
      input.id = formField.id;
      fieldset.appendChild(input);

      // Append fieldset to the document body
      document.body.appendChild(fieldset);
      expect(getSectionValue(formField)).toBe("test legend");
    });
    test("getSectionValue should return undefined if there is no label or legend", () => {
      const formField: FormField = {
        id: "fieldId",
        name: "fieldName",
        value: "fieldValue",
        type: "text",
      };

      // Create input and set ID attribute to the same as label FOR attribute
      const input = document.createElement("input");
      input.id = formField.id;
      document.body.appendChild(input);
      expect(getSectionValue(formField)).toBe("undefined");
    });
    test("getSectionValue should return h1 with rel attribute matching element.id if there is a radio button without a legend", () => {
      const formField: FormField = {
        id: "fieldId",
        name: "fieldName",
        value: "fieldValue",
        type: "radio",
      };

      // Create radio and set ID attribute to the same as label FOR attribute
      const radio = document.createElement("input");
      radio.type = "radio";
      radio.id = formField.id;

      const label = document.createElement("label");
      label.htmlFor = formField.id; // Associates the label with the radio by matching their IDs
      label.textContent = "Your Label Text"; // Set the label text

      // Append the radio and label to the document
      document.body.appendChild(radio);
      document.body.appendChild(label);
      const h1 = document.createElement("h1");
      h1.textContent = "Hello, World!";
      h1.setAttribute("rel", formField.id);
      document.body.appendChild(h1);
      expect(getSectionValue(formField)).toBe("Hello, World!");
    });
    test("getSectionValue should return h1 with rel attribute matching element.id if there is a radio button without a legend, inside a fieldset", () => {
      const formField: FormField = {
        id: "fieldId-1",
        name: "fieldName",
        value: "fieldValue",
        type: "radio",
      };

      // Create radio and set ID attribute to the same as label FOR attribute
      const radio = document.createElement("input");
      radio.type = "radio";
      radio.id = formField.id;

      const label = document.createElement("label");
      label.htmlFor = formField.id; // Associates the label with the radio by matching their IDs
      label.textContent = "Your Label Text"; // Set the label text

      // Create fieldset element
      const fieldset = document.createElement("fieldset");

      // Append the radio and label to the fieldset
      fieldset.appendChild(radio);
      fieldset.appendChild(label);

      // Append the fieldset to the document
      document.body.appendChild(fieldset);
      const h1 = document.createElement("h1");
      h1.textContent = "Hello, World!";
      h1.setAttribute("rel", "fieldId");
      document.body.appendChild(h1);
      expect(getSectionValue(formField)).toBe("Hello, World!");
    });
    test("getSectionValue should return h2 with rel attribute matching element.id if there is a checkbox without a legend", () => {
      const formField: FormField = {
        id: "fieldId",
        name: "fieldName",
        value: "fieldValue",
        type: "checkbox",
      };

      // Create checkbox and set ID attribute to the same as label FOR attribute
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.id = formField.id;

      const label = document.createElement("label");
      label.htmlFor = formField.id; // Associates the label with the checkbox by matching their IDs
      label.textContent = "Your Label Text"; // Set the label text

      // Append the checkbox and label to the document
      document.body.appendChild(checkbox);
      document.body.appendChild(label);
      const h2 = document.createElement("h2");
      h2.textContent = "Hello, World!";
      h2.setAttribute("rel", formField.id);
      document.body.appendChild(h2);
      expect(getSectionValue(formField)).toBe("Hello, World!");
    });
    test("getSectionValue should return first h1, if there is a checkbox without a legend", () => {
      const formField: FormField = {
        id: "fieldId",
        name: "fieldName",
        value: "fieldValue",
        type: "checkbox",
      };

      // Create checkbox and set ID attribute to the same as label FOR attribute
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.id = formField.id;

      const label = document.createElement("label");
      label.htmlFor = formField.id; // Associates the label with the checkbox by matching their IDs
      label.textContent = "Your Label Text"; // Set the label text

      // Append the checkbox and label to the document
      document.body.appendChild(checkbox);
      document.body.appendChild(label);
      const h1 = document.createElement("h1");
      h1.textContent = "Hello, World!";
      document.body.appendChild(h1);
      const secondh1 = document.createElement("h1");
      secondh1.textContent = "Bye, World!";
      document.body.appendChild(secondh1);
      expect(getSectionValue(formField)).toBe("Hello, World!");
    });
    test("getSectionValue should return the FIRST h2 if there is a checkbox with a legend", () => {
      const formField: FormField = {
        id: "fieldId",
        name: "fieldName",
        value: "fieldValue",
        type: "checkbox",
      };

      // Create checkbox and set ID attribute to the same as label FOR attribute
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.id = formField.id;

      const label = document.createElement("label");
      label.htmlFor = formField.id; // Associates the label with the checkbox by matching their IDs
      label.textContent = "Your Label Text"; // Set the label text

      // Append the checkbox and label to the document
      document.body.appendChild(checkbox);
      document.body.appendChild(label);
      const h2 = document.createElement("h2");
      h2.textContent = "Hello, World!";
      document.body.appendChild(h2);
      const secondh2 = document.createElement("h2");
      secondh2.textContent = "Bye, World!";
      document.body.appendChild(secondh2);
      expect(getSectionValue(formField)).toBe("Hello, World!");
    });
    test("getSectionValue should return the FIRST h2 when there are radio buttons without a legend", () => {
      const formField: FormField = {
        id: "fieldId",
        name: "fieldName",
        value: "fieldValue",
        type: "radio",
      };

      // Create checkbox and set ID attribute to the same as label FOR attribute
      const radio = document.createElement("input");
      radio.type = "radio";
      radio.id = formField.id;

      const label = document.createElement("label");
      label.htmlFor = formField.id; // Associates the label with the checkbox by matching their IDs
      label.textContent = "Your Label Text"; // Set the label text

      // Append the radio buttons and label to the document
      document.body.appendChild(radio);
      document.body.appendChild(label);
      const h2 = document.createElement("h2");
      h2.setAttribute("rel", formField.id);
      h2.textContent = "Hello, World!";
      document.body.appendChild(h2);
      expect(getSectionValue(formField)).toBe("Hello, World!");
    });

    test("getSectionValue should return label when there is a dropdown with a label", () => {
      const formField: FormField = {
        id: "fieldId",
        name: "fieldName",
        value: "fieldValue",
        type: "dropdown",
      };

      // Create dropdown and set ID attribute to the same as label FOR attribute
      const dropdown = document.createElement("input");
      dropdown.type = "dropdown";
      dropdown.id = formField.id;

      const label = document.createElement("label");
      label.htmlFor = formField.id; // Associates the label with the dropdown by matching their IDs
      label.textContent = "Your Label Text"; // Set the label text

      // Append the dropdown and label to the document
      document.body.appendChild(dropdown);
      document.body.appendChild(label);

      expect(getSectionValue(formField)).toBe("Your Label Text");
    });
  });
});
