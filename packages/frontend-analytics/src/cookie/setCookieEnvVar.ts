// Mock setting of the environment variable COOKIE_DOMAIN
process.env.COOKIE_DOMAIN = "test_domain";

// Function to retrieve the cookie domain from the environment variable
function getCookieDomain(): string {
  return process.env.COOKIE_DOMAIN ?? "account.gov.uk";
}

/**
 * Interface for a mock response object in tests.
 *
 * Simulates the response object used in middleware, allowing
 * local variables like `cookieDomain` to be set and retrieved.
 */

interface MockResponse {
  locals: {
    cookieDomain?: string;
  };
}

// Middleware function to simulate setting the cookieDomain value locally
export function setLocalCookieVarMiddleware(res: MockResponse): void {
  res.locals.cookieDomain = getCookieDomain();
}
