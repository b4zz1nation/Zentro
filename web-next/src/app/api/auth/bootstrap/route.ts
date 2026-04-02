import { NextResponse } from "next/server";
import { getAuthContext } from "@/lib/auth/profile";

export async function GET() {
  try {
    const context = await getAuthContext();

    if (!context) {
      return NextResponse.json(
        {
          ok: false,
          message: "No authenticated Supabase user session found.",
        },
        { status: 401 },
      );
    }

    return NextResponse.json({
      ok: true,
      context,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message: "Failed to bootstrap auth context.",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
