export type CountryCodeOption = {
  code: string;
  country: string;
  iso2: string;
};

export const COUNTRY_CODE_OPTIONS: CountryCodeOption[] = [
  { code: "+1", country: "United States / Canada", iso2: "us" },
  { code: "+44", country: "United Kingdom", iso2: "gb" },
  { code: "+61", country: "Australia", iso2: "au" },
  { code: "+63", country: "Philippines", iso2: "ph" },
  { code: "+65", country: "Singapore", iso2: "sg" },
  { code: "+81", country: "Japan", iso2: "jp" },
  { code: "+82", country: "South Korea", iso2: "kr" },
  { code: "+86", country: "China", iso2: "cn" },
  { code: "+91", country: "India", iso2: "in" },
  { code: "+966", country: "Saudi Arabia", iso2: "sa" },
  { code: "+971", country: "United Arab Emirates", iso2: "ae" },
];

export const DEFAULT_COUNTRY_CODE = "+1";
