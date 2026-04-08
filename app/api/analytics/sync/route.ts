import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { verifyApiKey } from "@/lib/auth";
import { upsertDay } from "@/lib/db/analytics";
import { touchLastSynced } from "@/lib/db/shops";

export async function POST(request: Request) {
  const db = await getDb();
  const auth = await verifyApiKey(db, request.headers.get("Authorization"));
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { shop_id, days } = body as { shop_id: string; days: Record<string, unknown>[] };
  if (shop_id !== auth.shop_id) {
    return NextResponse.json({ error: "shop_id mismatch" }, { status: 403 });
  }
  if (!Array.isArray(days)) {
    return NextResponse.json({ error: "days must be an array" }, { status: 400 });
  }

  const synced_dates: string[] = [];
  for (const day of days) {
    await upsertDay(db, shop_id, auth.college_name, day as never);
    synced_dates.push(day.date as string);
  }
  await touchLastSynced(db, shop_id);

  return NextResponse.json({ synced: synced_dates.length, dates: synced_dates });
}
