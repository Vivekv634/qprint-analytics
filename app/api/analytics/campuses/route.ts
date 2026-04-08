import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { getCampuses } from "@/lib/db/analytics";

export async function GET() {
  const db = await getDb();
  return NextResponse.json(await getCampuses(db));
}
