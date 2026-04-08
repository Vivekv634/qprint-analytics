import { NextResponse } from "next/server";
import crypto from "crypto";
import { v4 as uuidv4 } from "uuid";
import { getDb } from "@/lib/mongodb";
import { insertShop } from "@/lib/db/shops";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { shop_name, hostname, college_name } = body as Record<string, string>;
  if (!shop_name || !hostname || !college_name) {
    return NextResponse.json({ error: "shop_name, hostname, and college_name are required" }, { status: 400 });
  }

  const shop_id = uuidv4();
  const api_key_raw = crypto.randomBytes(32).toString("hex");
  const api_key_hashed = crypto.createHash("sha256").update(api_key_raw).digest("hex");

  const db = await getDb();
  await insertShop(db, { shop_id, shop_name, hostname, college_name, api_key: api_key_hashed });

  return NextResponse.json({ shop_id, api_key: api_key_raw }, { status: 201 });
}
