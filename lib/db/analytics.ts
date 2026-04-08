import { Db } from "mongodb";

interface DayPayload {
  date: string;          // "YYYY-MM-DD"
  jobs_completed: number;
  jobs_errored: number;
  jobs_dropped: number;
  files_printed: number;
  pages_color: number;
  pages_bw: number;
  revenue: number;
  peak_hours: number[];  // length 24
}

export async function upsertDay(
  db: Db,
  shop_id: string,
  college_name: string,
  day: DayPayload
): Promise<void> {
  await db.collection("daily_analytics").updateOne(
    { shop_id, date: day.date },
    { $set: { ...day, shop_id, college_name, synced_at: new Date() } },
    { upsert: true }
  );
}

export async function getSummary(db: Db) {
  const [row] = await db
    .collection("daily_analytics")
    .aggregate([
      {
        $group: {
          _id: null,
          total_jobs:        { $sum: "$jobs_completed" },
          total_files:       { $sum: "$files_printed" },
          total_pages_color: { $sum: "$pages_color" },
          total_pages_bw:    { $sum: "$pages_bw" },
          total_revenue:     { $sum: "$revenue" },
          total_errored:     { $sum: "$jobs_errored" },
          total_dropped:     { $sum: "$jobs_dropped" },
        },
      },
    ])
    .toArray();

  if (!row) {
    return {
      total_jobs: 0, total_files: 0, total_pages_color: 0,
      total_pages_bw: 0, total_revenue: 0, success_rate: 100,
    };
  }

  const attempts = row.total_jobs + row.total_errored + row.total_dropped;
  const success_rate =
    attempts > 0
      ? Math.round((row.total_jobs / attempts) * 1000) / 10
      : 100;

  return {
    total_jobs:        row.total_jobs,
    total_files:       row.total_files,
    total_pages_color: row.total_pages_color,
    total_pages_bw:    row.total_pages_bw,
    total_revenue:     row.total_revenue,
    success_rate,
  };
}

export async function getTrends(db: Db, days: number) {
  const since = new Date();
  since.setDate(since.getDate() - days);
  const sinceStr = since.toISOString().slice(0, 10);

  return db
    .collection("daily_analytics")
    .aggregate([
      { $match: { date: { $gte: sinceStr } } },
      {
        $group: {
          _id:            "$date",
          jobs_completed: { $sum: "$jobs_completed" },
          jobs_errored:   { $sum: "$jobs_errored" },
          revenue:        { $sum: "$revenue" },
        },
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          _id: 0,
          date:           "$_id",
          jobs_completed: 1,
          jobs_errored:   1,
          revenue:        1,
        },
      },
    ])
    .toArray();
}

export async function getPeakHours(db: Db): Promise<number[]> {
  const docs = await db.collection("daily_analytics").find({}).toArray();
  const hours = new Array(24).fill(0) as number[];
  for (const doc of docs) {
    if (Array.isArray(doc.peak_hours)) {
      (doc.peak_hours as number[]).forEach((count, i) => {
        hours[i] += count;
      });
    }
  }
  return hours;
}

export async function getCampuses(db: Db) {
  return db
    .collection("daily_analytics")
    .aggregate([
      {
        $group: {
          _id:            "$college_name",
          jobs_completed: { $sum: "$jobs_completed" },
          revenue:        { $sum: "$revenue" },
          shop_ids:       { $addToSet: "$shop_id" },
        },
      },
      {
        $project: {
          _id:            0,
          college_name:   "$_id",
          jobs_completed: 1,
          revenue:        1,
          shops_count:    { $size: "$shop_ids" },
        },
      },
      { $sort: { jobs_completed: -1 } },
    ])
    .toArray();
}
