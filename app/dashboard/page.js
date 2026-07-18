"use client";

import { useEffect, useState } from "react";
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

export default function DashboardPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    if (!supabase) {
      setErrorMessage(
        "Supabase environment variables are missing. Check your .env.local file and Vercel Environment Variables."
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
          "The dashboard could not be loaded."
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
          Loading your Nexora dashboard...
        </p>
      </main>
    );
  }

  if (errorMessage) {
    return (
      <main style={styles.loadingPage}>
        <section style={styles.errorCard}>
          <h1 style={styles.errorTitle}>
            Dashboard unavailable
          </h1>

          <p style={styles.errorText}>
            {errorMessage}
          </p>

          <Link href="/auth" style={styles.primaryLink}>
            Return to sign in
          </Link>
        </section>
      </main>
    );
  }

  const learnerName =
    profile?.full_name ||
    user?.email?.split("@")[0] ||
    "Learner";

  const currentLesson =
    profile?.current_lesson || 1;

  const totalXp =
    profile?.total_xp || 0;

  const streakDays =
    profile?.streak_days || 0;

  const estimatedBand =
    profile?.estimated_band || "Not assessed";

  const targetBand =
    profile?.target_band || "7.0";

  const dailyMinutes =
    profile?.daily_minutes || 30;

  return (
    <main style={styles.page}>
      <div style={styles.backgroundGlowOne} />
      <div style={styles.backgroundGlowTwo} />

      <div style={styles.shell}>
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
            <Link
              href="/dashboard"
              style={{
                ...styles.navItem,
                ...styles.activeNavItem,
              }}
            >
              Dashboard
            </Link>

            <Link
              href="/roadmap"
              style={styles.navItem}
            >
              Learning roadmap
            </Link>

            <Link
              href="/profile"
              style={styles.navItem}
            >
              Learner profile
            </Link>
          </nav>

          <div style={styles.sidebarFooter}>
            <p style={styles.accountLabel}>
              SIGNED IN AS
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
                LEARNER DASHBOARD
              </p>

              <h1 style={styles.title}>
                Welcome back, {learnerName}
              </h1>

              <p style={styles.subtitle}>
                Continue building your English skills
                toward IELTS {targetBand}.
              </p>
            </div>

            <div style={styles.avatar}>
              {learnerName
                .charAt(0)
                .toUpperCase()}
            </div>
          </header>

          <section style={styles.statsGrid}>
            <StatCard
              label="Current level"
              value={currentLesson}
              helper={`English level: ${
                profile?.current_level || "Not set"
              }`}
            />

            <StatCard
              label="Total XP"
              value={totalXp}
              helper="Keep completing lessons"
            />

            <StatCard
              label="Learning streak"
              value={`${streakDays} days`}
              helper="Study daily to grow your streak"
            />

            <StatCard
              label="Estimated IELTS"
              value={estimatedBand}
              helper={`Target band: ${targetBand}`}
            />
          </section>

          <section style={styles.mainGrid}>
            <article style={styles.missionCard}>
              <div style={styles.cardHeader}>
                <div>
                  <p style={styles.cardEyebrow}>
                    TODAY&apos;S PLAN
                  </p>

                  <h2 style={styles.cardTitle}>
                    Your daily mission
                  </h2>
                </div>

                <span style={styles.timeBadge}>
                  {dailyMinutes} minutes
                </span>
              </div>

              <div style={styles.progressTrack}>
                <div style={styles.progressValue} />
              </div>

              <div style={styles.tasks}>
                <MissionItem
                  title="Review vocabulary"
                  duration="5 min"
                  completed
                />

                <MissionItem
                  title="Grammar practice"
                  duration="10 min"
                />

                <MissionItem
                  title="Listening challenge"
                  duration="10 min"
                />

                <MissionItem
                  title="Speaking mission"
                  duration="5 min"
                />
              </div>

              <Link
                href="/roadmap"
                style={styles.primaryLink}
              >
                Continue learning →
              </Link>
            </article>

            <article style={styles.profileCard}>
              <p style={styles.cardEyebrow}>
                YOUR GOAL
              </p>

              <h2 style={styles.goalBand}>
                IELTS {targetBand}
              </h2>

              <p style={styles.goalText}>
                Starting from{" "}
                {profile?.current_level || "Pre-A1"}
                , with a daily target of{" "}
                {dailyMinutes} minutes.
              </p>

              <div style={styles.goalDetails}>
                <div>
                  <span style={styles.detailLabel}>
                    Native language
                  </span>

                  <strong style={styles.detailValue}>
                    {profile?.native_language ||
                      "Not provided"}
                  </strong>
                </div>

                <div>
                  <span style={styles.detailLabel}>
                    Exam date
                  </span>

                  <strong style={styles.detailValue}>
                    {profile?.exam_date ||
                      "Not scheduled"}
                  </strong>
                </div>
              </div>

              <Link
                href="/onboarding"
                style={styles.secondaryLink}
              >
                Update learning profile
              </Link>
            </article>
          </section>
        </section>
      </div>
    </main>
  );
}

