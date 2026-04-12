"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  ChevronDown,
  Cpu,
  Database,
  ExternalLink,
  GitBranch,
  HardDrive,
  MapPin,
  Monitor,
  Moon,
  Package,
  Printer,
  Sun,
  Terminal,
  Wifi,
  Zap,
} from "lucide-react";

interface SummaryData {
  total_jobs: number;
  total_files: number;
  total_pages_color: number;
  total_pages_bw: number;
  total_revenue: number;
  success_rate: number;
}

interface CampusData {
  college_name: string;
  shops_count: number;
  jobs_completed: number;
  revenue: number;
}

function useCounter(end: number, duration = 2600) {
  const [count, setCount] = useState(0);
  const start = useCallback(() => {
    if (end === 0) return;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - t0) / duration, 1);
      const e = 1 - Math.pow(1 - p, 3);
      setCount(Math.floor(e * end));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [end, duration]);
  return { count, start };
}

function useInView(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

function GithubIcon({ size = 17 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2Z" />
    </svg>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        fontSize: "10px",
        letterSpacing: "0.13em",
        textTransform: "uppercase",
        color: "var(--lp-accent)",
        fontWeight: 700,
        margin: "0 0 16px",
      }}
    >
      § {children}
    </p>
  );
}

function SectionHeading({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <h2
      style={{
        fontFamily: "var(--font-space-grotesk, 'Space Grotesk', sans-serif)",
        fontSize: "clamp(1.8rem, 3.5vw, 3rem)",
        fontWeight: 800,
        letterSpacing: "-0.04em",
        color: "var(--lp-text)",
        margin: "0 0 14px",
        ...style,
      }}
    >
      {children}
    </h2>
  );
}

/* Vertical step chain used in the "How it works" flow cards */
function FlowStep({
  n,
  label,
  detail,
  last = false,
}: {
  n: number;
  label: string;
  detail?: string;
  last?: boolean;
}) {
  return (
    <div style={{ display: "flex", gap: "11px" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: "22px",
            height: "22px",
            borderRadius: "50%",
            background: "var(--lp-accent-bg-2)",
            border: "1px solid var(--lp-accent-border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "10px",
            fontWeight: 700,
            color: "var(--lp-accent)",
            flexShrink: 0,
          }}
        >
          {n}
        </div>
        {!last && (
          <div
            style={{
              width: "1px",
              flex: 1,
              minHeight: "14px",
              background: "var(--lp-step-line)",
              marginTop: "3px",
            }}
          />
        )}
      </div>
      <div style={{ paddingBottom: last ? 0 : "13px" }}>
        <p
          style={{
            margin: "2px 0 3px",
            fontSize: "12px",
            fontWeight: 600,
            color: "var(--lp-text)",
            lineHeight: 1.3,
          }}
        >
          {label}
        </p>
        {detail && (
          <code
            style={{
              fontSize: "10px",
              color: "var(--lp-code-text)",
              fontFamily:
                "var(--font-jetbrains-mono, 'JetBrains Mono', monospace)",
              lineHeight: 1.4,
            }}
          >
            {detail}
          </code>
        )}
      </div>
    </div>
  );
}

/* Icon + text item for requirements list */
function ReqItem({
  icon: Icon,
  text,
}: {
  icon: React.ComponentType<{
    size?: number;
    strokeWidth?: number;
    style?: React.CSSProperties;
  }>;
  text: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "10px",
        padding: "10px 12px",
        background: "var(--lp-surface)",
        border: "1px solid var(--lp-border)",
        borderRadius: "8px",
      }}
    >
      <Icon
        size={13}
        strokeWidth={1.5}
        style={{ color: "var(--lp-accent)", flexShrink: 0, marginTop: "1px" }}
      />
      <span
        style={{ fontSize: "12px", color: "var(--lp-text-2)", lineHeight: 1.5 }}
      >
        {text}
      </span>
    </div>
  );
}

