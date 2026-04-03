import { describe, expect, it } from "vitest";
import { buildPhoneNumber, parsePhoneParts } from "@/lib/phone/phone";

describe("parsePhoneParts", () => {
  it("returns the default country code for an empty value", () => {
    expect(parsePhoneParts("")).toEqual({
      countryCode: "+1",
      localNumber: "",
    });
  });

  it("splits an E.164-like stored value into code and local number", () => {
    expect(parsePhoneParts("+63 9171234567")).toEqual({
      countryCode: "+63",
      localNumber: "9171234567",
    });
  });

  it("falls back to the default code for unknown prefixes", () => {
    expect(parsePhoneParts("+999 123456")).toEqual({
      countryCode: "+1",
      localNumber: "+999 123456",
    });
  });
});

describe("buildPhoneNumber", () => {
  it("returns an empty string when no local number is provided", () => {
    expect(buildPhoneNumber("+63", "")).toBe("");
  });

  it("preserves already prefixed values", () => {
    expect(buildPhoneNumber("+63", "+63 9171234567")).toBe("+63 9171234567");
  });

  it("combines country code and local number with normalized spaces", () => {
    expect(buildPhoneNumber("+44", " 20 7946 0958 ")).toBe("+44 20 7946 0958");
  });
});
