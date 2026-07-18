"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import Link from "next/link";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

const stages = [
  {
    name: "Starter Foundations",
    range: "Levels 1–10",
    levelStart: 1,
    levelEnd: 10,
    cefr: "Pre-A1",
    target: "IELTS Foundation",
    description:
      "Build your first vocabulary, sentence patterns and listening confidence.",
  },
  {
    name: "Essential English",
    range: "Levels 11–20",
    levelStart: 11,
    levelEnd: 20,
    cefr: "A1",
    target: "IELTS 2.5–3.0",
    description:
      "Communicate about daily routines, people, places and familiar topics.",
  },
  {
    name: "Everyday Communication",
    range: "Levels 21–30",
    levelStart: 21,
    levelEnd: 30,
    cefr: "A2",
    target: "IELTS 3.0–3.5",
    description:
      "Develop practical English for common situations and simple conversations.",
  },
  {
    name: "Independent English",
    range: "Levels 31–40",
    levelStart: 31,
    levelEnd: 40,
    cefr: "B1",
    target: "IELTS 4.0–4.5",
    description:
      "Express opinions, describe experiences and understand longer messages.",
  },
  {
    name: "IELTS Core Skills",
    range: "Levels 41–50",
    levelStart: 41,
    levelEnd: 50,
    cefr: "B1+",
    target: "IELTS 5.0",
    description:
      "Build the essential reading, listening, speaking and writing skills for IELTS.",
  },
  {
    name: "Academic Development",
    range: "Levels 51–60",
    levelStart: 51,
    levelEnd: 60,
    cefr: "B2",
    target: "IELTS 5.5–6.0",
    description:
      "Develop academic vocabulary, structured writing and stronger comprehension.",
  },
  {
    name: "Confident IELTS User",
    range: "Levels 61–70",
    levelStart: 61,
    levelEnd: 70,
    cefr: "B2+",
    target: "IELTS 6.0–6.5",
    description:
      "Improve fluency, accuracy and test performance across all four IELTS skills.",
  },
  {
    name: "Advanced IELTS Skills",
    range: "Levels 71–80",
    levelStart: 71,
    levelEnd: 80,
    cefr: "C1",
    target: "IELTS 7.0",
    description:
      "Master complex language, argumentation and high-level test strategies.",
  },
  {
    name: "Band 7.5 Performance",
    range: "Levels 81–90",
    levelStart: 81,
    levelEnd: 90,
    cefr: "C1+",
    target: "IELTS 7.5",
    description:
      "Refine precision, coherence, lexical range and advanced exam technique.",
  },
  {
    name: "Road to Band 8",
    range: "Levels 91–100",
    levelStart: 91,
    levelEnd: 100,
    cefr: "Advanced",
    target: "IELTS 8.0+",
    description:
      "Polish elite-level performance through full simulations and detailed feedback.",
  },
];

const lessonTopics = [
  "Introducing yourself",
  "Numbers and personal information",
  "Family and relationships",
  "Daily routines",
  "Food and drinks",
  "Home and neighbourhood",
  "Study and work",
  "Free-time activities",
  "Travel and transport",
  "Foundation checkpoint",
  "Describing people",
  "Past experiences",
  "Future plans",
  "Health and wellbeing",
  "Shopping and services",
  "Technology in daily life",
  "Weather and environment",
  "Culture and celebrations",
  "Making comparisons",
  "Essential English checkpoint",
];

function getLessonTitle(level) {
  if (level <= lessonTopics.length) {
    return lessonTopics[level - 1];
  }

  const skillCycle = [
    "Vocabulary development",
    "Grammar accuracy",
    "Listening comprehension",
    "Reading strategies",
    "Speaking fluency",
    "Writing development",
    "Pronunciation practice",
    "IELTS skill integration",
    "Exam strategy",
    "Stage checkpoint",
  ];

  return skillCycle[(level - 1) % skillCycle.length];
}

function getStageForLevel(level) {
  return (
    stages.find(
      (stage) =>
        level >= stage.levelStart &&
        level <= stage.levelEnd
    ) || stages[0]
  );
}

