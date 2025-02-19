import { FormField } from "../../../utils/formUtils/formTracker.interface";
import {
  isFormValid,
  combineDateFields,
  isDateFields,
  isExcludedType,
  getFieldValue,
  getFormFields,
} from "./formResponseTracker.utils";

describe("isFormValid", () => {
  let fields: FormField[];
  beforeEach(() => {
    // Remove any existing elements from document.body if needed
    fields = null as unknown as FormField[];
  });

  test("isFormValid should return false if field value is empty", () => {
    fields = [{ id: "test", name: "test", value: "", type: "textarea" }];
    expect(isFormValid(fields)).toBe(false);
  });

  test("isFormValid should return true if field value is here", () => {
    fields = [
      { id: "test", name: "test", value: "testtest", type: "textarea" },
    ];
    expect(isFormValid(fields)).toBe(true);
  });

  test("isFormValid should return false if one of the field value is empty", () => {
    fields = [
      { id: "test", name: "test", value: "", type: "textarea" },
      { id: "test2", name: "test2", value: "test2", type: "checkbox" },
    ];
    expect(isFormValid(fields)).toBe(false);
  });

  test("isFormValid should return true if all field values are here", () => {
    fields = [
      { id: "test", name: "test", value: "test1", type: "textarea" },
      { id: "test2", name: "test2", value: "test2", type: "checkbox" },
    ];
    expect(isFormValid(fields)).toBe(true);
  });
});

describe("combineDateFields", () => {
  test("combineDateFields should return 1 specific formField from date fields", () => {
    const formFields: FormField[] = [
      {
        id: "fieldId-day",
        name: "fieldId-day",
        value: "01",
        type: "text",
      },
      {
        id: "fieldId-month",
        name: "fieldId-month",
        value: "01",
        type: "text",
      },
      {
        id: "fieldId-year",
        name: "fieldId-year",
        value: "2000",
        type: "text",
      },
    ];

    const result: FormField[] = [
      {
        id: "fieldId-day",
        name: "fieldId",
        value: "01-01-2000",
        type: "date",
      },
    ];
    expect(combineDateFields(formFields)).toStrictEqual(result);
  });

  test("combineDateFields should return 2 formFields from date fields", () => {
    const formFields: FormField[] = [
      {
        id: "fieldId-day",
        name: "fieldId-day",
        value: "01",
        type: "text",
      },
      {
        id: "fieldId-month",
        name: "fieldId-month",
        value: "01",
        type: "text",
      },
      {
        id: "fieldId-year",
        name: "fieldId-year",
        value: "2000",
        type: "text",
      },
      {
        id: "fieldId2-day",
        name: "fieldId2-day",
        value: "02",
        type: "text",
      },
      {
        id: "fieldId2-month",
        name: "fieldId2-month",
        value: "02",
        type: "text",
      },
      {
        id: "fieldId2-year",
        name: "fieldId2-year",
        value: "2002",
        type: "text",
      },
    ];

    const result: FormField[] = [
      {
        id: "fieldId-day",
        name: "fieldId",
        value: "01-01-2000",
        type: "date",
      },
      {
        id: "fieldId2-day",
        name: "fieldId2",
        value: "02-02-2002",
        type: "date",
      },
    ];
    expect(combineDateFields(formFields)).toStrictEqual(result);
  });
});

