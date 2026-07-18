"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase =
  supabaseUrl && supabaseKey
    ? createClient(supabaseUrl, supabaseKey)
    : null;

export default function AuthPage() {
  const router = useRouter();

  const [mode, setMode] = useState("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");

    if (!supabase) {
      setMessageType("error");
      setMessage(
        "Supabase environment variables are missing. Check Vercel Environment Variables."
      );
      return;
    }

    if (!email || !password) {
      setMessageType("error");
      setMessage("Please enter your email and password.");
      return;
    }

    if (password.length < 6) {
      setMessageType("error");
      setMessage("Password must contain at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth`,
          },
        });

        if (error) throw error;

        setMessageType("success");
        setMessage(
          "Account created. Please check your email and confirm your account before signing in."
        );
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        setMessageType("success");
        setMessage("Signed in successfully.");

        setTimeout(() => {
          router.push("/dashboard");
          router.refresh();
        }, 500);
      }
    } catch (error) {
      setMessageType("error");
      setMessage(error.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={styles.page}>
      <section style={styles.card}>
        <a href="/" style={styles.brand}>
          NEXORA
        </a>

        <p style={styles.subtitle}>ROAD TO IELTS 8.0</p>

        <h1 style={styles.title}>
          {mode === "signin" ? "Welcome back" : "Start your journey"}
        </h1>

        <p style={styles.description}>
          {mode === "signin"
            ? "Sign in to continue learning."
            : "Create your Nexora learner account."}
        </p>

        <div style={styles.tabs}>
          <button
            type="button"
            onClick={() => {
              setMode("signin");
              setMessage("");
            }}
            style={{
              ...styles.tab,
              ...(mode === "signin" ? styles.activeTab : {}),
            }}
          >
            Sign in
          </button>

          <button
            type="button"
            onClick={() => {
              setMode("signup");
              setMessage("");
            }}
            style={{
              ...styles.tab,
              ...(mode === "signup" ? styles.activeTab : {}),
            }}
          >
            Create account
          </button>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="your@email.com"
              autoComplete="email"
              style={styles.input}
            />
          </label>

          <label style={styles.label}>
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Minimum 6 characters"
              autoComplete={
                mode === "signin" ? "current-password" : "new-password"
              }
              style={styles.input}
            />
          </label>

          {message && (
            <div
              style={{
                ...styles.message,
                ...(messageType === "error"
                  ? styles.errorMessage
                  : styles.successMessage),
              }}
            >
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.submitButton,
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading
              ? "Please wait..."
              : mode === "signin"
              ? "Sign in"
              : "Create account"}
          </button>
        </form>

        <a href="/" style={styles.backLink}>
          ← Back to homepage
        </a>
      </section>
    </main>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "grid",
    placeItems: "center",
    padding: "24px",
    background:
      "radial-gradient(circle at top right, rgba(236,66,199,.22), transparent 35%), linear-gradient(145deg,#101735,#1c2452)",
    fontFamily: "Arial, sans-serif",
  },
  card: {
    width: "100%",
    maxWidth: "430px",
    padding: "38px",
    borderRadius: "24px",
    background: "#ffffff",
    boxShadow: "0 30px 80px rgba(0,0,0,.28)",
  },
  brand: {
    display: "block",
    color: "#172452",
    textDecoration: "none",
    fontSize: "20px",
    fontWeight: "800",
    letterSpacing: "3px",
  },
  subtitle: {
    margin: "5px 0 28px",
    color: "#8b91aa",
    fontSize: "10px",
    letterSpacing: "1.4px",
  },
  title: {
    margin: "0 0 8px",
    color: "#172452",
    fontSize: "32px",
  },
  description: {
    margin: "0 0 24px",
    color: "#737b96",
    fontSize: "14px",
  },
  tabs: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "8px",
    marginBottom: "24px",
    padding: "5px",
    borderRadius: "12px",
    background: "#f1f2f8",
  },
  tab: {
    padding: "11px",
    border: "0",
    borderRadius: "9px",
    background: "transparent",
    color: "#737b96",
    fontWeight: "700",
    cursor: "pointer",
  },
  activeTab: {
    background: "#ffffff",
    color: "#7448ff",
    boxShadow: "0 5px 14px rgba(31,35,80,.1)",
  },
  form: {
    display: "grid",
    gap: "17px",
  },
  label: {
    display: "grid",
    gap: "7px",
    color: "#303957",
    fontSize: "12px",
    fontWeight: "700",
  },
  input: {
    width: "100%",
    padding: "14px",
    border: "1px solid #dfe2ed",
    borderRadius: "11px",
    outline: "none",
    fontSize: "14px",
    boxSizing: "border-box",
  },
  submitButton: {
    marginTop: "3px",
    padding: "14px",
    border: "0",
    borderRadius: "11px",
    background: "linear-gradient(135deg,#7448ff,#ec42c7)",
    color: "#ffffff",
    fontWeight: "800",
    cursor: "pointer",
  },
  message: {
    padding: "12px",
    borderRadius: "10px",
    fontSize: "12px",
    lineHeight: "1.5",
  },
  errorMessage: {
    background: "#fff0f2",
    color: "#be294d",
  },
  successMessage: {
    background: "#edfff6",
    color: "#147653",
  },
  backLink: {
    display: "block",
    marginTop: "22px",
    color: "#737b96",
    textAlign: "center",
    textDecoration: "none",
    fontSize: "12px",
  },
};