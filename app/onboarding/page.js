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

const levelOptions = [
  {
    value: "Pre-A1",
    label: "Pre-A1 — Complete beginner",
  },
  {
    value: "A1",
    label: "A1 — Beginner",
  },
  {
    value: "A2",
    label: "A2 — Elementary",
  },
  {
    value: "B1",
    label: "B1 — Intermediate",
  },
  {
    value: "B2",
    label: "B2 — Upper-intermediate",
  },
  {
    value: "C1",
    label: "C1 — Advanced",
  },
];

const targetOptions = [
  "5.0",
  "5.5",
  "6.0",
  "6.5",
  "7.0",
  "7.5",
  "8.0",
  "8.5",
  "9.0",
];

const studyTimeOptions = [
  {
    value: 15,
    label: "15 minutes",
  },
  {
    value: 30,
    label: "30 minutes",
  },
  {
    value: 45,
    label: "45 minutes",
  },
  {
    value: 60,
    label: "60 minutes",
  },
  {
    value: 90,
    label: "90 minutes",
  },
];

function normalizeLevel(value) {
  const allowedLevels = levelOptions.map(
    (option) => option.value
  );

  return allowedLevels.includes(value)
    ? value
    : "Pre-A1";
}

function normalizeBand(value) {
  const parsedValue = Number(value);

  if (
    Number.isNaN(parsedValue) ||
    parsedValue < 5 ||
    parsedValue > 9
  ) {
    return "5.0";
  }

  return parsedValue.toFixed(1);
}