describe("isDateFields", () => {
  test("isDateFields should return true if date fields are present", () => {
    const formFields: FormField[] = [
      {
        id: "fieldId-day",
        name: "fieldId-day",
        value: "01",
        type: "text",
      },
      {
        id: "fieldId-month",
        name: "fieldId-month",
        value: "01",
        type: "text",
      },
      {
        id: "fieldId-year",
        name: "fieldId-year",
        value: "2000",
        type: "text",
      },
    ];
    expect(isDateFields(formFields)).toBe(true);
  });

  test("isDateFields should return true if date fields are present", () => {
    const formFields: FormField[] = [
      {
        id: "fieldId-day",
        name: "fieldId-day",
        value: "01",
        type: "text",
      },
      {
        id: "fieldId-month",
        name: "fieldId-month",
        value: "01",
        type: "text",
      },
      {
        id: "fieldId-year",
        name: "fieldId-year",
        value: "2000",
        type: "text",
      },
      {
        id: "fieldname",
        name: "fieldname",
        value: "myname",
        type: "text",
      },
      {
        id: "fieldId2-day",
        name: "fieldId2-day",
        value: "01",
        type: "text",
      },
      {
        id: "fieldId2-month",
        name: "fieldId2-month",
        value: "01",
        type: "text",
      },
      {
        id: "fieldId2-year",
        name: "fieldId2-year",
        value: "2000",
        type: "text",
      },
    ];
    expect(isDateFields(formFields)).toBe(true);
  });

  test("isDateFields should return false if date fields are not present", () => {
    const formFields: FormField[] = [
      {
        id: "fieldId",
        name: "fieldId",
        value: "test",
        type: "text",
      },
    ];
    expect(isDateFields(formFields)).toBe(false);
  });
});

// getElementValue Tests PASS
// describe("getElementValue", () => {
//   const htmlInputElement: HTMLInputElement = document.createElement("input");
//   const htmlLabelElement: HTMLLabelElement = document.createElement("label");

//   beforeEach(() => {
//     document.body.appendChild(htmlInputElement);
//   });

//   test("getElementValue should return trimmed label text content", () => {
//     htmlInputElement.setAttribute("id", "inputId");
//     htmlLabelElement.setAttribute("for", "inputId");
//     htmlLabelElement.textContent = "Test Label";
//     document.body.appendChild(htmlLabelElement);

//     const result = getElementValue(htmlInputElement);
//     expect(result).toBe("Test Label");
//   });

//   test("getElementValue should return 'undefined' for a non-existing label", () => {
//     const result = getElementValue(htmlInputElement);
//     expect(result).toBe("undefined");
//   });
// });

// processCheckbox Tests PASS
// describe("processCheckbox", () => {
//   const htmlCheckboxElement: HTMLInputElement =
//     document.createElement("input");
//   const htmlLabelElement: HTMLLabelElement = document.createElement("label");
//   const htmlCheckboxElement2: HTMLInputElement =
//     document.createElement("input");
//   const htmlLabelElement2: HTMLLabelElement = document.createElement("label");
//   const formFields: FormField[] = [];

//   beforeEach(() => {
//     document.body.appendChild(htmlCheckboxElement);
//     document.body.appendChild(htmlLabelElement);
//   });

//   afterEach(() => {
//     formFields.length = 0;
//   });

//   test("processCheckbox should add checkbox to selected fields", () => {
//     htmlCheckboxElement.setAttribute("id", "checkboxId");
//     htmlCheckboxElement.setAttribute("name", "checkboxName");
//     htmlCheckboxElement.setAttribute("type", "checkbox");
//     htmlCheckboxElement.setAttribute("checked", "true");

//     // Create a label and associate it with the checkbox
//     htmlLabelElement.setAttribute("for", "checkboxId");
//     htmlLabelElement.textContent = "checkbox label";

//     processCheckbox(htmlCheckboxElement, formFields);
//     expect(formFields).toEqual([
//       {
//         id: "checkboxId",
//         name: "checkboxName",
//         value: "checkbox label",
//         type: "checkbox",
//       },
//     ]);
//   });

//   test("processCheckbox should add only selected checkbox to selected fields", () => {
//     htmlCheckboxElement.setAttribute("id", "checkboxId");
//     htmlCheckboxElement.setAttribute("name", "checkboxName");
//     htmlCheckboxElement.setAttribute("type", "checkbox");
//     htmlCheckboxElement.setAttribute("checked", "true");

//     // Create a label and associate it with the checkbox
//     htmlLabelElement.setAttribute("for", "checkboxId");
//     htmlLabelElement.textContent = "checkbox label";

//     htmlCheckboxElement2.id = "checkboxId2";
//     htmlCheckboxElement2.name = "checkboxName2";
//     htmlCheckboxElement2.type = "checkbox";

//     // Create a label and associate it with the checkbox
//     htmlLabelElement2.setAttribute("for", "checkboxId2");
//     htmlLabelElement2.textContent = "checkbox2 label";