export default function RoadmapPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [activeStage, setActiveStage] = useState(1);

  const currentLevel = Math.min(
    Math.max(Number(profile?.current_lesson || 1), 1),
    100
  );

  const levels = useMemo(
    () =>
      Array.from({ length: 100 }, (_, index) => {
        const level = index + 1;
        const stage = getStageForLevel(level);

        return {
          id: level,
          title: getLessonTitle(level),
          stage: stage.name,
          cefr: stage.cefr,
          target: stage.target,
          xp: 80 + ((level - 1) % 5) * 10,
        };
      }),
    []
  );

  useEffect(() => {
    loadRoadmap();
  }, []);

  useEffect(() => {
    setActiveStage(Math.ceil(currentLevel / 10));
  }, [currentLevel]);

  async function loadRoadmap() {
    if (!supabase) {
      setErrorMessage(
        "Supabase environment variables are missing."
      );
      setLoading(false);
      return;
    }

    try {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) {
        throw sessionError;
      }

      if (!session) {
        router.replace("/auth");
        return;
      }

      setUser(session.user);

      const {
        data: profileData,
        error: profileError,
      } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .maybeSingle();

      if (profileError) {
        throw profileError;
      }

      if (!profileData?.onboarding_completed) {
        router.replace("/onboarding");
        return;
      }

      setProfile(profileData);
    } catch (error) {
      setErrorMessage(
        error?.message ||
          "The learning roadmap could not be loaded."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    if (!supabase) return;

    setLoggingOut(true);
    await supabase.auth.signOut();

    router.replace("/");
    router.refresh();
  }

  if (loading) {
    return (
      <main style={styles.loadingPage}>
        <div style={styles.spinner} />
        <p style={styles.loadingText}>
          Loading your learning roadmap...
        </p>
      </main>
    );
  }

  if (errorMessage) {
    return (
      <main style={styles.loadingPage}>
        <section style={styles.errorCard}>
          <h1 style={styles.errorTitle}>
            Roadmap unavailable
          </h1>

          <p style={styles.errorText}>
            {errorMessage}
          </p>

          <Link href="/dashboard" style={styles.primaryLink}>
            Return to dashboard
          </Link>
        </section>
      </main>
    );
  }

  const learnerName =
    profile?.full_name ||
    user?.email?.split("@")[0] ||
    "Learner";

  const currentStage =
    stages[activeStage - 1] || stages[0];

  const visibleLevels = levels.filter(
    (level) =>
      level.id >= currentStage.levelStart &&
      level.id <= currentStage.levelEnd
  );

  const completedLevels = Math.max(currentLevel - 1, 0);
  const overallProgress = Math.round(
    (completedLevels / 100) * 100
  );

  return (
    <main style={styles.page}>
      <aside style={styles.sidebar}>
        <Link href="/" style={styles.brand}>
          <span style={styles.brandMark}>N</span>

          <span>
            <strong style={styles.brandName}>
              NEXORA
            </strong>

            <small style={styles.brandSubtitle}>
              Road to IELTS 8.0
            </small>
          </span>
        </Link>

        <nav style={styles.navigation}>
          <Link href="/dashboard" style={styles.navItem}>
            Dashboard
          </Link>

          <Link
            href="/roadmap"
            style={{
              ...styles.navItem,
              ...styles.activeNavItem,
            }}
          >
            Learning roadmap
          </Link>

          <Link href="/onboarding" style={styles.navItem}>
            Learner profile
          </Link>
        </nav>

        <div style={styles.sidebarProgress}>
          <p style={styles.sidebarLabel}>
            OVERALL PROGRESS
          </p>

          <div style={styles.sidebarProgressRow}>
            <strong style={styles.sidebarProgressValue}>
              {overallProgress}%
            </strong>

            <span style={styles.sidebarProgressDetail}>
              {completedLevels}/100 levels
            </span>
          </div>

          <div style={styles.sidebarTrack}>
            <div
              style={{
                ...styles.sidebarTrackValue,
                width: `${overallProgress}%`,
              }}
            />
          </div>
        </div>

        <div style={styles.sidebarFooter}>
          <p style={styles.accountName}>
            {learnerName}
          </p>

          <p style={styles.accountEmail}>
            {user?.email}
          </p>

          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            style={{
              ...styles.logoutButton,
              opacity: loggingOut ? 0.65 : 1,
            }}
          >
            {loggingOut
              ? "Signing out..."
              : "Sign out"}
          </button>
        </div>
      </aside>

      <section style={styles.content}>
        <header style={styles.header}>
          <div>
            <p style={styles.eyebrow}>
              100-LEVEL LEARNING JOURNEY
            </p>

            <h1 style={styles.title}>
              Your road to IELTS{" "}
              {Number(profile?.target_band || 7).toFixed(1)}
            </h1>

            <p style={styles.subtitle}>
              Complete each level to earn XP and unlock
              the next step in your learning journey.
            </p>
          </div>

          <div style={styles.currentLevelBadge}>
            <small style={styles.currentLevelLabel}>
              CURRENT LEVEL
            </small>

            <strong style={styles.currentLevelValue}>
              {currentLevel}
            </strong>
          </div>
        </header>

        <section style={styles.summaryGrid}>
          <SummaryCard
            label="Current stage"
            value={getStageForLevel(currentLevel).name}
          />

          <SummaryCard
            label="English level"
            value={profile?.current_level || "Pre-A1"}
          />

          <SummaryCard
            label="Completed"
            value={`${completedLevels} levels`}
          />

          <SummaryCard
            label="Total XP"
            value={profile?.total_xp || 0}
          />
        </section>

        <section style={styles.stageNavigation}>
          {stages.map((stage, index) => {
            const stageNumber = index + 1;
            const stageCompleted =
              currentLevel > stage.levelEnd;
            const stageCurrent =
              currentLevel >= stage.levelStart &&
              currentLevel <= stage.levelEnd;
            const stageLocked =
              currentLevel < stage.levelStart;

            return (
              <button
                key={stage.name}
                type="button"
                onClick={() =>
                  setActiveStage(stageNumber)
                }
                style={{
                  ...styles.stageButton,
                  ...(activeStage === stageNumber
                    ? styles.activeStageButton
                    : {}),
                }}
              >
                <span
                  style={{
                    ...styles.stageCircle,
                    ...(stageCompleted
                      ? styles.completedStageCircle
                      : {}),
                    ...(stageCurrent
                      ? styles.currentStageCircle
                      : {}),
                  }}
                >
                  {stageCompleted
                    ? "✓"
                    : stageLocked
                    ? "🔒"
                    : stageNumber}
                </span>

                <span style={styles.stageButtonText}>
                  <strong>
                    Stage {stageNumber}
                  </strong>

                  <small>{stage.range}</small>
                </span>
              </button>
            );
          })}
        </section>

        <section style={styles.stageHeader}>
          <div>
            <p style={styles.stageEyebrow}>
              STAGE {activeStage}
            </p>

            <h2 style={styles.stageTitle}>
              {currentStage.name}
            </h2>

            <p style={styles.stageDescription}>
              {currentStage.description}
            </p>
          </div>

          <div style={styles.stageMeta}>
            <span>{currentStage.cefr}</span>
            <strong>{currentStage.target}</strong>
          </div>
        </section>

        <section style={styles.levelGrid}>
          {visibleLevels.map((level) => {
            const isCompleted = level.id < currentLevel;
            const isCurrent = level.id === currentLevel;
            const isLocked = level.id > currentLevel;

            const levelContent = (
              <>
                <div style={styles.levelTop}>
                  <span
                    style={{
                      ...styles.levelNumber,
                      ...(isCompleted
                        ? styles.completedLevelNumber
                        : {}),
                      ...(isCurrent
                        ? styles.currentLevelNumber
                        : {}),
                      ...(isLocked
                        ? styles.lockedLevelNumber
                        : {}),
                    }}
                  >
                    {isCompleted
                      ? "✓"
                      : isLocked
                      ? "🔒"
                      : level.id}
                  </span>

                  <span
                    style={{
                      ...styles.statusPill,
                      ...(isCompleted
                        ? styles.completedStatus
                        : {}),
                      ...(isCurrent
                        ? styles.currentStatus
                        : {}),
                      ...(isLocked
                        ? styles.lockedStatus
                        : {}),
                    }}
                  >
                    {isCompleted
                      ? "Completed"
                      : isCurrent
                      ? "Continue"
                      : "Locked"}
                  </span>
                </div>

                <p style={styles.levelLabel}>
                  LEVEL {level.id}
                </p>

                <h3 style={styles.levelTitle}>
                  {level.title}
                </h3>

                <p style={styles.levelDescription}>
                  Vocabulary, grammar, listening,
                  speaking and practice.
                </p>

                <div style={styles.levelFooter}>
                  <span>{level.xp} XP</span>
                  <span>
                    {isCurrent
                      ? "Open lesson →"
                      : isCompleted
                      ? "Review →"
                      : "Complete previous level"}
                  </span>
                </div>
              </>
            );

            if (isLocked) {
              return (
                <article
                  key={level.id}
                  style={{
                    ...styles.levelCard,
                    ...styles.lockedLevelCard,
                  }}
                >
                  {levelContent}
                </article>
              );
            }

            return (
              <Link
                href={`/level/${level.id}`}
                key={level.id}
                style={{
                  ...styles.levelCard,
                  ...(isCurrent
                    ? styles.currentLevelCard
                    : {}),
                }}
              >
                {levelContent}
              </Link>
            );
          })}
        </section>
      </section>
    </main>
  );
}