export default function OnboardingPage() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [checkingSession, setCheckingSession] =
    useState(true);
  const [saving, setSaving] = useState(false);

  const [fullName, setFullName] = useState("");
  const [nativeLanguage, setNativeLanguage] =
    useState("Vietnamese");
  const [currentLevel, setCurrentLevel] =
    useState("Pre-A1");
  const [targetBand, setTargetBand] =
    useState("5.0");
  const [examDate, setExamDate] = useState("");
  const [dailyMinutes, setDailyMinutes] =
    useState(30);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] =
    useState("error");

  const displayedLevel = useMemo(
    () => normalizeLevel(currentLevel),
    [currentLevel]
  );

  const displayedBand = useMemo(
    () => normalizeBand(targetBand),
    [targetBand]
  );

  useEffect(() => {
    checkSession();
  }, []);

  async function checkSession() {
    if (!supabase) {
      setMessageType("error");
      setMessage(
        "Supabase environment variables are missing."
      );
      setCheckingSession(false);
      return;
    }

    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session) {
      router.replace("/auth");
      return;
    }

    setUser(session.user);

    const {
      data: existingProfile,
      error: profileError,
    } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", session.user.id)
      .maybeSingle();

    if (profileError) {
      setMessageType("error");
      setMessage(profileError.message);
      setCheckingSession(false);
      return;
    }

    if (existingProfile?.onboarding_completed) {
      router.replace("/dashboard");
      return;
    }

    if (existingProfile) {
      setFullName(
        existingProfile.full_name || ""
      );

      setNativeLanguage(
        existingProfile.native_language ||
          "Vietnamese"
      );

      setCurrentLevel(
        normalizeLevel(
          existingProfile.current_level
        )
      );

      setTargetBand(
        normalizeBand(
          existingProfile.target_band
        )
      );

      setExamDate(
        existingProfile.exam_date || ""
      );

      setDailyMinutes(
        Number(
          existingProfile.daily_minutes || 30
        )
      );
    }

    setCheckingSession(false);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");

    if (!supabase || !user) {
      setMessageType("error");
      setMessage(
        "Your login session could not be found."
      );
      return;
    }

    if (!fullName.trim()) {
      setMessageType("error");
      setMessage(
        "Please enter your full name."
      );
      return;
    }

    if (!displayedLevel) {
      setMessageType("error");
      setMessage(
        "Please select your current English level."
      );
      return;
    }

    setSaving(true);

    const profileData = {
      id: user.id,
      full_name: fullName.trim(),
      native_language:
        nativeLanguage.trim() || "Vietnamese",
      current_level: displayedLevel,
      target_band: Number(displayedBand),
      exam_date: examDate || null,
      daily_minutes: Number(dailyMinutes),
      onboarding_completed: true,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from("profiles")
      .upsert(profileData, {
        onConflict: "id",
      });

    if (error) {
      setMessageType("error");
      setMessage(error.message);
      setSaving(false);
      return;
    }

    setMessageType("success");
    setMessage(
      "Your learning profile has been created."
    );

    setTimeout(() => {
      router.replace("/dashboard");
      router.refresh();
    }, 500);
  }

  if (checkingSession) {
    return (
      <main style={styles.loadingPage}>
        <div style={styles.loader} />

        <p style={styles.loadingText}>
          Preparing your Nexora journey...
        </p>
      </main>
    );
  }

  return (
    <main style={styles.page}>
      <div style={styles.backgroundOrbOne} />
      <div style={styles.backgroundOrbTwo} />

      <section style={styles.wrapper}>
        <header style={styles.header}>
          <Link href="/" style={styles.brand}>
            NEXORA
          </Link>

          <p style={styles.brandSubtitle}>
            ROAD TO IELTS 8.0
          </p>

          <div style={styles.stepPill}>
            PROFILE SETUP
          </div>

          <h1 style={styles.title}>
            Let&apos;s personalize your learning
            journey
          </h1>

          <p style={styles.description}>
            Nexora will use these details to
            recommend your starting level, daily
            plan and IELTS pathway.
          </p>
        </header>

        <form
          onSubmit={handleSubmit}
          style={styles.formCard}
        >
          <div style={styles.formGrid}>
            <label style={styles.field}>
              <span style={styles.label}>
                Full name
              </span>

              <input
                type="text"
                value={fullName}
                onChange={(event) =>
                  setFullName(event.target.value)
                }
                placeholder="Enter your full name"
                autoComplete="name"
                style={styles.input}
              />
            </label>

            <label style={styles.field}>
              <span style={styles.label}>
                Native language
              </span>

              <input
                type="text"
                value={nativeLanguage}
                onChange={(event) =>
                  setNativeLanguage(
                    event.target.value
                  )
                }
                placeholder="Vietnamese"
                style={styles.input}
              />
            </label>

            <label style={styles.field}>
              <span style={styles.label}>
                Current English level
              </span>

              <select
                value={displayedLevel}
                onChange={(event) =>
                  setCurrentLevel(
                    event.target.value
                  )
                }
                style={styles.input}
              >
                {levelOptions.map((option) => (
                  <option
                    value={option.value}
                    key={option.value}
                  >
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label style={styles.field}>
              <span style={styles.label}>
                Target IELTS band
              </span>

              <select
                value={displayedBand}
                onChange={(event) =>
                  setTargetBand(
                    event.target.value
                  )
                }
                style={styles.input}
              >
                {targetOptions.map((band) => (
                  <option value={band} key={band}>
                    IELTS {band}
                  </option>
                ))}
              </select>
            </label>

            <label style={styles.field}>
              <span style={styles.label}>
                Target exam date
              </span>

              <input
                type="date"
                value={examDate}
                onChange={(event) =>
                  setExamDate(event.target.value)
                }
                style={styles.input}
              />

              <small style={styles.helper}>
                You may leave this blank.
              </small>
            </label>

            <label style={styles.field}>
              <span style={styles.label}>
                Daily study goal
              </span>

              <select
                value={dailyMinutes}
                onChange={(event) =>
                  setDailyMinutes(
                    Number(event.target.value)
                  )
                }
                style={styles.input}
              >
                {studyTimeOptions.map(
                  (option) => (
                    <option
                      value={option.value}
                      key={option.value}
                    >
                      {option.label} per day
                    </option>
                  )
                )}
              </select>
            </label>
          </div>

          <div style={styles.planPreview}>
            <div style={styles.previewContent}>
              <span style={styles.previewLabel}>
                YOUR INITIAL PLAN
              </span>

              <h2 style={styles.previewTitle}>
                {displayedLevel} → IELTS{" "}
                {displayedBand}
              </h2>

              <p style={styles.previewText}>
                Study {dailyMinutes} minutes each
                day through guided lessons,
                practice and weekly checkpoints.
              </p>
            </div>

            <div style={styles.levelBadge}>
              {displayedLevel}
            </div>
          </div>

          {message && (
            <div
              style={{
                ...styles.message,
                ...(messageType === "success"
                  ? styles.successMessage
                  : styles.errorMessage),
              }}
            >
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={saving}
            style={{
              ...styles.submitButton,
              opacity: saving ? 0.7 : 1,
              cursor: saving
                ? "wait"
                : "pointer",
            }}
          >
            {saving
              ? "Creating your learning plan..."
              : "Create my learning plan →"}
          </button>

          <p style={styles.privacyText}>
            Your profile is private and is only
            used to personalize your Nexora
            learning experience.
          </p>
        </form>
      </section>
    </main>
  );
}

const styles = {
  page: {
    position: "relative",
    minHeight: "100vh",
    overflow: "hidden",
    padding: "48px 22px",
    background:
      "linear-gradient(145deg, #101735 0%, #17214c 52%, #25194e 100%)",
    fontFamily:
      "Arial, Helvetica, sans-serif",
  },

  loadingPage: {
    minHeight: "100vh",
    display: "grid",
    placeItems: "center",
    alignContent: "center",
    gap: "16px",
    background:
      "linear-gradient(145deg, #101735, #25194e)",
    fontFamily:
      "Arial, Helvetica, sans-serif",
  },

  loader: {
    width: "42px",
    height: "42px",
    border:
      "4px solid rgba(255,255,255,.25)",
    borderTopColor: "#ffffff",
    borderRadius: "50%",
  },

  loadingText: {
    margin: 0,
    color: "#ffffff",
    fontSize: "14px",
  },

  backgroundOrbOne: {
    position: "absolute",
    width: "420px",
    height: "420px",
    top: "-190px",
    right: "-100px",
    borderRadius: "50%",
    background:
      "rgba(236, 66, 199, 0.25)",
    filter: "blur(20px)",
  },

  backgroundOrbTwo: {
    position: "absolute",
    width: "350px",
    height: "350px",
    bottom: "-180px",
    left: "-100px",
    borderRadius: "50%",
    background:
      "rgba(116, 72, 255, 0.24)",
    filter: "blur(20px)",
  },

  wrapper: {
    position: "relative",
    zIndex: 1,
    width: "100%",
    maxWidth: "880px",
    margin: "0 auto",
  },

  header: {
    maxWidth: "670px",
    margin: "0 auto 30px",
    textAlign: "center",
  },

  brand: {
    color: "#ffffff",
    textDecoration: "none",
    fontSize: "22px",
    fontWeight: "900",
    letterSpacing: "4px",
  },

  brandSubtitle: {
    margin: "6px 0 28px",
    color: "#aeb5d4",
    fontSize: "10px",
    letterSpacing: "1.7px",
  },

  stepPill: {
    display: "inline-block",
    marginBottom: "17px",
    padding: "8px 14px",
    border:
      "1px solid rgba(255,255,255,.15)",
    borderRadius: "999px",
    background:
      "rgba(255,255,255,.08)",
    color: "#dfd9ff",
    fontSize: "10px",
    fontWeight: "800",
    letterSpacing: "1.4px",
  },

  title: {
    margin: "0 0 14px",
    color: "#ffffff",
    fontSize:
      "clamp(32px, 5vw, 49px)",
    lineHeight: 1.08,
  },

  description: {
    maxWidth: "620px",
    margin: "0 auto",
    color: "#b8bfdc",
    fontSize: "15px",
    lineHeight: 1.7,
  },

  formCard: {
    padding: "34px",
    border:
      "1px solid rgba(255,255,255,.7)",
    borderRadius: "27px",
    background:
      "rgba(255,255,255,.98)",
    boxShadow:
      "0 30px 90px rgba(0,0,0,.32)",
  },

  formGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "21px",
  },

  field: {
    display: "grid",
    gap: "8px",
  },

  label: {
    color: "#283252",
    fontSize: "12px",
    fontWeight: "800",
  },

  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "14px",
    border:
      "1px solid #dfe3ee",
    borderRadius: "12px",
    background: "#ffffff",
    color: "#222c4b",
    outline: "none",
    fontSize: "14px",
  },

  helper: {
    color: "#9097ac",
    fontSize: "10px",
  },

  planPreview: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    marginTop: "29px",
    padding: "22px",
    borderRadius: "18px",
    background:
      "linear-gradient(135deg, #f3f0ff, #fff1fb)",
  },

  previewContent: {
    minWidth: 0,
    flex: 1,
  },

  previewLabel: {
    color: "#7a55e7",
    fontSize: "9px",
    fontWeight: "900",
    letterSpacing: "1.3px",
  },

  previewTitle: {
    margin: "7px 0",
    color: "#172452",
    fontSize: "22px",
    lineHeight: 1.3,
  },

  previewText: {
    maxWidth: "520px",
    margin: 0,
    color: "#717994",
    fontSize: "12px",
    lineHeight: 1.6,
  },

  levelBadge: {
    minWidth: "88px",
    height: "72px",
    display: "grid",
    placeItems: "center",
    flexShrink: 0,
    padding: "0 14px",
    boxSizing: "border-box",
    borderRadius: "20px",
    background:
      "linear-gradient(135deg, #7448ff, #ec42c7)",
    color: "#ffffff",
    fontSize: "15px",
    fontWeight: "900",
    textAlign: "center",
    boxShadow:
      "0 12px 28px rgba(116,72,255,.28)",
  },

  message: {
    marginTop: "20px",
    padding: "13px",
    borderRadius: "11px",
    fontSize: "12px",
    lineHeight: 1.5,
  },

  errorMessage: {
    background: "#fff0f2",
    color: "#bd294d",
  },

  successMessage: {
    background: "#edfff6",
    color: "#147653",
  },

  submitButton: {
    width: "100%",
    marginTop: "22px",
    padding: "16px",
    border: 0,
    borderRadius: "13px",
    background:
      "linear-gradient(135deg, #7448ff, #ec42c7)",
    color: "#ffffff",
    fontSize: "14px",
    fontWeight: "900",
    boxShadow:
      "0 14px 32px rgba(116,72,255,.27)",
  },

  privacyText: {
    margin: "14px 0 0",
    color: "#959caf",
    textAlign: "center",
    fontSize: "10px",
    lineHeight: 1.5,
  },
};