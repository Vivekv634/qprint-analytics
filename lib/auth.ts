import crypto from "crypto";
import { Db } from "mongodb";
import { findShopByApiKey } from "./db/shops";

export async function verifyApiKey(
  db: Db,
  authHeader: string | null
): Promise<{ shop_id: string; college_name: string } | null> {
  if (!authHeader?.startsWith("Bearer ")) return null;
  const raw = authHeader.slice(7);
  const hashed = crypto.createHash("sha256").update(raw).digest("hex");
  const shop = await findShopByApiKey(db, hashed);
  return shop ? { shop_id: shop.shop_id, college_name: shop.college_name } : null;
}
