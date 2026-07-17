# PII Redaction Patterns

The `stripPIIFromString` function removes Personally Identifiable Information (PII) from strings before they are sent to analytics. This prevents sensitive user data from appearing in Google Analytics, GTM data layers, or any downstream reporting tools.

## Redaction Summary

| Pattern | Redaction | Example Input | Example Output |
|---------|-----------|---------------|----------------|
| Email | `[email]` | `user@example.com` | `[email]` |
| Email (URL-encoded) | `[email]` | `user%40example.com` | `[email]` |
| UUID | `[uuid]` | `550e8400-e29b-41d4-a716-446655440000` | `[uuid]` |
| IPv4 | `[ipAddress]` | `192.168.1.100` | `[ipAddress]` |
| IPv6 | `[ipAddress]` | `2001:0db8:85a3:0000:0000:8a2e:0370:7334` | `[ipAddress]` |
| National Insurance Number | `[nationalInsuranceNumber]` | `AB 12 34 56 C` | `[nationalInsuranceNumber]` |
| UK Driving Licence (DVLA) | `[drivingLicence]` | `JONES910100AB9AA` | `[drivingLicence]` |
| Vehicle Registration (VRN) | `[vrn]` | `AB12 CDE` | `[vrn]` |
| Sort Code | `[sortCode]` | `12-34-56` | `[sortCode]` |
| Date (DD/MM/YYYY) | `[date]` | `01/01/1990` | `[date]` |
| Date (YYYY-MM-DD) | `[date]` | `1990-01-01` | `[date]` |
| Date (DD/MM/YY) | `[date]` | `31/12/25` | `[date]` |
| Date (string) | `[date]` | `1st January 1990` | `[date]` |
| UK Postcode | `[postcode]` | `SW1A 1AA` | `[postcode]` |
| UK Phone Number | `[phonenumber]` | `07911 123 456` | `[phonenumber]` |
| +44 Phone Number | `[phonenumber]` | `+44 7911 123456` | `[phonenumber]` |
| International Phone | `[phonenumber]` | `+33 1 23 45 67 89` | `[phonenumber]` |
| Card Number | `[cardNumber]` | `4111 1111 1111 1111` | `[cardNumber]` |
| Long Numeric (10+ digits) | `[numericReference]` | `9434765919` | `[numericReference]` |
| Passport (9 digits) | `[passport]` | `123456789` | `[passport]` |

## Application Order

Patterns are applied sequentially from top to bottom. More specific patterns are applied first to prevent generic patterns from consuming structured data:

1. **Email** — applied first as it has a distinct `@`/`%40` signature
2. **Structured identifiers** — UUID, IPv4, IPv6, NINO, Driving Licence, VRN
3. **Sort codes** — applied before dates to prevent `12-34-56` being matched as DD-MM-YY
4. **Dates** — numeric and string formats
5. **Postcodes** — UK format
6. **Phone numbers** — UK and international
7. **Card numbers** — 13-19 digit sequences with optional separators
8. **Long numeric catch-all** — 10+ digits (covers NHS numbers, UTRs, account references)
9. **Passport numbers** — 9-digit sequences (applied last as the most generic numeric pattern)

## Known Limitations

- **Northern Ireland driving licences** (DVA format, 8 digits) are not specifically matched as they are indistinguishable from other 8-digit numbers without context.
- **Passport numbers** (9 digits) may produce false positives on other 9-digit numbers. The pattern is applied last to minimise this.
- **Card numbers** use a length-based match (13-19 digits).
- **VRN patterns** may match some short alphabetic codes that happen to follow the same format.
- **Long numeric pattern** is intentionally broad — any 10+ digit standalone number is redacted as a precaution.

## Adding New Patterns

When adding a new PII pattern:

1. Define the regex constant at the top of `piiRemover.ts` with a descriptive comment.
2. Add the redaction string constant inside `stripPIIFromString`.
3. Insert the `.replace()` call in the correct position (specific patterns before generic ones).
4. Add tests in `piiRemover.test.ts` covering both positive matches and negative cases (things that should NOT be redacted).
5. Run `npx vitest run src/utils/piiRemoverUtil/piiRemover.test.ts` to verify.
