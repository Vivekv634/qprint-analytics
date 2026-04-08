import { MongoMemoryServer } from "mongodb-memory-server";
import { MongoClient, Db } from "mongodb";
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import crypto from "crypto";

let mongod: MongoMemoryServer;
let client: MongoClient;
let db: Db;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  client = new MongoClient(mongod.getUri());
  await client.connect();
  db = client.db("test");

  // Insert a test shop with hashed key
  const raw = "my-secret-key";
  const hashed = crypto.createHash("sha256").update(raw).digest("hex");
  await db.collection("shops").insertOne({
    shop_id: "shop-uuid-1",
    api_key: hashed,
    college_name: "Test University",
  });
});

afterAll(async () => {
  await client.close();
  await mongod.stop();
});

describe("verifyApiKey", () => {
  it("returns shop_id for a valid key", async () => {
    const { verifyApiKey } = await import("../lib/auth");
    const result = await verifyApiKey(db, "Bearer my-secret-key");
    expect(result?.shop_id).toBe("shop-uuid-1");
  });

  it("returns null for a wrong key", async () => {
    const { verifyApiKey } = await import("../lib/auth");
    const result = await verifyApiKey(db, "Bearer wrong-key");
    expect(result).toBeNull();
  });

  it("returns null when header is missing", async () => {
    const { verifyApiKey } = await import("../lib/auth");
    const result = await verifyApiKey(db, null);
    expect(result).toBeNull();
  });

  it("returns null when header has wrong format", async () => {
    const { verifyApiKey } = await import("../lib/auth");
    const result = await verifyApiKey(db, "Token my-secret-key");
    expect(result).toBeNull();
  });
});
