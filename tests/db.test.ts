import { MongoMemoryServer } from "mongodb-memory-server";
import { MongoClient, Db } from "mongodb";
import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";

let mongod: MongoMemoryServer;
let client: MongoClient;
let db: Db;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  client = new MongoClient(mongod.getUri());
  await client.connect();
  db = client.db("test");
});

afterAll(async () => {
  await client.close();
  await mongod.stop();
});

beforeEach(async () => {
  await db.collection("shops").deleteMany({});
  await db.collection("daily_analytics").deleteMany({});
});

// ── shops ──────────────────────────────────────────────────────────────────

describe("insertShop", () => {
  it("inserts a shop document", async () => {
    const { insertShop } = await import("../lib/db/shops");
    await insertShop(db, {
      shop_id: "uuid-1",
      shop_name: "Test Shop",
      hostname: "qprint-test",
      college_name: "Test University",
      api_key: "hashed-key",
    });
    const doc = await db.collection("shops").findOne({ shop_id: "uuid-1" });
    expect(doc?.shop_name).toBe("Test Shop");
    expect(doc?.college_name).toBe("Test University");
  });
});

describe("findShopByApiKey", () => {
  it("returns the shop when key matches", async () => {
    const { insertShop, findShopByApiKey } = await import("../lib/db/shops");
    await insertShop(db, {
      shop_id: "uuid-1",
      shop_name: "Test Shop",
      hostname: "qprint-test",
      college_name: "Test University",
      api_key: "hashed-key-abc",
    });
    const shop = await findShopByApiKey(db, "hashed-key-abc");
    expect(shop?.shop_id).toBe("uuid-1");
  });

  it("returns null when key does not match", async () => {
    const { findShopByApiKey } = await import("../lib/db/shops");
    const shop = await findShopByApiKey(db, "wrong-key");
    expect(shop).toBeNull();
  });
});

// ── analytics ──────────────────────────────────────────────────────────────

describe("upsertDay", () => {
  it("inserts a new day document", async () => {
    const { upsertDay } = await import("../lib/db/analytics");
    await upsertDay(db, "uuid-1", "Test University", {
      date: "2026-04-07",
      jobs_completed: 10,
      jobs_errored: 1,
      jobs_dropped: 0,
      files_printed: 20,
      pages_color: 40,
      pages_bw: 80,
      revenue: 150.0,
      peak_hours: new Array(24).fill(0),
    });
    const doc = await db.collection("daily_analytics").findOne({ shop_id: "uuid-1", date: "2026-04-07" });
    expect(doc?.jobs_completed).toBe(10);
    expect(doc?.college_name).toBe("Test University");
  });

  it("upserts — calling twice with same date overwrites", async () => {
    const { upsertDay } = await import("../lib/db/analytics");
    const base = {
      date: "2026-04-07",
      jobs_completed: 10,
      jobs_errored: 0,
      jobs_dropped: 0,
      files_printed: 5,
      pages_color: 0,
      pages_bw: 10,
      revenue: 15.0,
      peak_hours: new Array(24).fill(0),
    };
    await upsertDay(db, "uuid-1", "Test University", base);
    await upsertDay(db, "uuid-1", "Test University", { ...base, jobs_completed: 20 });
    const count = await db.collection("daily_analytics").countDocuments({ shop_id: "uuid-1" });
    expect(count).toBe(1);
    const doc = await db.collection("daily_analytics").findOne({ shop_id: "uuid-1" });
    expect(doc?.jobs_completed).toBe(20);
  });
});

describe("getSummary", () => {
  it("aggregates totals across all documents", async () => {
    const { upsertDay, getSummary } = await import("../lib/db/analytics");
    await upsertDay(db, "uuid-1", "Campus A", { date: "2026-04-06", jobs_completed: 10, jobs_errored: 1, jobs_dropped: 0, files_printed: 20, pages_color: 40, pages_bw: 80, revenue: 150.0, peak_hours: new Array(24).fill(0) });
    await upsertDay(db, "uuid-2", "Campus B", { date: "2026-04-06", jobs_completed: 5,  jobs_errored: 0, jobs_dropped: 1, files_printed: 10, pages_color: 10, pages_bw: 20, revenue:  75.0, peak_hours: new Array(24).fill(0) });
    const summary = await getSummary(db);
    expect(summary.total_jobs).toBe(15);
    expect(summary.total_revenue).toBeCloseTo(225.0);
    // success_rate = 15 / (15 + 1 + 1) * 100 = 88.2...
    expect(summary.success_rate).toBeLessThan(100);
    expect(summary.success_rate).toBeGreaterThan(80);
  });

  it("returns zeros when collection is empty", async () => {
    const { getSummary } = await import("../lib/db/analytics");
    const summary = await getSummary(db);
    expect(summary.total_jobs).toBe(0);
    expect(summary.success_rate).toBe(100);
  });
});

describe("getTrends", () => {
  it("returns daily aggregates within the requested window", async () => {
    const { upsertDay, getTrends } = await import("../lib/db/analytics");
    await upsertDay(db, "uuid-1", "X", { date: "2026-04-06", jobs_completed: 10, jobs_errored: 0, jobs_dropped: 0, files_printed: 5, pages_color: 0, pages_bw: 10, revenue: 15.0, peak_hours: new Array(24).fill(0) });
    await upsertDay(db, "uuid-1", "X", { date: "2020-01-01", jobs_completed: 5,  jobs_errored: 0, jobs_dropped: 0, files_printed: 2, pages_color: 0, pages_bw:  4, revenue:  6.0, peak_hours: new Array(24).fill(0) });
    const trends = await getTrends(db, 30);
    expect(trends.length).toBe(1);
    expect(trends[0].date).toBe("2026-04-06");
  });
});

describe("getCampuses", () => {
  it("groups by college_name and counts distinct shops", async () => {
    const { upsertDay, getCampuses } = await import("../lib/db/analytics");
    await upsertDay(db, "uuid-1", "Uni A", { date: "2026-04-06", jobs_completed: 10, jobs_errored: 0, jobs_dropped: 0, files_printed: 5, pages_color: 0, pages_bw: 10, revenue: 15.0, peak_hours: new Array(24).fill(0) });
    await upsertDay(db, "uuid-2", "Uni A", { date: "2026-04-06", jobs_completed: 5,  jobs_errored: 0, jobs_dropped: 0, files_printed: 2, pages_color: 0, pages_bw:  4, revenue:  6.0, peak_hours: new Array(24).fill(0) });
    await upsertDay(db, "uuid-3", "Uni B", { date: "2026-04-06", jobs_completed: 3,  jobs_errored: 0, jobs_dropped: 0, files_printed: 1, pages_color: 0, pages_bw:  2, revenue:  3.0, peak_hours: new Array(24).fill(0) });
    const campuses = await getCampuses(db);
    const uniA = campuses.find(c => c.college_name === "Uni A");
    expect(uniA?.shops_count).toBe(2);
    expect(uniA?.jobs_completed).toBe(15);
  });
});
