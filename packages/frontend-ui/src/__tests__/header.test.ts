/**
 * @jest-environment jsdom
 */

import { axe, toHaveNoViolations } from "jest-axe";
import { renderInline } from "../../test/jestHelper";
expect.extend(toHaveNoViolations);

describe('Header accessibility', () => {
  const mockParams = {
    homepageUrl: 'https://www.gov.uk/',
    productName: 'Test Service',
    serviceName: 'Test Service',
    serviceUrl: 'https://service.gov.uk',
    navigation: [
      { text: 'Home', href: '/', active: true },
      { text: 'About', href: '/about' },
    ],
    signOutLink: '/sign-out',
    translations: {
      signOut: 'Sign out',
      ariaLabel: 'Sign out of your account',
    },
  };

  it('should have no accessibility violations in default state', async () => {
    const template = `{% from "header/macro.njk" import govukHeader %}{{ govukHeader(params) }}`;
    const renderedComponent = renderInline(template, { params: mockParams });
    const results = await axe(renderedComponent.outerHTML);
    expect(results).toHaveNoViolations();
  });
});
