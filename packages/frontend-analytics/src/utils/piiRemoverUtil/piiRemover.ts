const EMAIL_PATTERN = /[^\s=@/?&#+]+\s?(?:@|%40)\s?[^\s=@/?&+]+/g;
const POSTCODE_PATTERN =
  /\b[A-PR-UWYZ][A-HJ-Z]?\d[0-9A-HJKMNPR-Y]?(?:[\s+]|%20)*\d(?!refund)[ABD-HJLNPQ-Z]{2,3}\b/gi;

// UK phone numbers: +44 or 0 prefix followed by 10-11 digits with optional spaces/hyphens
const UK_PHONE_PATTERN =
  /(?:\+44\s?|0)(?:\d[\s-]?){9,10}\d/g;

// International phone numbers: + followed by at least 10 digits with optional separators
const INTERNATIONAL_PHONE_PATTERN = /\+\d[\d\s\-()]{8,}\d/g;

// National Insurance Number: 2 prefix letters, 6 digits, 1 suffix letter (A-D)
// Invalid prefixes: BG, GB, NK, KN, TN, NT, ZZ
// Invalid first letters: D, F, I, Q, U, V
// Invalid second letters: D, F, I, O, Q, U, V
const NINO_PATTERN =
  /\b(?!BG|GB|NK|KN|TN|NT|ZZ)[A-CEGHJ-PRSTW-Z][A-CEGHJ-NPR-TW-Z]\s?\d{2}\s?\d{2}\s?\d{2}\s?[A-D]\b/gi;

// e.g. 01/01/1990 or 01-01-1990 or 1-1-1990 or 1/1/1990 or 01\01\1990 or 1\1\1990
const DATE_PATTERN_NUMERIC_1 = /\d{1,2}([-\/\\])\d{1,2}([-\/\\])\d{4}/g; // eslint-disable-line no-useless-escape

// e.g. 1990/01/01 or 1990-01-01 or 1990-1-1 or 1990/1/1 or 1990\1\1 or 1990\01\01
const DATE_PATTERN_NUMERIC_2 = /\d{4}([-\/\\])\d{1,2}([-\/\\])\d{1,2}/g; // eslint-disable-line no-useless-escape

// e.g. 01/01/90 or 01-01-90 or 1-1-90 or 1/1/90 or 01\01\90 or 1\1\90
const DATE_PATTERN_NUMERIC_3 = /\d{1,2}([-\/\\])\d{1,2}([-\/\\])\d{2}/g; // eslint-disable-line no-useless-escape

// e.g. 1(st) (of) Jan(uary) 1990 (or 90 or '90) - where the bracketed characters are optional parts that can be matched
const DATE_PATTERN_STRING_1 =
  /\d{1,2}(?:st|nd|rd|th)?\s(?:of\s)?(Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:t)?(?:ember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s(?:')?(\d{4}|\d{2})/gi;

// e.g. Jan(uary) 1(st) 1990 (or 90 or '90) - where the bracketed characters are optional parts that can be matched
const DATE_PATTERN_STRING_2 =
  /(Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:t)?(?:ember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s\d{1,2}?(?:st|nd|rd|th)?\s(?:')?(\d{4}|\d{2})/gi;

// UK Driving Licence number: surname-encoded format, 16 characters
// Format: SSSSS DDDDDM YYGGG (5 surname chars, 6 DOB-encoded digits, 2 year, 3 check digits)
// e.g. JONES 910100 AB 9AA or JONES910100AB9AA
const DRIVING_LICENCE_PATTERN =
  /\b[A-Z]{2,5}9?\d{6}[A-Z\d]{2}\d[A-Z]{2}\b/gi;

// UK Passport number: 9 digits
const PASSPORT_PATTERN = /\b\d{9}\b/g;

// Credit/debit card numbers: 13-19 digits with optional spaces or hyphens
// Covers Visa (4xxx), Mastercard (5xxx/2xxx), Amex (3xxx), etc.
const CARD_NUMBER_PATTERN =
  /\b(?:\d[\s-]?){12,18}\d\b/g;

// Sort code: 6 digits in XX-XX-XX format (hyphen-separated only)
const SORT_CODE_PATTERN = /\b\d{2}-\d{2}-\d{2}\b/g;

// UUID: standard 8-4-4-4-12 hex format
const UUID_PATTERN =
  /\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b/gi;

// IPv4 address: dotted quad notation
const IPV4_OCTET = String.raw`(?:25[0-5]|2[0-4]\d|[01]?\d\d?)`;
const IPV4_PATTERN = new RegExp(
  String.raw`\b(?:${IPV4_OCTET}\.){3}${IPV4_OCTET}\b`,
  "g",
);

// IPv6 address: colon-separated hex groups (full and compressed forms)
const IPV6_HEX = "[0-9a-f]{1,4}";
const IPV6_PATTERN = new RegExp(
  String.raw`\b(?:${IPV6_HEX}:){7}${IPV6_HEX}\b` +
    `|(?:${IPV6_HEX}:){1,7}:` +
    `|(?:${IPV6_HEX}:){1,6}:${IPV6_HEX}` +
    String.raw`|::(?:${IPV6_HEX}:){0,5}${IPV6_HEX}\b`,
  "gi",
);

// Long numeric sequences: 10+ digits that could be reference numbers, account IDs, etc.
// Applied after other numeric patterns to avoid double-matching
const LONG_NUMERIC_PATTERN = /\b\d{10,}\b/g;

// UK Vehicle Registration Number: various formats
// e.g. AB12 CDE (current), A123 BCD (prefix), ABC 123D (suffix)
const VRN_CURRENT = /\b[A-Z]{2}\d{2}\s?[A-Z]{3}\b/gi;
const VRN_PREFIX = /\b[A-Z]\d{1,3}\s?[A-Z]{3}\b/gi;
const VRN_SUFFIX = /\b[A-Z]{3}\s?\d{1,3}[A-Z]\b/gi;

export function stripPIIFromString(value: string) {
  const DATE_REDACTION_STRING = "[date]";
  const POSTCODE_REDACTION_STRING = "[postcode]";
  const PHONENUMBER_REDACTION_STRING = "[phonenumber]";
  const NINO_REDACTION_STRING = "[nationalInsuranceNumber]";
  const DRIVING_LICENCE_REDACTION_STRING = "[drivingLicence]";
  const CARD_NUMBER_REDACTION_STRING = "[cardNumber]";
  const SORT_CODE_REDACTION_STRING = "[sortCode]";
  const UUID_REDACTION_STRING = "[uuid]";
  const IP_REDACTION_STRING = "[ipAddress]";
  const NUMERIC_REF_REDACTION_STRING = "[numericReference]";
  const VRN_REDACTION_STRING = "[vrn]";
  const PASSPORT_REDACTION_STRING = "[passport]";

  let stripped = value.replace(EMAIL_PATTERN, "[email]");

  // Apply specific structured patterns first (before generic numeric patterns)
  stripped = stripped.replace(UUID_PATTERN, UUID_REDACTION_STRING);
  stripped = stripped.replace(IPV4_PATTERN, IP_REDACTION_STRING);
  stripped = stripped.replace(IPV6_PATTERN, IP_REDACTION_STRING);
  stripped = stripped.replace(NINO_PATTERN, NINO_REDACTION_STRING);
  stripped = stripped.replace(
    DRIVING_LICENCE_PATTERN,
    DRIVING_LICENCE_REDACTION_STRING,
  );
  stripped = stripped.replace(VRN_CURRENT, VRN_REDACTION_STRING);
  stripped = stripped.replace(VRN_PREFIX, VRN_REDACTION_STRING);
  stripped = stripped.replace(VRN_SUFFIX, VRN_REDACTION_STRING);
  stripped = stripped.replace(SORT_CODE_PATTERN, SORT_CODE_REDACTION_STRING);
  stripped = stripped.replace(DATE_PATTERN_NUMERIC_1, DATE_REDACTION_STRING);
  stripped = stripped.replace(DATE_PATTERN_NUMERIC_2, DATE_REDACTION_STRING);
  stripped = stripped.replace(DATE_PATTERN_NUMERIC_3, DATE_REDACTION_STRING);
  stripped = stripped.replace(DATE_PATTERN_STRING_1, DATE_REDACTION_STRING);
  stripped = stripped.replace(DATE_PATTERN_STRING_2, DATE_REDACTION_STRING);
  stripped = stripped.replace(POSTCODE_PATTERN, POSTCODE_REDACTION_STRING);
  stripped = stripped.replace(UK_PHONE_PATTERN, PHONENUMBER_REDACTION_STRING);
  stripped = stripped.replace(
    INTERNATIONAL_PHONE_PATTERN,
    PHONENUMBER_REDACTION_STRING,
  );
  stripped = stripped.replace(CARD_NUMBER_PATTERN, CARD_NUMBER_REDACTION_STRING);

  // Generic numeric patterns last — these catch remaining sensitive numbers
  // NHS numbers and UTRs are both 10 digits; passport numbers are 9 digits.
  // LONG_NUMERIC_PATTERN (10+ digits) covers NHS and UTR as a catch-all.
  stripped = stripped.replace(LONG_NUMERIC_PATTERN, NUMERIC_REF_REDACTION_STRING);
  stripped = stripped.replace(PASSPORT_PATTERN, PASSPORT_REDACTION_STRING);

  return stripped;
}
