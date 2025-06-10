/**
 * @jest-environment jsdom
 */

import { axe, toHaveNoViolations } from "jest-axe";
import { render } from "../../test/jestHelper";
expect.extend(toHaveNoViolations);

describe("Footer Component", () => {
  const mockParams = {
    translations: {
      footerNavItems: [
        { href: "/privacy", text: "Privacy" },
        { href: "/cookies", text: "Cookies" },
        { href: "/contact", text: "Contact" },
      ],
      contentLicence: {
        html: "All content is available under the Open Government Licence v3.0",
      },
      copyright: {
        text: "© Crown copyright",
      },
    },
  };

  it("has no accessibility violations", async () => {
    // const template = `{% from "footer/macro.njk" import govukFooter %}{{ govukFooter(params) }}`;
    const template = "footer";

    const renderedComponent = render(template, { params: mockParams });
    const results = await axe(renderedComponent.documentElement.outerHTML);
    expect(results).toHaveNoViolations();
  });

  // it("has no accessibility violations - testing May rebrand condition", async () => {
  //   const template = `{% from "footer/macro.njk" import govukFooter %}{{ govukFooter(params) }}`;
  //   const renderedComponent = render(template, { params: mockParams, May_2025_Rebrand: true });
  //   const results = await axe(renderedComponent.outerHTML);
  //   expect(results).toHaveNoViolations();
  // });
});
