import { NextResponse } from "next/server";
import { createActionClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createActionClient();
    const { error } = await supabase.auth.getSession();

    if (error) {
      return NextResponse.json(
        {
          ok: false,
          message: "Supabase client reachable but auth session check failed.",
          error: error.message,
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      ok: true,
      message: "Supabase client configured.",
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message: "Supabase environment is not fully configured.",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
