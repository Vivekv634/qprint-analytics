import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { getPeakHours } from "@/lib/db/analytics";

export async function GET() {
  const db = await getDb();
  return NextResponse.json({ hours: await getPeakHours(db) });
}
