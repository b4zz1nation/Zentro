import {
  COUNTRY_CODE_OPTIONS,
  DEFAULT_COUNTRY_CODE,
} from "@/lib/phone/country-codes";

export function parsePhoneParts(value?: string | null) {
  const phone = value?.trim() ?? "";

  if (!phone) {
    return {
      countryCode: DEFAULT_COUNTRY_CODE,
      localNumber: "",
    };
  }

  const match = phone.match(/^(\+\d{1,4})(?:\s+)?(.*)$/);

  if (!match) {
    return {
      countryCode: DEFAULT_COUNTRY_CODE,
      localNumber: phone,
    };
  }

  const parsedCode = match[1];
  const localNumber = match[2] ?? "";
  const countryCode = COUNTRY_CODE_OPTIONS.some(
    (option) => option.code === parsedCode,
  )
    ? parsedCode
    : DEFAULT_COUNTRY_CODE;

  return {
    countryCode,
    localNumber: countryCode === parsedCode ? localNumber : phone,
  };
}

export function buildPhoneNumber(countryCode?: string, localNumber?: string) {
  const normalizedLocalNumber = localNumber?.trim() ?? "";

  if (!normalizedLocalNumber) {
    return "";
  }

  if (normalizedLocalNumber.startsWith("+")) {
    return normalizedLocalNumber.replace(/\s+/g, " ");
  }

  const normalizedCountryCode =
    countryCode && countryCode.startsWith("+")
      ? countryCode.trim()
      : DEFAULT_COUNTRY_CODE;

  return `${normalizedCountryCode} ${normalizedLocalNumber}`
    .trim()
    .replace(/\s+/g, " ");
}
