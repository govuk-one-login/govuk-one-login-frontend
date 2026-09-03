import { axe, toHaveNoViolations } from "jest-axe";
import { render } from "../test/jestHelper";

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
    const renderedComponent = render("footer", "frontendUiFooter", {
      params: mockParams,
    });
    const html = renderedComponent.documentElement.outerHTML;
    const results = await axe(html);
    expect(results).toHaveNoViolations();
  });
});