function SummaryCard({ label, value }) {
  return (
    <article style={styles.summaryCard}>
      <span style={styles.summaryLabel}>
        {label}
      </span>

      <strong style={styles.summaryValue}>
        {value}
      </strong>
    </article>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "grid",
    gridTemplateColumns: "260px minmax(0, 1fr)",
    background: "#f4f6fb",
    fontFamily: "Arial, Helvetica, sans-serif",
  },

  loadingPage: {
    minHeight: "100vh",
    display: "grid",
    placeItems: "center",
    alignContent: "center",
    gap: "16px",
    padding: "24px",
    background:
      "linear-gradient(145deg, #101735, #25194e)",
    fontFamily: "Arial, Helvetica, sans-serif",
  },

  spinner: {
    width: "42px",
    height: "42px",
    border:
      "4px solid rgba(255,255,255,.22)",
    borderTopColor: "#ffffff",
    borderRadius: "50%",
  },

  loadingText: {
    color: "#ffffff",
    fontSize: "14px",
  },

  errorCard: {
    width: "100%",
    maxWidth: "480px",
    padding: "32px",
    borderRadius: "22px",
    background: "#ffffff",
    textAlign: "center",
  },

  errorTitle: {
    margin: "0 0 12px",
    color: "#172452",
  },

  errorText: {
    margin: "0 0 22px",
    color: "#737b96",
    lineHeight: 1.6,
  },

  sidebar: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    position: "sticky",
    top: 0,
    alignSelf: "start",
    padding: "30px 22px",
    boxSizing: "border-box",
    background:
      "linear-gradient(180deg, #121936, #191f46)",
    color: "#ffffff",
  },

  brand: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    color: "#ffffff",
    textDecoration: "none",
  },

  brandMark: {
    width: "43px",
    height: "43px",
    display: "grid",
    placeItems: "center",
    borderRadius: "14px",
    background:
      "linear-gradient(135deg,#7448ff,#ec42c7)",
    fontWeight: "900",
  },

  brandName: {
    display: "block",
    letterSpacing: "2px",
  },

  brandSubtitle: {
    display: "block",
    marginTop: "3px",
    color: "#aeb5d4",
    fontSize: "9px",
  },

  navigation: {
    display: "grid",
    gap: "8px",
    marginTop: "48px",
  },

  navItem: {
    padding: "13px 15px",
    borderRadius: "11px",
    color: "#bfc5de",
    textDecoration: "none",
    fontSize: "13px",
    fontWeight: "700",
  },

  activeNavItem: {
    background: "rgba(255,255,255,.1)",
    color: "#ffffff",
  },

  sidebarProgress: {
    marginTop: "34px",
    padding: "18px",
    borderRadius: "15px",
    background: "rgba(255,255,255,.07)",
  },

  sidebarLabel: {
    margin: "0 0 12px",
    color: "#818bad",
    fontSize: "9px",
    fontWeight: "900",
    letterSpacing: "1.2px",
  },

  sidebarProgressRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "baseline",
    gap: "10px",
  },

  sidebarProgressValue: {
    fontSize: "26px",
  },

  sidebarProgressDetail: {
    color: "#aeb5d4",
    fontSize: "10px",
  },

  sidebarTrack: {
    height: "7px",
    overflow: "hidden",
    marginTop: "13px",
    borderRadius: "999px",
    background: "rgba(255,255,255,.12)",
  },

  sidebarTrackValue: {
    height: "100%",
    borderRadius: "999px",
    background:
      "linear-gradient(90deg,#7448ff,#ec42c7)",
  },

  sidebarFooter: {
    marginTop: "auto",
    paddingTop: "26px",
    borderTop:
      "1px solid rgba(255,255,255,.1)",
  },

  accountName: {
    margin: 0,
    fontSize: "12px",
    fontWeight: "800",
  },

  accountEmail: {
    overflow: "hidden",
    margin: "6px 0 15px",
    color: "#98a1c5",
    fontSize: "10px",
    textOverflow: "ellipsis",
  },

  logoutButton: {
    width: "100%",
    padding: "11px",
    border:
      "1px solid rgba(255,255,255,.15)",
    borderRadius: "10px",
    background: "rgba(255,255,255,.06)",
    color: "#ffffff",
    cursor: "pointer",
  },

  content: {
    minWidth: 0,
    padding: "42px",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "24px",
  },

  eyebrow: {
    margin: "0 0 8px",
    color: "#7448ff",
    fontSize: "9px",
    fontWeight: "900",
    letterSpacing: "1.4px",
  },

  title: {
    margin: 0,
    color: "#172452",
    fontSize: "clamp(28px, 4vw, 42px)",
  },

  subtitle: {
    maxWidth: "650px",
    margin: "10px 0 0",
    color: "#737b96",
    fontSize: "14px",
    lineHeight: 1.6,
  },

  currentLevelBadge: {
    minWidth: "100px",
    padding: "18px",
    borderRadius: "20px",
    background:
      "linear-gradient(135deg,#7448ff,#ec42c7)",
    color: "#ffffff",
    textAlign: "center",
    boxShadow:
      "0 18px 40px rgba(116,72,255,.22)",
  },

  currentLevelLabel: {
    display: "block",
    fontSize: "8px",
    fontWeight: "900",
    letterSpacing: "1.1px",
  },

  currentLevelValue: {
    display: "block",
    marginTop: "5px",
    fontSize: "31px",
  },

  summaryGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(170px, 1fr))",
    gap: "15px",
    marginTop: "28px",
  },

  summaryCard: {
    display: "grid",
    gap: "8px",
    padding: "20px",
    border: "1px solid #e5e8f1",
    borderRadius: "17px",
    background: "#ffffff",
  },

  summaryLabel: {
    color: "#8990a7",
    fontSize: "10px",
    fontWeight: "700",
  },

  summaryValue: {
    color: "#172452",
    fontSize: "16px",
  },

  stageNavigation: {
    display: "flex",
    gap: "10px",
    overflowX: "auto",
    marginTop: "26px",
    paddingBottom: "8px",
  },

  stageButton: {
    minWidth: "155px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "12px",
    border: "1px solid #e2e5ef",
    borderRadius: "14px",
    background: "#ffffff",
    cursor: "pointer",
    textAlign: "left",
  },

  activeStageButton: {
    borderColor: "#8b68ff",
    background: "#f4f0ff",
  },

  stageCircle: {
    width: "34px",
    height: "34px",
    display: "grid",
    placeItems: "center",
    flexShrink: 0,
    borderRadius: "11px",
    background: "#edf0f6",
    color: "#737b96",
    fontSize: "11px",
    fontWeight: "900",
  },

  completedStageCircle: {
    background: "#e9fff4",
    color: "#147653",
  },

  currentStageCircle: {
    background:
      "linear-gradient(135deg,#7448ff,#ec42c7)",
    color: "#ffffff",
  },

  stageButtonText: {
    display: "grid",
    gap: "3px",
  },

  stageButtonTextStrong: {
    color: "#172452",
  },

  stageButtonTextSmall: {
    color: "#8c93a9",
  },

  stageHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "25px",
    marginTop: "24px",
    padding: "26px",
    borderRadius: "22px",
    background:
      "linear-gradient(135deg,#171f48,#291d55)",
    color: "#ffffff",
  },

  stageEyebrow: {
    margin: "0 0 8px",
    color: "#b6a7ff",
    fontSize: "9px",
    fontWeight: "900",
    letterSpacing: "1.2px",
  },

  stageTitle: {
    margin: 0,
    fontSize: "27px",
  },

  stageDescription: {
    maxWidth: "650px",
    margin: "10px 0 0",
    color: "#bdc3df",
    fontSize: "12px",
    lineHeight: 1.7,
  },

  stageMeta: {
    minWidth: "140px",
    display: "grid",
    gap: "6px",
    textAlign: "right",
  },

  stageMetaSpan: {
    color: "#aeb5d4",
    fontSize: "11px",
  },

  levelGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(235px, 1fr))",
    gap: "17px",
    marginTop: "20px",
  },

  levelCard: {
    display: "block",
    padding: "21px",
    border: "1px solid #e4e7f0",
    borderRadius: "18px",
    background: "#ffffff",
    color: "inherit",
    textDecoration: "none",
    boxShadow:
      "0 10px 30px rgba(30,40,80,.04)",
  },

  currentLevelCard: {
    borderColor: "#8b68ff",
    boxShadow:
      "0 15px 38px rgba(116,72,255,.14)",
  },

  lockedLevelCard: {
    opacity: 0.58,
    cursor: "not-allowed",
  },

  levelTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
  },

  levelNumber: {
    width: "42px",
    height: "42px",
    display: "grid",
    placeItems: "center",
    borderRadius: "13px",
    background: "#f0f2f7",
    color: "#737b96",
    fontSize: "13px",
    fontWeight: "900",
  },

  completedLevelNumber: {
    background: "#e9fff4",
    color: "#147653",
  },

  currentLevelNumber: {
    background:
      "linear-gradient(135deg,#7448ff,#ec42c7)",
    color: "#ffffff",
  },

  lockedLevelNumber: {
    background: "#eff1f5",
    color: "#959caf",
  },

  statusPill: {
    padding: "7px 9px",
    borderRadius: "999px",
    fontSize: "9px",
    fontWeight: "900",
  },

  completedStatus: {
    background: "#e9fff4",
    color: "#147653",
  },

  currentStatus: {
    background: "#f0ebff",
    color: "#7448ff",
  },

  lockedStatus: {
    background: "#eff1f5",
    color: "#959caf",
  },

  levelLabel: {
    margin: "19px 0 7px",
    color: "#8f96ac",
    fontSize: "9px",
    fontWeight: "900",
    letterSpacing: "1.1px",
  },

  levelTitle: {
    margin: 0,
    color: "#172452",
    fontSize: "18px",
  },

  levelDescription: {
    margin: "10px 0 18px",
    color: "#7a829b",
    fontSize: "11px",
    lineHeight: 1.6,
  },

  levelFooter: {
    display: "flex",
    justifyContent: "space-between",
    gap: "14px",
    paddingTop: "14px",
    borderTop: "1px solid #eceef4",
    color: "#7448ff",
    fontSize: "9px",
    fontWeight: "800",
  },

  primaryLink: {
    display: "inline-flex",
    padding: "13px 19px",
    borderRadius: "11px",
    background:
      "linear-gradient(135deg,#7448ff,#ec42c7)",
    color: "#ffffff",
    textDecoration: "none",
    fontSize: "12px",
    fontWeight: "900",
  },
};