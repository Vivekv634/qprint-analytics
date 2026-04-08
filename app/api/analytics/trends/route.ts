import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { getTrends } from "@/lib/db/analytics";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const days = Math.min(Math.max(parseInt(searchParams.get("days") ?? "30", 10), 1), 365);
  const db = await getDb();
  return NextResponse.json(await getTrends(db, days));
}