//     document.body.appendChild(htmlCheckboxElement2);
//     document.body.appendChild(htmlLabelElement2);

//     processCheckbox(htmlCheckboxElement, formFields);
//     expect(formFields).toEqual([
//       {
//         id: "checkboxId",
//         name: "checkboxName",
//         value: "checkbox label",
//         type: "checkbox",
//       },
//     ]);
//   });

//   test("processCheckbox should return the values of checkboxes which are part of the same group as a string separated by commas", () => {
//     htmlCheckboxElement.id = "checkboxId";
//     htmlCheckboxElement.name = "checkboxName";
//     htmlCheckboxElement.type = "checkbox";
//     htmlCheckboxElement.checked = true;

//     htmlCheckboxElement2.id = "secondCheckboxId";
//     htmlCheckboxElement2.name = "checkboxName";
//     htmlCheckboxElement2.type = "checkbox";
//     htmlCheckboxElement2.checked = true;

//     // Create a label and associate it with the checkbox1
//     htmlLabelElement.setAttribute("for", "checkboxId");
//     htmlLabelElement.textContent = "checkbox1 label";

//     // Create a label and associate it with the checkbox2
//     htmlLabelElement2.setAttribute("for", "secondCheckboxId");
//     htmlLabelElement2.textContent = "checkbox2 label";

//     document.body.appendChild(htmlCheckboxElement2);
//     document.body.appendChild(htmlLabelElement2);

//     processCheckbox(htmlCheckboxElement, formFields);
//     processCheckbox(htmlCheckboxElement2, formFields);
//     expect(formFields).toEqual([
//       {
//         id: "checkboxId",
//         name: "checkboxName",
//         value: "checkbox1 label, checkbox2 label",
//         type: "checkbox",
//       },
//     ]);
//   });
// });

// // processRadio Tests PASS
// describe("processRadio", () => {
//   test("processRadio should add radio button to selected fields", () => {
//     const formFields: FormField[] = [];
//     const element: HTMLInputElement = document.createElement("input");
//     element.id = "radioId";
//     element.name = "radioName";
//     element.type = "radio";
//     element.checked = true;

//     // Create a label and associate it with the radio
//     const label: HTMLLabelElement = document.createElement("label");
//     label.setAttribute("for", "radioId");
//     label.textContent = "radio label";

//     document.body.appendChild(element);
//     document.body.appendChild(label);

//     processCheckbox(element, formFields);

//     expect(formFields).toEqual([
//       {
//         id: "radioId",
//         name: "radioName",
//         value: "radio label",
//         type: "radio",
//       },
//     ]);
//   });
// });

// // processTextElement Tests PASS
// describe("processTextElement", () => {
//   const formFields: FormField[] = [];
//   let element: HTMLInputElement | HTMLTextAreaElement;

//   afterEach(() => {
//     document.body.removeChild(element);
//     formFields.length = 0;
//   });

//   test("processTextElement should add text input to selected fields", () => {
//     element = document.createElement("input") as HTMLInputElement;
//     element.id = "textId";
//     element.name = "textName";
//     element.type = "text";
//     element.value = "text value";

//     document.body.appendChild(element);

//     processTextElement(element, formFields);

//     expect(formFields).toEqual([
//       {
//         id: "textId",
//         name: "textName",
//         value: "text value",
//         type: "text",
//       },
//     ]);
//   });

//   test("processTextElement should add textarea to selected fields", () => {
//     element = document.createElement("textarea") as HTMLTextAreaElement;
//     element.id = "textareaId";
//     element.name = "textareaName";
//     element.value = "textarea value";

//     document.body.appendChild(element);

//     processTextElement(element, formFields);

//     expect(formFields).toEqual([
//       {
//         id: "textareaId",
//         name: "textareaName",
//         value: "textarea value",
//         type: "textarea",
//       },
//     ]);
//   });
// });

// // processSelectOne Tests PASS
// describe("processSelectOne", () => {
//   test("processSelectOne should add select-one element to selected fields", () => {
//     const element: HTMLSelectElement = document.createElement("select");
//     element.id = "selectId";
//     element.name = "selectName";
//     element.setAttribute("select-one", "");

//     const formFields: FormField[] = [];

