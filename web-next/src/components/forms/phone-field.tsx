"use client";

import { useRef, useState } from "react";
import { COUNTRY_CODE_OPTIONS } from "@/lib/phone/country-codes";
import { parsePhoneParts } from "@/lib/phone/phone";

type PhoneFieldProps = {
  label: string;
  countryCodeName: string;
  localNumberName: string;
  defaultValue?: string | null;
  placeholder?: string;
};

function getFlagEmoji(iso2: string) {
  return iso2
    .toUpperCase()
    .split("")
    .map((char) => String.fromCodePoint(127397 + char.charCodeAt(0)))
    .join("");
}

export function PhoneField({
  label,
  countryCodeName,
  localNumberName,
  defaultValue,
  placeholder = "555 000 0000",
}: PhoneFieldProps) {
  const { countryCode, localNumber } = parsePhoneParts(defaultValue);
  const [selectedCode, setSelectedCode] = useState(countryCode);
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const selectedOption =
    COUNTRY_CODE_OPTIONS.find((option) => option.code === selectedCode) ??
    COUNTRY_CODE_OPTIONS[0];

  return (
    <div className="block space-y-2">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <div className="grid gap-3 sm:grid-cols-[4.5rem_1fr]">
        <input type="hidden" name={countryCodeName} value={selectedCode} />
        <div className="relative">
          <select
            defaultValue={selectedCode}
            aria-label={`${label} country code`}
            title={`${label} country code`}
            onChange={(event) => setSelectedCode(event.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-center text-sm outline-none transition focus:border-cyan-500 focus:bg-white sm:hidden"
          >
            {COUNTRY_CODE_OPTIONS.map((option) => (
              <option
                key={option.code}
                value={option.code}
                title={`${option.country} ${option.code}`}
              >
                {getFlagEmoji(option.iso2)} {option.code}
              </option>
            ))}
          </select>
          <details ref={detailsRef} className="relative hidden sm:block">
            <summary className="flex h-full list-none items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-none transition focus:border-cyan-500 focus:bg-white">
              <span
                className={`fi fi-${selectedOption.iso2} rounded-sm`}
                aria-hidden="true"
              />
              <span className="text-slate-700">{selectedOption.code}</span>
            </summary>
            <div className="absolute left-0 top-[calc(100%+0.5rem)] z-20 w-full min-w-full overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-lg">
              <div className="space-y-1">
                {COUNTRY_CODE_OPTIONS.map((option) => (
                  <button
                    key={option.code}
                    type="button"
                    onClick={() => {
                      setSelectedCode(option.code);
                      if (detailsRef.current) {
                        detailsRef.current.open = false;
                      }
                    }}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm text-slate-700 transition hover:bg-slate-100"
                  >
                    <span
                      className={`fi fi-${option.iso2} rounded-sm`}
                      aria-hidden="true"
                    />
                    <span>{option.code}</span>
                  </button>
                ))}
              </div>
            </div>
          </details>
        </div>
        <input
          name={localNumberName}
          type="text"
          defaultValue={localNumber}
          placeholder={placeholder}
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-cyan-500 focus:bg-white"
        />
      </div>
    </div>
  );
}
