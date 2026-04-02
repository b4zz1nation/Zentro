"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: Readonly<{
  error: Error & { digest?: string };
  reset: () => void;
}>) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="max-w-xl rounded-[2rem] border border-slate-200 bg-white p-10 text-center shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-rose-700">
          Application Error
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950">
          Something broke in this route
        </h1>
        <p className="mt-4 text-sm leading-7 text-slate-600">
          This is the baseline error boundary for the app router. Real logging
          and route-specific recovery will be expanded later.
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-8 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white"
        >
          Try again
        </button>
      </div>
    </main>
  );
}
