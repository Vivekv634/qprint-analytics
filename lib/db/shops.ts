import { Db } from "mongodb";

interface ShopDoc {
  shop_id: string;
  shop_name: string;
  hostname: string;
  college_name: string;
  api_key: string;       // SHA-256 hash of the raw key
  registered_at?: Date;
  last_synced_at?: Date | null;
}

export async function insertShop(db: Db, doc: ShopDoc): Promise<void> {
  await db.collection("shops").insertOne({
    ...doc,
    registered_at: doc.registered_at ?? new Date(),
    last_synced_at: null,
  });
}

export async function findShopByApiKey(
  db: Db,
  hashedKey: string
): Promise<ShopDoc | null> {
  return db.collection<ShopDoc>("shops").findOne({ api_key: hashedKey });
}

export async function touchLastSynced(db: Db, shop_id: string): Promise<void> {
  await db
    .collection("shops")
    .updateOne({ shop_id }, { $set: { last_synced_at: new Date() } });
}
