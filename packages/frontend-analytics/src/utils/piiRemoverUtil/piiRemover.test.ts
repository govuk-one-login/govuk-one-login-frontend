import { stripPIIFromString } from "./piiRemover";

describe("stripPIIFromString", () => {
  describe("email redaction", () => {
    test("redacts a standard email address", () => {
      const input = "contact user@example.com for info";
      expect(stripPIIFromString(input)).toBe("contact [email] for info");
    });

    test("redacts a URL-encoded email address (%40)", () => {
      const input = "/path?email=user%40example.com";
      expect(stripPIIFromString(input)).toBe("/path?email=[email]");
    });

    test("redacts multiple email addresses", () => {
      const input = "from alice@gov.uk to bob@digital.gov.uk";
      expect(stripPIIFromString(input)).toBe("from [email] to [email]");
    });

    test("does not redact text without @ symbol", () => {
      const input = "this is just normal text";
      expect(stripPIIFromString(input)).toBe("this is just normal text");
    });
  });

  describe("date redaction", () => {
    test("redacts DD/MM/YYYY format", () => {
      const input = "born on 01/01/1990";
      expect(stripPIIFromString(input)).toBe("born on [date]");
    });

    test("redacts DD-MM-YYYY format", () => {
      const input = "dob: 15-06-1985";
      expect(stripPIIFromString(input)).toBe("dob: [date]");
    });

    test("redacts YYYY/MM/DD format", () => {
      const input = "date is 1990/01/01";
      expect(stripPIIFromString(input)).toBe("date is [date]");
    });

    test("redacts DD/MM/YY format", () => {
      const input = "expires 31/12/25";
      expect(stripPIIFromString(input)).toBe("expires [date]");
    });

    test("redacts string date format (1st January 1990)", () => {
      const input = "born 1st January 1990";
      expect(stripPIIFromString(input)).toBe("born [date]");
    });

    test("redacts string date format (Jan 1 1990)", () => {
      const input = "date: January 1st 1990";
      expect(stripPIIFromString(input)).toBe("date: [date]");
    });

    test("redacts date with backslash separator", () => {
      const input = "date 01\\01\\1990";
      expect(stripPIIFromString(input)).toBe("date [date]");
    });
  });

  describe("postcode redaction", () => {
    test("redacts a standard UK postcode", () => {
      const input = "address is SW1A 1AA";
      expect(stripPIIFromString(input)).toBe("address is [postcode]");
    });

    test("redacts a postcode without space", () => {
      const input = "postcode EC1A1BB";
      expect(stripPIIFromString(input)).toBe("postcode [postcode]");
    });

    test("redacts a short-form postcode", () => {
      const input = "lives at W1A 1AB";
      expect(stripPIIFromString(input)).toBe("lives at [postcode]");
    });

    test("does not match 'refund' as part of postcode", () => {
      const input = "path /e1refund";
      expect(stripPIIFromString(input)).toBe("path /e1refund");
    });
  });

  describe("phone number redaction", () => {
    test("redacts 4+7 format with space (legacy format)", () => {
      const input = "call 0207 1234567";
      expect(stripPIIFromString(input)).toBe("call [phonenumber]");
    });

    test("redacts 11-digit number without space", () => {
      const input = "phone 02071234567";
      expect(stripPIIFromString(input)).toBe("phone [phonenumber]");
    });

    test("redacts UK mobile number with spaces", () => {
      const input = "mobile 07911 123 456";
      expect(stripPIIFromString(input)).toBe("mobile [phonenumber]");
    });

    test("redacts UK mobile number without spaces", () => {
      const input = "call 07911123456";
      expect(stripPIIFromString(input)).toBe("call [phonenumber]");
    });

    test("redacts +44 prefixed number", () => {
      const input = "ring +44 7911 123456";
      expect(stripPIIFromString(input)).toBe("ring [phonenumber]");
    });

    test("redacts +44 prefixed number without spaces", () => {
      const input = "tel: +447911123456";
      expect(stripPIIFromString(input)).toBe("tel: [phonenumber]");
    });

    test("redacts UK landline with hyphens", () => {
      const input = "office 020-7946-0958";
      expect(stripPIIFromString(input)).toBe("office [phonenumber]");
    });

    test("redacts international number with + prefix", () => {
      const input = "call +1 555 123 4567";
      expect(stripPIIFromString(input)).toBe("call [phonenumber]");
    });

    test("redacts international number with country code", () => {
      const input = "contact +33 1 23 45 67 89";
      expect(stripPIIFromString(input)).toBe("contact [phonenumber]");
    });

    test("does not redact short digit sequences", () => {
      const input = "error code 404";
      expect(stripPIIFromString(input)).toBe("error code 404");
    });
  });

  describe("NINO redaction", () => {
    test("redacts a NINO with spaces", () => {
      const input = "nino is AB 12 34 56 C";
      expect(stripPIIFromString(input)).toBe(
        "nino is [nationalInsuranceNumber]",
      );
    });

    test("redacts a NINO without spaces", () => {
      const input = "NINO: SH123456C";
      expect(stripPIIFromString(input)).toBe(
        "NINO: [nationalInsuranceNumber]",
      );
    });

    test("redacts a lowercase NINO", () => {
      const input = "reference ab123456d";
      expect(stripPIIFromString(input)).toBe(
        "reference [nationalInsuranceNumber]",
      );
    });

    test("does not match invalid NINO prefix (BG)", () => {
      const input = "code BG123456A";
      expect(stripPIIFromString(input)).toBe("code BG123456A");
    });

    test("does not match invalid NINO prefix (GB)", () => {
      const input = "ref GB 12 34 56 A";
      expect(stripPIIFromString(input)).toBe("ref GB 12 34 56 A");
    });

    test("does not match invalid NINO suffix (E)", () => {
      const input = "ref SH123456E";
      expect(stripPIIFromString(input)).toBe("ref SH123456E");
    });

    test("does not match incomplete NINO (too few digits)", () => {
      const input = "ref SH1234A";
      expect(stripPIIFromString(input)).toBe("ref SH1234A");
    });

    test("does not match invalid first letter (Q)", () => {
      const input = "ref QQ123456C";
      expect(stripPIIFromString(input)).toBe("ref QQ123456C");
    });
  });

  describe("no PII present", () => {
    test("returns the string unchanged when no PII is found", () => {
      const input = "/enter-your-details";
      expect(stripPIIFromString(input)).toBe("/enter-your-details");
    });

    test("returns a URL path unchanged", () => {
      const input = "https://signin.account.gov.uk/enter-email";
      expect(stripPIIFromString(input)).toBe(
        "https://signin.account.gov.uk/enter-email",
      );
    });
  });

  describe("UUID redaction", () => {
    test("redacts a standard UUID in a URL path", () => {
      const input = "/session/550e8400-e29b-41d4-a716-446655440000/status";
      expect(stripPIIFromString(input)).toBe("/session/[uuid]/status");
    });

    test("redacts an uppercase UUID", () => {
      const input = "id=550E8400-E29B-41D4-A716-446655440000";
      expect(stripPIIFromString(input)).toBe("id=[uuid]");
    });

    test("redacts multiple UUIDs", () => {
      const input =
        "/user/a1b2c3d4-e5f6-7890-abcd-ef1234567890/doc/f0e1d2c3-b4a5-6789-0abc-def123456789";
      expect(stripPIIFromString(input)).toBe("/user/[uuid]/doc/[uuid]");
    });

    test("does not redact non-UUID hex strings", () => {
      const input = "colour #ff0000";
      expect(stripPIIFromString(input)).toBe("colour #ff0000");
    });
  });

  describe("IPv4 address redaction", () => {
    test("redacts a standard IPv4 address", () => {
      const input = "connected from 192.168.1.100";
      expect(stripPIIFromString(input)).toBe("connected from [ipAddress]");
    });

    test("redacts localhost IP", () => {
      const input = "server at 127.0.0.1";
      expect(stripPIIFromString(input)).toBe("server at [ipAddress]");
    });

    test("redacts IPv4 with max values", () => {
      const input = "range 255.255.255.255";
      expect(stripPIIFromString(input)).toBe("range [ipAddress]");
    });
  });

  describe("IPv6 address redaction", () => {
    test("redacts a full IPv6 address", () => {
      const input = "from 2001:0db8:85a3:0000:0000:8a2e:0370:7334";
      expect(stripPIIFromString(input)).toBe("from [ipAddress]");
    });

    test("redacts a compressed IPv6 address", () => {
      const input = "address ::1";
      expect(stripPIIFromString(input)).toBe("address [ipAddress]");
    });
  });

  describe("driving licence redaction", () => {
    test("redacts a UK driving licence number", () => {
      const input = "licence JONES910100AB9AA";
      expect(stripPIIFromString(input)).toBe("licence [drivingLicence]");
    });

    test("redacts a shorter surname driving licence", () => {
      const input = "DL: SMITH901019AB1AB";
      expect(stripPIIFromString(input)).toBe("DL: [drivingLicence]");
    });
  });

  describe("VRN redaction", () => {
    test("redacts a current format VRN (AB12 CDE)", () => {
      const input = "car reg AB12 CDE";
      expect(stripPIIFromString(input)).toBe("car reg [vrn]");
    });

    test("redacts a VRN without space", () => {
      const input = "plate AB12CDE";
      expect(stripPIIFromString(input)).toBe("plate [vrn]");
    });

    test("redacts a prefix format VRN (A123 BCD)", () => {
      const input = "vehicle A123 BCD";
      expect(stripPIIFromString(input)).toBe("vehicle [vrn]");
    });

    test("redacts a suffix format VRN (ABC 123D)", () => {
      const input = "reg ABC 123D";
      expect(stripPIIFromString(input)).toBe("reg [vrn]");
    });
  });

  describe("sort code redaction", () => {
    test("redacts a sort code with hyphens", () => {
      const input = "sort code 12-34-56";
      expect(stripPIIFromString(input)).toBe("sort code [sortCode]");
    });

    test("does not redact a date-like value (not a sort code)", () => {
      const input = "ref 12 34 56";
      expect(stripPIIFromString(input)).toBe("ref 12 34 56");
    });
  });

  describe("card number redaction", () => {
    test("redacts a 16-digit card number with spaces", () => {
      const input = "card 4111 1111 1111 1111";
      expect(stripPIIFromString(input)).toBe("card [cardNumber]");
    });

    test("redacts a 16-digit card number without spaces", () => {
      const input = "paid with 4111111111111111";
      expect(stripPIIFromString(input)).toBe("paid with [cardNumber]");
    });

    test("redacts a card number with hyphens", () => {
      const input = "card 4111-1111-1111-1111";
      expect(stripPIIFromString(input)).toBe("card [cardNumber]");
    });

    test("redacts an Amex-length card number (15 digits)", () => {
      const input = "amex 371449635398431";
      expect(stripPIIFromString(input)).toBe("amex [cardNumber]");
    });
  });

  describe("numeric reference redaction (NHS, UTR, long numbers)", () => {
    test("redacts a 10-digit NHS number", () => {
      const input = "NHS: 9434765919";
      expect(stripPIIFromString(input)).toBe("NHS: [numericReference]");
    });

    test("redacts a 10-digit UTR number", () => {
      const input = "UTR 1234567890";
      expect(stripPIIFromString(input)).toBe("UTR [numericReference]");
    });

    test("redacts a long numeric reference (12 digits)", () => {
      const input = "ref 123456789012";
      expect(stripPIIFromString(input)).toBe("ref [numericReference]");
    });

    test("does not redact short numbers (under 10 digits)", () => {
      const input = "error code 12345";
      expect(stripPIIFromString(input)).toBe("error code 12345");
    });
  });

  describe("passport number redaction", () => {
    test("redacts a 9-digit passport number", () => {
      const input = "passport 123456789";
      expect(stripPIIFromString(input)).toBe("passport [passport]");
    });

    test("does not redact 8-digit numbers as passports", () => {
      const input = "ref 12345678";
      expect(stripPIIFromString(input)).toBe("ref 12345678");
    });
  });

  describe("combined PII - all types redacted (else-if bug fixed)", () => {
    test("string with date AND postcode - both are redacted", () => {
      const input = "DOB: 01/01/1990 Postcode: SW1A 1AA";
      expect(stripPIIFromString(input)).toBe(
        "DOB: [date] Postcode: [postcode]",
      );
    });

    test("string with date AND phone number - both are redacted", () => {
      const input = "DOB: 01/01/1990 Phone: 07911123456";
      expect(stripPIIFromString(input)).toBe(
        "DOB: [date] Phone: [phonenumber]",
      );
    });

    test("string with postcode AND phone number - both are redacted", () => {
      const input = "Postcode: SW1A 1AA Phone: 07911123456";
      expect(stripPIIFromString(input)).toBe(
        "Postcode: [postcode] Phone: [phonenumber]",
      );
    });

    test("string with email, date, postcode, and phone - all redacted", () => {
      const input =
        "user@test.com DOB: 01/01/1990 Address: SW1A 1AA Tel: 07911123456";
      expect(stripPIIFromString(input)).toBe(
        "[email] DOB: [date] Address: [postcode] Tel: [phonenumber]",
      );
    });

    test("string with email and NINO - both redacted", () => {
      const input = "user@example.com NINO: SH123456C";
      expect(stripPIIFromString(input)).toBe(
        "[email] NINO: [nationalInsuranceNumber]",
      );
    });

    test("string with all PII types - all redacted", () => {
      const input =
        "Email: user@gov.uk NINO: AB 12 34 56 D DOB: 15/06/1985 Home: EC1A 1BB Phone: +44 7911 123456";
      expect(stripPIIFromString(input)).toBe(
        "Email: [email] NINO: [nationalInsuranceNumber] DOB: [date] Home: [postcode] Phone: [phonenumber]",
      );
    });
  });
});
