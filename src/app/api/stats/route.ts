import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { LiveStats } from "@/lib/stats";

// Public, aggregate-only counts for the homepage stat tiles. No personal data leaves this route.
export async function GET() {
  try {
    const [members, registrations] = await Promise.all([
      prisma.memberApplication.count({ where: { status: "accepted" } }),
      prisma.eventRegistration.count({ where: { status: { not: "cancelled" } } }),
    ]);

    const body: LiveStats = { members, registrations };
    return NextResponse.json(body, {
      headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" },
    });
  } catch (error) {
    console.error("[API:Stats] Query error:", error instanceof Error ? error.message : "unknown");
    return NextResponse.json({ message: "Stats are temporarily unavailable." }, { status: 503 });
  }
}