/* Terminal-styled install step */
function InstallStep({
  n,
  title,
  cmds,
  comment,
}: {
  n: number;
  title: string;
  cmds: string[];
  comment?: string;
}) {
  return (
    <div style={{ display: "flex", gap: "14px" }}>
      <div
        style={{
          flexShrink: 0,
          width: "26px",
          height: "26px",
          borderRadius: "50%",
          background: "var(--lp-accent-bg-2)",
          border: "1px solid var(--lp-accent-border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "11px",
          fontWeight: 700,
          color: "var(--lp-accent)",
          marginTop: "3px",
        }}
      >
        {n}
      </div>
      <div style={{ flex: 1 }}>
        <p
          style={{
            margin: "0 0 7px",
            fontSize: "13px",
            fontWeight: 600,
            color: "var(--lp-text-2)",
          }}
        >
          {title}
        </p>
        <div
          style={{
            background: "var(--lp-code-bg)",
            border: "1px solid var(--lp-border)",
            borderRadius: "8px",
            padding: "11px 14px",
            fontFamily:
              "var(--font-jetbrains-mono, 'JetBrains Mono', monospace)",
            fontSize: "12px",
          }}
        >
          {comment && (
            <div
              style={{ color: "var(--lp-code-comment)", marginBottom: "5px" }}
            >
              {comment}
            </div>
          )}
          {cmds.map((cmd, i) => (
            <div
              key={i}
              style={{ marginBottom: i < cmds.length - 1 ? "4px" : 0 }}
            >
              <span
                style={{ color: "var(--lp-code-prompt)", userSelect: "none" }}
              >
                ${" "}
              </span>
              <span style={{ color: "var(--lp-code-text)" }}>{cmd}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* Contribution area card */
function ContributeCard({
  icon: Icon,
  title,
  desc,
}: {
  icon: React.ComponentType<{
    size?: number;
    strokeWidth?: number;
    style?: React.CSSProperties;
  }>;
  title: string;
  desc: string;
}) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? "var(--lp-contrib-hover)" : "var(--lp-contrib-bg)",
        border: `1px solid ${hov ? "var(--lp-contrib-border-hover)" : "var(--lp-contrib-border)"}`,
        borderRadius: "12px",
        padding: "20px",
        transition: "border-color 0.2s, background 0.2s",
        cursor: "default",
      }}
    >
      <div
        style={{
          width: "34px",
          height: "34px",
          borderRadius: "8px",
          background: "var(--lp-accent-bg)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "12px",
        }}
      >
        <Icon
          size={15}
          strokeWidth={1.5}
          style={{ color: "var(--lp-accent)" }}
        />
      </div>
      <p
        style={{
          margin: "0 0 5px",
          fontSize: "13px",
          fontWeight: 600,
          color: "var(--lp-text)",
        }}
      >
        {title}
      </p>
      <p
        style={{
          margin: 0,
          fontSize: "11px",
          color: "var(--lp-text-3)",
          lineHeight: 1.55,
        }}
      >
        {desc}
      </p>
    </div>
  );
}

/* ─────────────────────────────────────────────────────
   Main Component
   ───────────────────────────────────────────────────── */

export default function LandingPage() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [campuses, setCampuses] = useState<CampusData[]>([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const totalJobs = summary?.total_jobs ?? 0;
  const { count, start } = useCounter(totalJobs);

  const whySec = useInView();
  const howSec = useInView();
  const installSec = useInView();
  const creatorSec = useInView();
  const contribSec = useInView();

  /* Fetch real analytics data — no hardcoded numbers */
  useEffect(() => {
    Promise.all([
      fetch("/api/analytics/summary")
        .then((r) => (r.ok ? r.json() : null))
        .catch(() => null),
      fetch("/api/analytics/campuses")
        .then((r) => (r.ok ? r.json() : []))
        .catch(() => []),
    ]).then(([s, c]: [SummaryData | null, CampusData[]]) => {
      if (s) setSummary(s);
      if (Array.isArray(c)) setCampuses(c);
      setDataLoaded(true);
    });
  }, []);

  /* Animate counter after data loads */
  useEffect(() => {
    if (!dataLoaded || totalJobs === 0) return;
    const t = setTimeout(start, 500);
    return () => clearTimeout(t);
  }, [dataLoaded, totalJobs, start]);

  /* Sticky nav */
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  /* Persist theme preference */
  useEffect(() => {
    const saved = localStorage.getItem("lp-theme") as "dark" | "light" | null;
    if (saved) setTheme(saved);
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("lp-theme", next);
  };

  const reveal = (inView: boolean): React.CSSProperties => ({
    opacity: inView ? 1 : 0,
    transform: inView ? "translateY(0)" : "translateY(28px)",
    transition: "opacity 0.65s ease, transform 0.65s ease",
  });

  /* Derived stats from real API data */
  const campusCount = campuses.length;
  const totalShops = campuses.reduce((s, c) => s + (c.shops_count || 0), 0);
  const successRate = summary ? `${summary.success_rate}%` : "—";
  const totalRevenue = summary
    ? summary.total_revenue >= 100000
      ? `₹${(summary.total_revenue / 100000).toFixed(1)}L`
      : `₹${(summary.total_revenue / 1000).toFixed(0)}K`
    : "—";

  const pad = "clamp(20px, 5vw, 64px)";
  const innerMax = "1100px";

  return (
    <div
      data-lp-theme={theme}
      style={{
        background: "var(--lp-bg)",
        color: "var(--lp-text)",
        minHeight: "100vh",
        fontFamily: "var(--font-dm-sans, 'DM Sans', system-ui, sans-serif)",
      }}
    >
      {/* ═══════════════════════════════ NAV ═══════════════════════════════ */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: `0 ${pad}`,
          height: "58px",
          background: scrolled ? "var(--lp-nav-bg)" : "transparent",
          backdropFilter: scrolled ? "blur(14px)" : "none",
          borderBottom: scrolled
            ? "1px solid var(--lp-border)"
            : "1px solid transparent",
          transition:
            "background 0.3s, backdrop-filter 0.3s, border-color 0.3s",
        }}
      >
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "9px" }}>
          <div
            style={{
              width: "26px",
              height: "26px",
              borderRadius: "6px",
              background: "linear-gradient(135deg, var(--lp-accent), #e8950f)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "12px",
              fontWeight: 800,
              color: "var(--lp-cta-pill-text)",
              fontFamily: "var(--font-space-grotesk, sans-serif)",
            }}
          >
            Q
          </div>
          <span
            style={{
              fontFamily:
                "var(--font-space-grotesk, 'Space Grotesk', sans-serif)",
              fontWeight: 700,
              fontSize: "14px",
              color: "var(--lp-text)",
              letterSpacing: "-0.02em",
            }}
          >
            QPrint Analytics
          </span>
        </div>

        {/* Right actions */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <button
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "34px",
              height: "34px",
              borderRadius: "8px",
              background: "var(--lp-toggle-bg)",
              border: "1px solid var(--lp-toggle-border)",
              cursor: "pointer",
              color: "var(--lp-text-2)",
              transition: "background 0.2s, color 0.2s",
            }}
          >
            {theme === "dark" ? (
              <Sun size={15} strokeWidth={1.5} />
            ) : (
              <Moon size={15} strokeWidth={1.5} />
            )}
          </button>
          <Link
            href="/analytics"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "13px",
              fontWeight: 600,
              color: "var(--lp-cta-pill-text)",
              background: "var(--lp-cta-pill-bg)",
              padding: "7px 16px",
              borderRadius: "8px",
              textDecoration: "none",
            }}
          >
            Dashboard <ArrowRight size={13} strokeWidth={2.5} />
          </Link>
        </div>
      </nav>

      {/* ═══════════════════════════════ HERO ══════════════════════════════ */}
      <section
        style={{
          position: "relative",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: `80px ${pad} 70px`,
          overflow: "hidden",
        }}
      >
        {/* Background dot grid */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            backgroundImage:
              "radial-gradient(circle, var(--lp-dot-grid) 1px, transparent 1px)",
            backgroundSize: "26px 26px",
          }}
        />

        {/* Amber glow blob */}
        <div
          style={{
            position: "absolute",
            top: "15%",
            right: "8%",
            width: "480px",
            height: "480px",
            borderRadius: "50%",
            pointerEvents: "none",
            background:
              "radial-gradient(circle, var(--lp-glow-blob) 0%, transparent 70%)",
          }}
        />

        {/* Ghost letterform — differentiation anchor */}
        <div
          style={{
            position: "absolute",
            bottom: "-6%",
            right: "-3%",
            pointerEvents: "none",
            zIndex: 0,
            fontSize: "clamp(160px, 28vw, 340px)",
            fontFamily:
              "var(--font-space-grotesk, 'Space Grotesk', sans-serif)",
            fontWeight: 800,
            color: "transparent",
            WebkitTextStroke: "var(--lp-outline-stroke)",
            lineHeight: 0.85,
            letterSpacing: "-0.05em",
            userSelect: "none",
          }}
        >
          QPrint
        </div>

        {/* Content row */}
        <div
          style={{
            position: "relative",
            zIndex: 1,
            display: "flex",
            flexWrap: "wrap",
            gap: "clamp(40px, 6vw, 80px)",
            alignItems: "center",
            maxWidth: innerMax,
            margin: "0 auto",
            width: "100%",
          }}
        >
          {/* Left: headline + CTAs */}
          <div style={{ flex: "1 1 340px" }}>
            {/* Badge */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "7px",
                fontSize: "10px",
                fontWeight: 700,
                letterSpacing: "0.13em",
                textTransform: "uppercase",
                color: "var(--lp-accent)",
                background: "var(--lp-accent-bg)",
                border: "1px solid var(--lp-accent-border)",
                padding: "5px 13px",
                borderRadius: "100px",
                marginBottom: "28px",
                animation: "lp-fade-in 0.6s ease both",
              }}
            >
              <span
                style={{
                  width: "5px",
                  height: "5px",
                  borderRadius: "50%",
                  background: "var(--lp-accent)",
                  animation: "lp-pulse 2.2s ease-in-out infinite",
                }}
              />
              Print Intelligence Platform
            </div>

            {/* H1 */}
            <h1
              style={{
                fontFamily:
                  "var(--font-space-grotesk, 'Space Grotesk', sans-serif)",
                fontSize: "clamp(2.6rem, 6.5vw, 5.8rem)",
                fontWeight: 800,
                lineHeight: 1.01,
                letterSpacing: "-0.04em",
                color: "var(--lp-text)",
                margin: "0 0 22px",
                animation: "lp-slide-up 0.7s ease both",
                animationDelay: "0.08s",
              }}
            >
              Every print.
              <br />
              <span style={{ color: "var(--lp-accent)" }}>Counted.</span>
              <br />
              Understood.
            </h1>

            {/* Subtitle */}
            <p
              style={{
                fontSize: "clamp(14px, 1.7vw, 16px)",
                color: "var(--lp-text-2)",
                lineHeight: 1.65,
                margin: "0 0 36px",
                maxWidth: "400px",
                animation: "lp-slide-up 0.7s ease both",
                animationDelay: "0.18s",
              }}
            >
              QPrint Analytics is the intelligence layer for Q-Print campus shop
              networks — tracking every print job, revenue stream, and failure
              in real time across all campuses.
            </p>

            {/* CTAs */}
            <div
              style={{
                display: "flex",
                gap: "12px",
                flexWrap: "wrap",
                animation: "lp-slide-up 0.7s ease both",
                animationDelay: "0.28s",
              }}
            >
              <Link
                href="/analytics"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "7px",
                  padding: "11px 22px",
                  background: "var(--lp-cta-pill-bg)",
                  color: "var(--lp-cta-pill-text)",
                  borderRadius: "10px",
                  fontSize: "14px",
                  fontWeight: 700,
                  textDecoration: "none",
                  fontFamily: "var(--font-space-grotesk, sans-serif)",
                }}
              >
                View Dashboard <ArrowRight size={14} strokeWidth={2.5} />
              </Link>
              <a
                href="#how-it-works"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "11px 22px",
                  background: "transparent",
                  color: "var(--lp-text-2)",
                  border: "1px solid var(--lp-border-2)",
                  borderRadius: "10px",
                  fontSize: "14px",
                  fontWeight: 500,
                  textDecoration: "none",
                }}
              >
                How it works <ChevronDown size={13} />
              </a>
            </div>
          </div>

          {/* Right: live stats card — only real data from API */}
          <div
            style={{
              flex: "0 0 auto",
              width: "clamp(280px, 35vw, 360px)",
              animation: "lp-slide-up 0.8s ease both",
              animationDelay: "0.32s",
            }}
          >
            <div
              style={{
                background: "var(--lp-card-bg)",
                border: "1px solid var(--lp-card-border)",
                borderRadius: "16px",
                padding: "28px",
                boxShadow:
                  "0 0 80px var(--lp-card-glow), inset 0 1px 0 var(--lp-border)",
              }}
            >
              {/* Live label */}
              <div
                style={{
                  fontSize: "10px",
                  fontWeight: 600,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "var(--lp-text-3)",
                  marginBottom: "18px",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <span
                  style={{
                    width: "5px",
                    height: "5px",
                    borderRadius: "50%",
                    background: "var(--lp-live-dot)",
                    animation: "lp-pulse 1.8s ease-in-out infinite",
                  }}
                />
                {dataLoaded ? "Live system total" : "Loading…"}
              </div>

              {/* Animated counter — value from API */}
              <div
                style={{
                  fontFamily:
                    "var(--font-jetbrains-mono, 'JetBrains Mono', monospace)",
                  fontSize: "clamp(2.4rem, 4.5vw, 3.6rem)",
                  fontWeight: 700,
                  color: "var(--lp-accent)",
                  letterSpacing: "-0.02em",
                  lineHeight: 1,
                  marginBottom: "6px",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {dataLoaded ? count.toLocaleString() : "—"}
              </div>
              <p
                style={{
                  margin: "0 0 22px",
                  fontSize: "12px",
                  color: "var(--lp-text-3)",
                }}
              >
                print jobs processed
              </p>

              {/* Mini stats — all from API */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "12px",
                  paddingTop: "18px",
                  borderTop: "1px solid var(--lp-divider)",
                }}
              >
                {[
                  {
                    label: "Campuses",
                    value: dataLoaded
                      ? campusCount > 0
                        ? String(campusCount)
                        : "—"
                      : "…",
                  },
                  {
                    label: "Success rate",
                    value: dataLoaded ? successRate : "…",
                  },
                  {
                    label: "Active shops",
                    value: dataLoaded
                      ? totalShops > 0
                        ? String(totalShops)
                        : "—"
                      : "…",
                  },
                  {
                    label: "Revenue total",
                    value: dataLoaded ? totalRevenue : "…",
                  },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p
                      style={{
                        margin: 0,
                        fontFamily:
                          "var(--font-space-grotesk, 'Space Grotesk', sans-serif)",
                        fontSize: "18px",
                        fontWeight: 700,
                        color: "var(--lp-text)",
                        letterSpacing: "-0.02em",
                      }}
                    >
                      {value}
                    </p>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "11px",
                        color: "var(--lp-text-3)",
                      }}
                    >
                      {label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Scroll cue */}
        <div
          style={{
            position: "absolute",
            bottom: "28px",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "7px",
            animation: "lp-fade-in 1.2s ease both",
            animationDelay: "1.2s",
          }}
        >
          <span
            style={{
              fontSize: "9px",
              letterSpacing: "0.13em",
              color: "var(--lp-text-3)",
              textTransform: "uppercase",
            }}
          >
            Scroll
          </span>
          <div
            style={{
              width: "1px",
              height: "36px",
              background:
                "linear-gradient(to bottom, var(--lp-accent), transparent)",
              animation: "lp-scroll-line 1.8s ease-in-out infinite",
            }}
          />
        </div>
      </section>

      {/* ═══════════════════════════ WHY / WHAT ════════════════════════════ */}
      <div
        ref={whySec.ref}
        style={{
          padding: `96px ${pad}`,
          background: "var(--lp-bg-alt)",
          ...reveal(whySec.inView),
        }}
      >
        <div style={{ maxWidth: innerMax, margin: "0 auto" }}>
          <SectionLabel>Why QPrint</SectionLabel>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "clamp(40px, 8vw, 100px)",
              alignItems: "flex-start",
            }}
          >
            {/* Left: Problem / Solution */}
            <div style={{ flex: "1 1 320px" }}>
              <SectionHeading>
                Print shops operating
                <br />
                <span
                  style={{
                    color: "transparent",
                    WebkitTextStroke: "1.5px var(--lp-accent-border-2)",
                  }}
                >
                  completely blind.
                </span>
              </SectionHeading>

              <p
                style={{
                  fontSize: "15px",
                  lineHeight: 1.7,
                  color: "var(--lp-text-2)",
                  margin: "0 0 0",
                  maxWidth: "440px",
                }}
              >
                University print shops process thousands of jobs every week —
                but without a centralised data layer, operators cannot identify
                peak demand, catch failures early, or understand which campuses
                are underserved. Revenue leaks. Opportunities vanish.
              </p>
              <div
                style={{
                  height: "1px",
                  background:
                    "linear-gradient(to right, var(--lp-accent-border-2), transparent)",
                  margin: "28px 0",
                  maxWidth: "280px",
                }}
              />
              <p
                style={{
                  fontSize: "15px",
                  lineHeight: 1.7,
                  color: "var(--lp-text-2)",
                  margin: 0,
                  maxWidth: "440px",
                }}
              >
                QPrint Analytics is the cloud dashboard Q-Print shops sync to —
                giving campus administrators a single source of truth for every
                job, across every shop, in real time.
              </p>
            </div>

            {/* Right: live stat cards */}
            <div
              style={{
                flex: "0 1 340px",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              {[
                {
                  num: dataLoaded
                    ? campusCount > 0
                      ? `${campusCount}`
                      : "—"
                    : "…",
                  label: "Campuses Monitored",
                  desc: "Multi-university deployment",
                },
                {
                  num: "5m",
                  label: "Sync Frequency",
                  desc: "Data never more than 5 minutes stale",
                },
                {
                  num: dataLoaded ? successRate : "…",
                  label: "Job Success Rate",
                  desc: "Reliability tracked across all active shops",
                },
                {
                  num: "90d",
                  label: "Trend History",
                  desc: "Analyse up to 90 days of print trend data",
                },
              ].map(({ num, label, desc }) => (
                <div
                  key={label}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "18px",
                    padding: "16px 18px",
                    background: "var(--lp-stat-bg)",
                    border: "1px solid var(--lp-border)",
                    borderLeft: "3px solid var(--lp-stat-left)",
                    borderRadius: "0 10px 10px 0",
                  }}
                >
                  <span
                    style={{
                      fontFamily:
                        "var(--font-space-grotesk, 'Space Grotesk', sans-serif)",
                      fontSize: "26px",
                      fontWeight: 800,
                      color: "var(--lp-accent)",
                      lineHeight: 1,
                      flexShrink: 0,
                      minWidth: "52px",
                      letterSpacing: "-0.03em",
                    }}
                  >
                    {num}
                  </span>
                  <div>
                    <p
                      style={{
                        margin: "0 0 2px",
                        fontSize: "13px",
                        fontWeight: 600,
                        color: "var(--lp-text)",
                      }}
                    >
                      {label}
                    </p>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "11px",
                        color: "var(--lp-text-3)",
                      }}
                    >
                      {desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ═════════════════════════ HOW IT WORKS ════════════════════════════ */}
      <div
        id="how-it-works"
        ref={howSec.ref}
        style={{
          padding: `96px ${pad}`,
          background: "var(--lp-bg)",
          ...reveal(howSec.inView),
        }}
      >
        <div style={{ maxWidth: innerMax, margin: "0 auto" }}>
          <SectionLabel>Data Flow</SectionLabel>
          <SectionHeading>How it works</SectionHeading>
          <p
            style={{
              fontSize: "14px",
              color: "var(--lp-text-2)",
              margin: "0 0 52px",
              maxWidth: "480px",
              lineHeight: 1.65,
            }}
          >
            Q-Print is an end-to-end print queue management system. Every job a
            student submits flows through a transparent pipeline — and the
            aggregated intelligence surfaces here.
          </p>

          {/* Three flow cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "16px",
              marginBottom: "48px",
            }}
          >
            {/* Card 1: Student submits job */}
            <div
              style={{
                background: "var(--lp-surface)",
                border: "1px solid var(--lp-border)",
                borderRadius: "14px",
                padding: "24px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginBottom: "20px",
                }}
              >
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "8px",
                    background: "var(--lp-node-icon-bg-accent)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Printer
                    size={15}
                    strokeWidth={1.5}
                    style={{ color: "var(--lp-accent)" }}
                  />
                </div>
                <p
                  style={{
                    margin: 0,
                    fontSize: "13px",
                    fontWeight: 700,
                    color: "var(--lp-text)",
                    fontFamily: "var(--font-space-grotesk, sans-serif)",
                  }}
                >
                  Student Prints
                </p>
              </div>
              <FlowStep
                n={1}
                label="Upload PDF at campus shop"
                detail="qprint-<slug>.local:3000"
              />
              <FlowStep
                n={2}
                label="Picks settings — colour, copies, paper size"
              />
              <FlowStep
                n={3}
                label="Job submitted"
                detail="POST /api/jobs/upload"
              />
              <FlowStep
                n={4}
                label="File stored + DB record created"
                detail="qprint.db (SQLite) + file storage"
              />
              <FlowStep
                n={5}
                label="FastAPI (port 8000) confirms job queued"
                last
              />
            </div>

            {/* Card 2: Admin dispatches */}
            <div
              style={{
                background: "var(--lp-surface)",
                border: "1px solid var(--lp-border)",
                borderRadius: "14px",
                padding: "24px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginBottom: "20px",
                }}
              >
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "8px",
                    background: "var(--lp-node-icon-bg-accent)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Monitor
                    size={15}
                    strokeWidth={1.5}
                    style={{ color: "var(--lp-accent)" }}
                  />
                </div>
                <p
                  style={{
                    margin: 0,
                    fontSize: "13px",
                    fontWeight: 700,
                    color: "var(--lp-text)",
                    fontFamily: "var(--font-space-grotesk, sans-serif)",
                  }}
                >
                  Admin Dispatches
                </p>
              </div>
              <FlowStep
                n={1}
                label="QueuePanel auto-refreshes (QFileSystemWatcher)"
              />
              <FlowStep
                n={2}
                label="Admin double-clicks job → JobDetailDialog"
              />
              <FlowStep n={3} label="Selects printer and clicks Print" />
              <FlowStep
                n={4}
                label="PyMuPDF renders PDF pages at printer DPI"
              />
              <FlowStep
                n={5}
                label="win32print sends to physical printer (Windows)"
                detail="printer_manager.py"
                last
              />
            </div>

            {/* Card 3: Analytics sync */}
            <div
              style={{
                background: "var(--lp-surface)",
                border: "1px solid var(--lp-border)",
                borderRadius: "14px",
                padding: "24px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginBottom: "20px",
                }}
              >
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "8px",
                    background: "var(--lp-node-icon-bg-accent)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <BarChart3
                    size={15}
                    strokeWidth={1.5}
                    style={{ color: "var(--lp-accent)" }}
                  />
                </div>
                <p
                  style={{
                    margin: 0,
                    fontSize: "13px",
                    fontWeight: 700,
                    color: "var(--lp-text)",
                    fontFamily: "var(--font-space-grotesk, sans-serif)",
                  }}
                >
                  Analytics Sync
                </p>
              </div>
              <FlowStep
                n={1}
                label="analytics_sync.py runs every 5 minutes"
                detail="analytics_sync.py"
              />
              <FlowStep n={2} label="Aggregates daily job stats per shop" />
              <FlowStep
                n={3}
                label="Pushes to cloud analytics service"
                detail="POST /api/analytics/sync"
              />
              <FlowStep
                n={4}
                label="QPrint Analytics processes and stores data"
              />
              <FlowStep
                n={5}
                label="Dashboard reflects latest insights in real time"
                last
              />
            </div>
          </div>

          {/* API reference panel */}
          <div
            style={{
              background: "var(--lp-api-bg)",
              border: "1px solid var(--lp-api-border)",
              borderRadius: "14px",
              padding: "24px 28px",
              display: "flex",
              flexWrap: "wrap",
              gap: "32px",
            }}
          >
            <div style={{ flex: "1 1 200px" }}>
              <p
                style={{
                  margin: "0 0 14px",
                  fontSize: "10px",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "var(--lp-accent)",
                }}
              >
                Tracked per Shop
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "7px" }}>
                {[
                  "Jobs Completed",
                  "Jobs Errored",
                  "Files Printed",
                  "Color Pages",
                  "B&W Pages",
                  "Revenue (₹)",
                  "Peak Hours",
                  "Campus Ranking",
                  "Daily Trends",
                  "Success Rate",
                  "30 / 90d History",
                ].map((tag) => (
                  <span
                    key={tag}
                    style={{
                      fontSize: "11px",
                      padding: "3px 9px",
                      borderRadius: "100px",
                      background: "var(--lp-tag-bg)",
                      border: "1px solid var(--lp-tag-border)",
                      color: "var(--lp-tag-text)",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════ INSTALL & RUN ══════════════════════════ */}
      <div
        id="install"
        ref={installSec.ref}
        style={{
          padding: `96px ${pad}`,
          background: "var(--lp-bg-alt)",
          ...reveal(installSec.inView),
        }}
      >
        <div style={{ maxWidth: innerMax, margin: "0 auto" }}>
          <SectionLabel>Get Running</SectionLabel>
          <SectionHeading>Install &amp; Run Q-Print</SectionHeading>
          <p
            style={{
              fontSize: "14px",
              color: "var(--lp-text-2)",
              margin: "0 0 48px",
              maxWidth: "520px",
              lineHeight: 1.65,
            }}
          >
            Q-Print ships a single setup script that handles everything — Python
            virtualenv, npm install, config files, and directory creation. One
            command gets you from clone to running.
          </p>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "clamp(40px, 6vw, 80px)",
              alignItems: "flex-start",
            }}
          >
            {/* Prerequisites */}
            <div style={{ flex: "1 1 260px" }}>
              <h3
                style={{
                  fontFamily: "var(--font-space-grotesk, sans-serif)",
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "var(--lp-text-3)",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  margin: "0 0 14px",
                }}
              >
                Prerequisites
              </h3>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                  marginBottom: "28px",
                }}
              >
                <ReqItem icon={Package} text="Python 3.12 or higher" />
                <ReqItem icon={Cpu} text="Node.js 18 LTS or higher" />
                <ReqItem icon={Terminal} text="npm (bundled with Node.js)" />
                <ReqItem
                  icon={Monitor}
                  text="Windows — required for physical printing via win32print. Web UI and admin panel run on any OS."
                />
              </div>

              {/* Windows-only note */}
              <div
                style={{
                  padding: "14px 16px",
                  background: "var(--lp-tip-bg)",
                  border: "1px solid var(--lp-tip-border)",
                  borderRadius: "10px",
                  display: "flex",
                  gap: "10px",
                }}
              >
                <Zap
                  size={13}
                  strokeWidth={1.5}
                  style={{
                    color: "var(--lp-accent)",
                    flexShrink: 0,
                    marginTop: "2px",
                  }}
                />
                <p
                  style={{
                    margin: 0,
                    fontSize: "12px",
                    color: "var(--lp-text-2)",
                    lineHeight: 1.6,
                  }}
                >
                  <strong style={{ color: "var(--lp-text)" }}>
                    Windows only:
                  </strong>{" "}
                  After setup, install pywin32 manually — it is excluded from{" "}
                  <code
                    style={{
                      fontFamily: "var(--font-jetbrains-mono, monospace)",
                      color: "var(--lp-code-text)",
                      fontSize: "11px",
                    }}
                  >
                    requirements.txt
                  </code>{" "}
                  for cross-platform compatibility.
                </p>
              </div>
            </div>

            {/* Steps */}
            <div style={{ flex: "1 1 320px" }}>
              <h3
                style={{
                  fontFamily: "var(--font-space-grotesk, sans-serif)",
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "var(--lp-text-3)",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  margin: "0 0 20px",
                }}
              >
                Installation
              </h3>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                  marginBottom: "32px",
                }}
              >
                <InstallStep
                  n={1}
                  title="Clone the Q-Print repository"
                  cmds={[
                    "git clone https://github.com/Vivekv634/q-print.git",
                    "cd q-print",
                  ]}
                />
                <InstallStep
                  n={2}
                  title="Run the setup script — handles everything"
                  cmds={["python setup.py"]}
                  comment="# Verifies Python ≥3.12 + Node ≥18, creates venv, runs npm install, copies config files"
                />
                <InstallStep
                  n={3}
                  title="Windows only — install pywin32 for printing"
                  cmds={[`server\\.venv\\Scripts\\pip install pywin32`]}
                />
              </div>

              <h3
                style={{
                  fontFamily: "var(--font-space-grotesk, sans-serif)",
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "var(--lp-text-3)",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  margin: "0 0 20px",
                }}
              >
                Running
              </h3>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                }}
              >
                <InstallStep
                  n={4}
                  title="Activate the virtual environment"
                  cmds={[
                    "source server/.venv/bin/activate   # Linux / macOS",
                    "server\\.venv\\Scripts\\activate         # Windows",
                  ]}
                />
                <InstallStep
                  n={5}
                  title="Start everything — FastAPI + Next.js + Admin UI"
                  cmds={["python main.py"]}
                  comment="# Starts: FastAPI (port 8000) · Next.js (port 3000) · PySide6 admin window"
                />
              </div>

              {/* Port table */}
              <div
                style={{
                  marginTop: "20px",
                  padding: "14px 16px",
                  background: "var(--lp-tip-bg)",
                  border: "1px solid var(--lp-tip-border)",
                  borderRadius: "10px",
                }}
              >
                <p
                  style={{
                    margin: "0 0 8px",
                    fontSize: "11px",
                    fontWeight: 600,
                    color: "var(--lp-text-2)",
                  }}
                >
                  Ports
                </p>
                {[
                  { svc: "Next.js web app (student UI)", port: "3000" },
                  { svc: "Python FastAPI server", port: "8000" },
                ].map(({ svc, port }) => (
                  <div
                    key={port}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "baseline",
                      marginBottom: "4px",
                    }}
                  >
                    <span
                      style={{ fontSize: "12px", color: "var(--lp-text-3)" }}
                    >
                      {svc}
                    </span>
                    <code
                      style={{
                        fontFamily: "var(--font-jetbrains-mono, monospace)",
                        fontSize: "12px",
                        color: "var(--lp-code-text)",
                      }}
                    >
                      :{port}
                    </code>
                  </div>
                ))}
                <p
                  style={{
                    margin: "10px 0 0",
                    fontSize: "11px",
                    color: "var(--lp-text-3)",
                  }}
                >
                  Students open{" "}
                  <code
                    style={{
                      fontFamily: "var(--font-jetbrains-mono, monospace)",
                      color: "var(--lp-code-text)",
                      fontSize: "10px",
                    }}
                  >
                    qprint-&lt;slug&gt;.local:3000
                  </code>{" "}
                  in their browser.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════ CREATOR ════════════════════════════ */}
      <div
        ref={creatorSec.ref}
        style={{
          padding: `96px ${pad}`,
          background: "var(--lp-bg)",
          ...reveal(creatorSec.inView),
        }}
      >
        <div style={{ maxWidth: innerMax, margin: "0 auto" }}>
          <SectionLabel>The Creator</SectionLabel>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "clamp(40px, 8vw, 100px)",
              alignItems: "center",
            }}
          >
            {/* Name block */}
            <div style={{ flex: "1 1 280px" }}>
              <h2
                style={{
                  fontFamily:
                    "var(--font-space-grotesk, 'Space Grotesk', sans-serif)",
                  fontSize: "clamp(2.8rem, 6vw, 5.5rem)",
                  fontWeight: 800,
                  letterSpacing: "-0.05em",
                  lineHeight: 0.95,
                  color: "var(--lp-text)",
                  margin: "0 0 18px",
                }}
              >
                Vivek
                <br />
                Vaish
              </h2>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "10px",
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "var(--lp-accent)",
                  background: "var(--lp-accent-bg)",
                  border: "1px solid var(--lp-accent-border)",
                  padding: "5px 12px",
                  borderRadius: "100px",
                  marginBottom: "22px",
                }}
              >
                Developer &amp; Creator
              </div>
              <p
                style={{
                  fontSize: "15px",
                  lineHeight: 1.7,
                  color: "var(--lp-text-2)",
                  margin: "0 0 28px",
                  maxWidth: "340px",
                }}
              >
                Built Q-Print and QPrint Analytics from scratch to solve a real
                visibility problem observed across university campus print shop
                networks.
              </p>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  flexWrap: "wrap",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "6px" }}
                >
                  <MapPin
                    size={13}
                    strokeWidth={1.5}
                    style={{ color: "var(--lp-text-3)" }}
                  />
                  <span style={{ fontSize: "13px", color: "var(--lp-text-3)" }}>
                    India
                  </span>
                </div>
                <a
                  href="https://github.com/Vivekv634"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    fontSize: "12px",
                    color: "var(--lp-text-3)",
                    textDecoration: "none",
                    padding: "4px 10px",
                    border: "1px solid var(--lp-border-2)",
                    borderRadius: "100px",
                  }}
                >
                  <GithubIcon size={13} />
                  @Vivekv634
                </a>
              </div>
            </div>

            {/* Quote card */}
            <div
              style={{
                flex: "0 1 400px",
                background: "var(--lp-quote-bg)",
                border: "1px solid var(--lp-border)",
                borderRadius: "16px",
                padding: "32px",
                position: "relative",
              }}
            >
              {/* Left accent bar */}
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top: "20%",
                  bottom: "20%",
                  width: "3px",
                  background: `linear-gradient(to bottom, transparent, var(--lp-quote-left), transparent)`,
                  borderRadius: "100px",
                }}
              />
              <div
                style={{
                  fontFamily: "var(--font-space-grotesk, sans-serif)",
                  fontSize: "60px",
                  fontWeight: 800,
                  color: "var(--lp-accent-bg-2)",
                  lineHeight: 0.75,
                  marginBottom: "18px",
                  letterSpacing: "-0.04em",
                }}
              >
                &ldquo;
              </div>
              <p
                style={{
                  fontSize: "16px",
                  lineHeight: 1.68,
                  color: "var(--lp-text-2)",
                  margin: "0 0 24px",
                  fontStyle: "italic",
                }}
              >
                Every print shop I visited was flying blind. No numbers, no
                patterns, no decisions. I built Q-Print and QPrint Analytics
                because the data was always there — it just needed a way to
                speak.
              </p>
              <div
                style={{
                  height: "1px",
                  background: "var(--lp-divider)",
                  marginBottom: "18px",
                }}
              />
              <p
                style={{
                  margin: "0 0 2px",
                  fontSize: "13px",
                  fontWeight: 700,
                  color: "var(--lp-text)",
                }}
              >
                Vivek Vaish
              </p>
              <p
                style={{
                  margin: 0,
                  fontSize: "11px",
                  color: "var(--lp-text-3)",
                }}
              >
                Creator, Q-Print &amp; QPrint Analytics
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════ CONTRIBUTE ═════════════════════════════ */}
      <div
        ref={contribSec.ref}
        style={{
          padding: `96px ${pad}`,
          background: "var(--lp-bg-alt)",
          ...reveal(contribSec.inView),
        }}
      >
        <div style={{ maxWidth: innerMax, margin: "0 auto" }}>
          <SectionLabel>Open Source</SectionLabel>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "clamp(32px, 6vw, 80px)",
              alignItems: "flex-start",
              marginBottom: "44px",
            }}
          >
            <SectionHeading
              style={{ flex: "1 1 260px", margin: 0, lineHeight: 1.1 }}
            >
              Contribute
              <br />
              or request features
            </SectionHeading>
            <p
              style={{
                margin: 0,
                fontSize: "15px",
                lineHeight: 1.7,
                color: "var(--lp-text-2)",
                flex: "1 1 280px",
                paddingTop: "6px",
              }}
            >
              Both Q-Print and QPrint Analytics are open source. If your
              university has a different setup, or you need a feature — open an
              issue or send a pull request. Shop owners with technical feedback
              are especially welcome.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))",
              gap: "10px",
              marginBottom: "44px",
            }}
          >
            <ContributeCard
              icon={Printer}
              title="New Campus Integration"
              desc="Add support for your university's print shop infrastructure or data formats."
            />
            <ContributeCard
              icon={Wifi}
              title="Hardware Support"
              desc="Integrate additional printer models or campus point-of-sale systems."
            />
            <ContributeCard
              icon={BarChart3}
              title="Analytics Features"
              desc="Propose new metrics, visualisations, or reporting dimensions."
            />
            <ContributeCard
              icon={Zap}
              title="Performance"
              desc="Optimise sync speed, API latency, or dashboard load time."
            />
            <ContributeCard
              icon={HardDrive}
              title="Bug Reports"
              desc="Found an issue? Open a detailed report with reproduction steps."
            />
            <ContributeCard
              icon={GitBranch}
              title="Pull Requests"
              desc="Fork, improve, and submit. All contributions are reviewed and welcome."
            />
          </div>

          {/* GitHub CTA row — two links */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "12px",
              flexWrap: "wrap",
            }}
          >
            <a
              href="https://github.com/Vivekv634/q-print"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "9px",
                padding: "13px 28px",
                background: "var(--lp-gh-cta-bg)",
                color: "var(--lp-gh-cta-text)",
                borderRadius: "11px",
                fontSize: "14px",
                fontWeight: 700,
                textDecoration: "none",
                fontFamily: "var(--font-space-grotesk, sans-serif)",
                letterSpacing: "-0.01em",
              }}
            >
              <GithubIcon size={17} />
              Q-Print on GitHub
            </a>
            <a
              href="https://github.com/Vivekv634/qprint-analytics"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "9px",
                padding: "13px 28px",
                background: "var(--lp-contrib-bg)",
                color: "var(--lp-text)",
                border: "1px solid var(--lp-border-2)",
                borderRadius: "11px",
                fontSize: "14px",
                fontWeight: 600,
                textDecoration: "none",
                fontFamily: "var(--font-space-grotesk, sans-serif)",
                letterSpacing: "-0.01em",
              }}
            >
              <BarChart3 size={15} strokeWidth={1.5} />
              QPrint Analytics
            </a>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════ FOOTER ═════════════════════════════ */}
      <footer
        style={{
          padding: `36px ${pad}`,
          background: "var(--lp-bg)",
          borderTop: "1px solid var(--lp-footer-border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "14px",
        }}
      >
        {/* Left: brand */}
        <div style={{ display: "flex", alignItems: "center", gap: "9px" }}>
          <div
            style={{
              width: "20px",
              height: "20px",
              borderRadius: "5px",
              background: "linear-gradient(135deg, var(--lp-accent), #e8950f)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "10px",
              fontWeight: 800,
              color: "var(--lp-cta-pill-text)",
            }}
          >
            Q
          </div>
          <span style={{ fontSize: "12px", color: "var(--lp-footer-text)" }}>
            QPrint Analytics — made by Vivek Vaish
          </span>
        </div>

        {/* Right: two GitHub links */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            flexWrap: "wrap",
          }}
        >
          <a
            href="https://github.com/Vivekv634/q-print"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "5px",
              fontSize: "12px",
              color: "var(--lp-footer-text)",
              textDecoration: "none",
            }}
          >
            <GithubIcon size={13} /> Q-Print
          </a>
          <a
            href="https://github.com/Vivekv634"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "5px",
              fontSize: "12px",
              color: "var(--lp-footer-text)",
              textDecoration: "none",
            }}
          >
            <GithubIcon size={13} /> @Vivekv634
          </a>
          <Link
            href="/analytics"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "5px",
              fontSize: "12px",
              color: "var(--lp-footer-text)",
              textDecoration: "none",
            }}
          >
            Dashboard <ArrowRight size={11} />
          </Link>
        </div>
      </footer>
    </div>
  );
}