//     // Create and append option elements
//     const option1 = document.createElement("option");
//     option1.text = "Option 1";
//     element.add(option1);

//     const option2 = document.createElement("option");
//     option2.text = "Option 2";
//     element.add(option2);

//     document.body.appendChild(element);

//     // Set selectedIndex
//     element.selectedIndex = 1;

//     processSelectOne(element, formFields);

//     expect(formFields).toEqual([
//       {
//         id: "selectId",
//         name: "selectName",
//         value: "Option 2",
//         type: "select-one",
//       },
//     ]);
//   });
// });

// isExcludedType Tests PASS
describe("isExcludedType", () => {
  let htmlInputElement: HTMLInputElement = document.createElement("input");

  test("isExcludedType should return true for hidden input type", () => {
    htmlInputElement = { type: "hidden" } as HTMLInputElement;
    const result = isExcludedType(htmlInputElement);
    expect(result).toBe(true);
  });
  test("isExcludedType should return true for submit input type", () => {
    htmlInputElement = { type: "submit" } as HTMLInputElement;
    const result = isExcludedType(htmlInputElement);
    expect(result).toBe(true);
  });
  test("isExcludedType should return true for button type", () => {
    htmlInputElement = { type: "button" } as HTMLInputElement;
    const result = isExcludedType(htmlInputElement);
    expect(result).toBe(true);
  });
  test("isExcludedType should return true for fieldset input type", () => {
    htmlInputElement = { type: "fieldset" } as HTMLInputElement;
    const result = isExcludedType(htmlInputElement);
    expect(result).toBe(true);
  });
  test("isExcludedType should return false for other input types", () => {
    htmlInputElement = { type: "text" } as HTMLInputElement;
    const result = isExcludedType(htmlInputElement);
    expect(result).toBe(false);
  });
});

// getFormFields Tests PASS
describe("getFormFields", () => {
  const form: HTMLFormElement = document.createElement("form");

  beforeEach(() => {
    document.body.appendChild(form);
  });

  test("getFormFields should return a list of fields objects", () => {
    form.innerHTML =
      '<input id="text" name="text" value="text value" type="text"/>' +
      ' <label for="checkbox">checkbox value</label>' +
      '<input id="checkbox" name="checkbox" value="checkbox value" type="checkbox" checked/>' +
      '<label for="selectField">Select Field:</label>' +
      '<select id="selectField" name="selectField">' +
      '  <option value="Option 1">Option 1</option>' +
      '  <option value="Option 2" selected>Option 2</option>' +
      "</select>";
    expect(getFormFields(form)).toEqual([
      {
        id: "text",
        name: "text",
        value: "text value",
        type: "text",
      },
      {
        id: "checkbox",
        name: "checkbox",
        value: "checkbox value",
        type: "checkbox",
      },
      {
        id: "selectField",
        name: "selectField",
        value: "Option 2",
        type: "select-one",
      },
    ]);
  });

  test("getFormFields should return checkbox values as string , separated by commas if part of checkbox group", () => {
    form.innerHTML =
      ' <label for="test">test value</label>' +
      '<input id="test" name="test" value="test value" type="checkbox" checked/>' +
      ' <label for="test1">test value2</label>' +
      '<input id="test1" name="test" value="test value2" type="checkbox" checked/>';
    expect(getFormFields(form)).toEqual([
      {
        id: "test",
        name: "test",
        value: "test value, test value2",
        type: "checkbox",
      },
    ]);
  });
});

describe("getFieldValue", () => {
  test("getFieldValue should return field value", () => {
    const fields: FormField[] = [
      { id: "test", name: "test", value: "test value", type: "checkbox" },
    ];
    expect(getFieldValue(fields)).toBe("test value");
  });

  test("getFieldValue should return empty value if type is text", () => {
    const fields: FormField[] = [
      { id: "test", name: "test", value: "test value", type: "text" },
    ];
    expect(getFieldValue(fields)).toBe("");
  });

  test("getFieldValue should return empty value if type is textarea", () => {
    const fields: FormField[] = [
      { id: "test", name: "test", value: "test value", type: "textarea" },
    ];
    expect(getFieldValue(fields)).toBe("");
  });
});
