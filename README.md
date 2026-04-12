# QPrint Analytics

QPrint Analytics is the cloud analytics service that powers the Q-Print ecosystem. Every Q-Print shop on a campus automatically syncs aggregated daily print stats here every 5 minutes. Shop owners can view trends, revenue, and campus-level comparisons on a hosted dashboard — no configuration needed beyond the initial registration that Q-Print handles automatically.

**Live dashboard:** [https://q-print.vercel.app](https://q-print.vercel.app)
**Q-Print (the shop client):** [https://github.com/Vivekv634/q-print](https://github.com/Vivekv634/q-print)

---

## Table of Contents

- [How It Fits Into Q-Print](#how-it-fits-into-q-print)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [API Reference](#api-reference)
- [Data Models](#data-models)
- [Environment Variables](#environment-variables)
- [Running Locally](#running-locally)
- [Deploying](#deploying)
- [Contributing](#contributing)

---

## How It Fits Into Q-Print

```
Q-Print shop (on-premises)
  ├── FastAPI server (port 8000)          ← handles student job submissions
  ├── Next.js web app (port 3000)         ← student-facing upload UI
  ├── PySide6 admin panel                 ← shop owner queue management
  └── analytics_sync.py                  ← runs every 5 min
        │
        │  POST /api/analytics/sync
        │  Authorization: Bearer <api_key>
        ▼
QPrint Analytics  (this repo, hosted on Vercel)
  ├── MongoDB — stores daily aggregated stats per shop
  └── Dashboard — visualises trends, revenue, campus breakdowns
```

On first launch Q-Print calls `POST /api/shops/register` and saves the returned `shop_id` and `api_key` into `client/shop_config.json`. From that point on `analytics_sync.py` authenticates with that key and upserts daily stat records.

---

## Key Features

- **Automatic registration** — Q-Print shops self-register on first run; no manual admin step required.
- **Authenticated sync** — every sync request is verified with a SHA-256-hashed API key stored in MongoDB.
- **Upsert semantics** — syncing the same day twice is idempotent; the latest values always win.
- **Campus aggregation** — shops at the same college are automatically grouped for campus-level comparisons.
- **ISR dashboard** — the analytics page revalidates every 5 minutes via Next.js Incremental Static Regeneration.
- **Peak-hour heatmap** — 24-bucket hourly job counts are aggregated across all synced days.
- **Dark / light theme** — landing page and dashboard respect system preference and remember user choice via `localStorage`.

---

## Tech Stack

| Layer          | Technology                                                |
| -------------- | --------------------------------------------------------- |
| **Framework**  | Next.js 16.2.2 (App Router, Turbopack)                    |
| **UI**         | React 19, Tailwind CSS v4, Recharts 3                     |
| **Database**   | MongoDB 7 (via `mongodb` driver)                          |
| **Auth**       | SHA-256 hashed API keys (no sessions)                     |
| **Fonts**      | DM Sans, Plus Jakarta Sans, Space Grotesk, JetBrains Mono |
| **Icons**      | lucide-react 1.7                                          |
| **Testing**    | Vitest + mongodb-memory-server                            |
| **Deployment** | Vercel (serverless)                                       |

---

## Project Structure

```
qprint-analytics/
├── app/
│   ├── page.tsx                        # Landing page (server component shell)
│   ├── layout.tsx                      # Root layout — fonts, metadata
│   ├── globals.css                     # Tailwind v4 + CSS custom properties (light/dark)
│   ├── analytics/
│   │   └── page.tsx                    # Analytics dashboard (ISR, revalidate: 300 s)
│   └── api/
│       ├── shops/
│       │   └── register/route.ts       # POST — shop self-registration
│       └── analytics/
│           ├── sync/route.ts           # POST — ingest daily stats from a shop
│           ├── summary/route.ts        # GET  — global totals for the dashboard
│           ├── trends/route.ts         # GET  — daily time-series (last N days)
│           ├── peak-hours/route.ts     # GET  — 24-bucket hourly aggregation
│           └── campuses/route.ts       # GET  — per-campus breakdown
│
├── components/
│   ├── landing/
│   │   └── LandingPage.tsx             # Full landing page (client component)
│   ├── KpiCard.tsx                     # Stat card used in the dashboard
│   ├── TrendsChart.tsx                 # Recharts line/area chart
│   ├── PeakHoursBar.tsx                # 24-bar hourly chart
│   └── CampusTable.tsx                 # Campus comparison table
│
├── lib/
│   ├── mongodb.ts                      # Singleton MongoClient with dev-mode caching
│   ├── auth.ts                         # verifyApiKey helper
│   ├── utils.ts                        # Shared utilities (cn, formatters)
│   └── db/
│       ├── analytics.ts                # upsertDay, getSummary, getTrends, getPeakHours, getCampuses
│       └── shops.ts                    # insertShop, findShopByApiKey, touchLastSynced
│
├── tests/                              # Vitest integration tests (mongodb-memory-server)
├── public/                             # Static assets
├── next.config.ts
├── vitest.config.ts
└── package.json
```

---

## API Reference

All endpoints are Next.js Route Handlers under `/api/`.

### `POST /api/shops/register`

Registers a new Q-Print shop. Called automatically by Q-Print on first launch.

**Request body**

```json
{
  "shop_name": "Central Stationery",
  "hostname": "qprint-central.local",
  "college_name": "Example University"
}
```

**Response `201`**

```json
{
  "shop_id": "<uuid-v4>",
  "api_key": "<64-char hex string>"
}
```

Store both values in `client/shop_config.json` — the raw `api_key` is never stored on the server (only its SHA-256 hash).

---

### `POST /api/analytics/sync`

Ingests one or more days of aggregated stats for a shop. Idempotent — re-syncing the same date overwrites the previous record.

**Headers**

```
Authorization: Bearer <api_key>
```

**Request body**

```json
{
  "shop_id": "<uuid-v4>",
  "days": [
    {
      "date":            "2025-04-11",
      "jobs_completed":  47,
      "jobs_errored":    1,
      "jobs_dropped":    2,
      "files_printed":   62,
      "pages_color":     184,
      "pages_bw":        430,
      "revenue":         2310.00,
      "peak_hours":      [0,0,0,0,0,0,2,8,14,21,...]
    }
  ]
}
```

`peak_hours` must be an array of exactly 24 non-negative integers (job count per clock hour).

**Response `200`**

```json
{ "synced": 1, "dates": ["2025-04-11"] }
```

---

### `GET /api/analytics/summary`

Returns global totals across all shops and all time.

**Response**

```json
{
  "total_jobs": 142000,
  "total_files": 195000,
  "total_pages_color": 520000,
  "total_pages_bw": 1200000,
  "total_revenue": 4800000.0,
  "success_rate": 97.4
}
```

`success_rate` = `jobs_completed / (jobs_completed + jobs_errored + jobs_dropped) × 100`, rounded to one decimal.

---

### `GET /api/analytics/trends?days=30`

Returns a daily time-series for the last `days` days (default: 30, max: 90).

**Response**

```json
[
  { "date": "2025-03-13", "jobs_completed": 120, "jobs_errored": 2, "revenue": 6800.00 },
  ...
]
```

---

### `GET /api/analytics/peak-hours`

Returns 24 integers representing total job counts per clock hour across all shops and all time.

**Response**

```json
[
  0, 0, 0, 0, 1, 3, 18, 74, 210, 340, 280, 190, 160, 200, 310, 290, 240, 180,
  90, 42, 20, 8, 2, 0
]
```

---

### `GET /api/analytics/campuses`

Returns per-campus aggregated stats, sorted by `jobs_completed` descending.

**Response**

```json
[
  {
    "college_name":   "Example University",
    "shops_count":    3,
    "jobs_completed": 48200,
    "revenue":        241000.00
  },
  ...
]
```

---

## Data Models

### `daily_analytics` collection

One document per `(shop_id, date)` pair — upserted on every sync.

| Field            | Type     | Description                              |
| ---------------- | -------- | ---------------------------------------- |
| `shop_id`        | string   | UUID v4 assigned at registration         |
| `college_name`   | string   | Copied from the shop record at sync time |
| `date`           | string   | `YYYY-MM-DD`                             |
| `jobs_completed` | number   | Successfully printed jobs                |
| `jobs_errored`   | number   | Jobs that failed during printing         |
| `jobs_dropped`   | number   | Jobs cancelled by the student            |
| `files_printed`  | number   | Total individual PDF files printed       |
| `pages_color`    | number   | Colour pages printed                     |
| `pages_bw`       | number   | Black-and-white pages printed            |
| `revenue`        | number   | Revenue in INR                           |
| `peak_hours`     | number[] | Array of 24 counts, one per clock hour   |
| `synced_at`      | Date     | Last upsert timestamp                    |

### `shops` collection

| Field            | Type   | Description                           |
| ---------------- | ------ | ------------------------------------- |
| `shop_id`        | string | UUID v4                               |
| `shop_name`      | string | Human-readable shop name              |
| `hostname`       | string | mDNS hostname (`qprint-<slug>.local`) |
| `college_name`   | string | College / university name             |
| `api_key`        | string | SHA-256 hash of the raw API key       |
| `registered_at`  | Date   | Registration timestamp                |
| `last_synced_at` | Date   | Timestamp of the most recent sync     |

---

## Environment Variables

Create a `.env.local` file at the project root:

```env
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/
MONGODB_DB=qprint
```

| Variable      | Required | Default  | Description                      |
| ------------- | -------- | -------- | -------------------------------- |
| `MONGODB_URI` | Yes      | —        | Full MongoDB connection string   |
| `MONGODB_DB`  | No       | `qprint` | Database name inside the cluster |

---

## Running Locally

```bash
# 1. Install dependencies
npm install

# 2. Create environment file
cp .env.example .env.local   # then fill in MONGODB_URI

# 3. Start dev server (Turbopack)
npm run dev
```

The app is available at `http://localhost:3000`.

### Running tests

```bash
npm test          # run once
npm run test:watch  # watch mode
```

Tests use `mongodb-memory-server` — no real database needed.

---

## Contributing

Contributions are welcome — bug reports, feature requests, and pull requests alike.

1. Fork the repository and create a feature branch.
2. Follow the [Running Locally](#running-locally) steps.
3. Make your changes and run `npm test` to verify nothing is broken.
4. Open a pull request with a clear description of what changed and why.

For ideas or feedback, open a GitHub issue or reach out to the developer at [github.com/Vivekv634](https://github.com/Vivekv634).