function StatCard({ label, value, helper }) {
  return (
    <article style={styles.statCard}>
      <span style={styles.statLabel}>{label}</span>

      <strong style={styles.statValue}>
        {value}
      </strong>

      <small style={styles.statHelper}>
        {helper}
      </small>
    </article>
  );
}

function MissionItem({
  title,
  duration,
  completed = false,
}) {
  return (
    <div style={styles.missionItem}>
      <span
        style={{
          ...styles.taskCheck,
          ...(completed
            ? styles.taskCheckCompleted
            : {}),
        }}
      >
        {completed ? "✓" : ""}
      </span>

      <span style={styles.taskTitle}>
        {title}
      </span>

      <small style={styles.taskDuration}>
        {duration}
      </small>
    </div>
  );
}

const styles = {
  page: {
    position: "relative",
    minHeight: "100vh",
    overflow: "hidden",
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
    border: "4px solid rgba(255,255,255,.22)",
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

  backgroundGlowOne: {
    position: "absolute",
    width: "420px",
    height: "420px",
    top: "-220px",
    right: "-170px",
    borderRadius: "50%",
    background: "rgba(236,66,199,.12)",
    filter: "blur(14px)",
  },

  backgroundGlowTwo: {
    position: "absolute",
    width: "360px",
    height: "360px",
    bottom: "-220px",
    left: "80px",
    borderRadius: "50%",
    background: "rgba(116,72,255,.12)",
    filter: "blur(14px)",
  },

  shell: {
    position: "relative",
    zIndex: 1,
    minHeight: "100vh",
    display: "grid",
    gridTemplateColumns: "260px minmax(0, 1fr)",
  },

  sidebar: {
    display: "flex",
    flexDirection: "column",
    padding: "30px 22px",
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

  sidebarFooter: {
    marginTop: "auto",
    paddingTop: "28px",
    borderTop: "1px solid rgba(255,255,255,.1)",
  },

  accountLabel: {
    margin: 0,
    color: "#7f88ae",
    fontSize: "9px",
    fontWeight: "800",
    letterSpacing: "1px",
  },

  accountEmail: {
    overflow: "hidden",
    margin: "7px 0 15px",
    color: "#ffffff",
    fontSize: "11px",
    textOverflow: "ellipsis",
  },

  logoutButton: {
    width: "100%",
    padding: "11px",
    border: "1px solid rgba(255,255,255,.15)",
    borderRadius: "10px",
    background: "rgba(255,255,255,.06)",
    color: "#ffffff",
    cursor: "pointer",
  },

  content: {
    padding: "42px",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "24px",
    marginBottom: "31px",
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
    margin: "10px 0 0",
    color: "#737b96",
    fontSize: "14px",
  },

  avatar: {
    width: "54px",
    height: "54px",
    display: "grid",
    placeItems: "center",
    flexShrink: 0,
    borderRadius: "18px",
    background:
      "linear-gradient(135deg,#7448ff,#ec42c7)",
    color: "#ffffff",
    fontSize: "19px",
    fontWeight: "900",
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(190px, 1fr))",
    gap: "17px",
  },

  statCard: {
    display: "grid",
    gap: "9px",
    padding: "22px",
    border: "1px solid #e7e9f2",
    borderRadius: "18px",
    background: "#ffffff",
    boxShadow: "0 10px 30px rgba(30,40,80,.05)",
  },

  statLabel: {
    color: "#81889f",
    fontSize: "11px",
    fontWeight: "700",
  },

  statValue: {
    color: "#172452",
    fontSize: "30px",
  },

  statHelper: {
    color: "#a0a6b8",
    fontSize: "10px",
    lineHeight: 1.4,
  },

  mainGrid: {
    display: "grid",
    gridTemplateColumns:
      "minmax(0, 1.6fr) minmax(270px, .8fr)",
    gap: "20px",
    marginTop: "20px",
  },

  missionCard: {
    padding: "27px",
    borderRadius: "20px",
    background: "#ffffff",
    boxShadow: "0 10px 30px rgba(30,40,80,.05)",
  },

  profileCard: {
    padding: "27px",
    borderRadius: "20px",
    background:
      "linear-gradient(145deg,#171f48,#291d55)",
    color: "#ffffff",
    boxShadow: "0 18px 50px rgba(25,30,70,.18)",
  },

  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "15px",
  },

  cardEyebrow: {
    margin: "0 0 7px",
    color: "#a794ff",
    fontSize: "9px",
    fontWeight: "900",
    letterSpacing: "1.2px",
  },

  cardTitle: {
    margin: 0,
    color: "#172452",
    fontSize: "23px",
  },

  timeBadge: {
    padding: "8px 11px",
    borderRadius: "999px",
    background: "#f1edff",
    color: "#7448ff",
    fontSize: "10px",
    fontWeight: "800",
  },

  progressTrack: {
    height: "8px",
    overflow: "hidden",
    margin: "24px 0",
    borderRadius: "999px",
    background: "#eceef5",
  },

  progressValue: {
    width: "25%",
    height: "100%",
    borderRadius: "999px",
    background:
      "linear-gradient(90deg,#7448ff,#ec42c7)",
  },

  tasks: {
    display: "grid",
    gap: "10px",
    marginBottom: "22px",
  },

  missionItem: {
    display: "flex",
    alignItems: "center",
    gap: "11px",
    padding: "13px",
    borderRadius: "12px",
    background: "#f7f8fc",
  },

  taskCheck: {
    width: "20px",
    height: "20px",
    display: "grid",
    placeItems: "center",
    flexShrink: 0,
    border: "1px solid #d9ddeb",
    borderRadius: "7px",
    color: "#ffffff",
    fontSize: "11px",
  },

  taskCheckCompleted: {
    borderColor: "#7448ff",
    background: "#7448ff",
  },

  taskTitle: {
    flex: 1,
    color: "#303957",
    fontSize: "12px",
    fontWeight: "700",
  },

  taskDuration: {
    color: "#969db2",
    fontSize: "10px",
  },

  primaryLink: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "13px 19px",
    borderRadius: "11px",
    background:
      "linear-gradient(135deg,#7448ff,#ec42c7)",
    color: "#ffffff",
    textDecoration: "none",
    fontSize: "12px",
    fontWeight: "900",
  },

  secondaryLink: {
    display: "inline-block",
    marginTop: "23px",
    color: "#ddd6ff",
    fontSize: "11px",
    fontWeight: "700",
  },

  goalBand: {
    margin: "9px 0",
    fontSize: "36px",
  },

  goalText: {
    margin: 0,
    color: "#bdc3df",
    fontSize: "12px",
    lineHeight: 1.7,
  },

  goalDetails: {
    display: "grid",
    gap: "15px",
    marginTop: "24px",
    paddingTop: "22px",
    borderTop: "1px solid rgba(255,255,255,.1)",
  },

  detailLabel: {
    display: "block",
    marginBottom: "5px",
    color: "#818bad",
    fontSize: "9px",
    fontWeight: "800",
    textTransform: "uppercase",
  },

  detailValue: {
    fontSize: "12px",
  },
};