import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { cache } from "react";
import { env } from "@/lib/env";

export const createReadOnlyClient = cache(
  async function createReadOnlyClient() {
    const cookieStore = await cookies();

    return createServerClient(env.supabaseUrl, env.supabasePublishableKey, {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll() {
          // Server components can read auth cookies but cannot write them.
        },
      },
    });
  },
);

export async function createActionClient() {
  const cookieStore = await cookies();

  return createServerClient(env.supabaseUrl, env.supabasePublishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          cookieStore.set(name, value, options);
        });
      },
    },
  });
}
