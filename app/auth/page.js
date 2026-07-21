"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Gamepad2,
  GraduationCap,
  Languages,
  LockKeyhole,
} from "lucide-react";

import { supabase, supabaseConfigured } from "@/lib/supabase";
import NoriMascot from "@/components/NoriMascot";
import LanguageToggle from "@/components/LanguageToggle";
import { useLanguage } from "@/components/LanguageProvider";
import styles from "./auth.module.css";

export default function AuthPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const vi = language === "vi";

  const [mode, setMode] = useState("signin");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setMessage("");

    if (!supabase) {
      setMessage(
        vi
          ? "Nexora chưa đọc được biến môi trường Supabase. Kiểm tra cấu hình Vercel rồi redeploy."
          : "Nexora cannot read the Supabase environment variables. Check Vercel settings and redeploy."
      );
      return;
    }

    setBusy(true);

    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email: form.email,
          password: form.password,
          options: {
            data: {
              full_name: form.name,
            },
          },
        });

        if (error) throw error;

        setMessage(
          vi
            ? "Tài khoản đã được tạo. Kiểm tra email xác nhận nếu Supabase yêu cầu."
            : "Account created. Check your email if confirmation is enabled."
        );
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: form.email,
          password: form.password,
        });

        if (error) throw error;

        router.replace("/dashboard");
      }
    } catch (error) {
      setMessage(error?.message || "Authentication failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className={styles.page}>
      <section className={styles.showcase}>
        <header className={styles.showcaseHeader}>
          <Link href="/" className={styles.brand}>
            <span className={styles.brandMark}>N</span>
            <span>
              <strong>NEXORA</strong>
              <small>Road to IELTS 8.0</small>
            </span>
          </Link>

          <LanguageToggle />
        </header>

        <div className={styles.showcaseContent}>
          <p className="eyebrow">
            {vi ? "LMS SONG NGỮ, GAME HÓA" : "BILINGUAL, GAMIFIED LMS"}
          </p>

          <h1>
            {vi ? "Đăng nhập để tiếp tục" : "Your learning journey"}{" "}
            <span className="gradientText">
              {vi ? "lộ trình cá nhân" : "continues here"}
            </span>
          </h1>

          <p className={styles.showcaseLead}>
            {vi
              ? "Placement Test, 100 level, nhiệm vụ tương tác, Flappy Nori và mô phỏng IELTS trên máy tính — tất cả trong một hệ thống."
              : "Placement diagnostics, 100 levels, interactive missions, Flappy Nori and computer-based IELTS practice in one system."}
          </p>

          <div className={styles.featureList}>
            <Feature
              icon={CheckCircle2}
              title={vi ? "Lộ trình theo năng lực" : "Ability-based pathway"}
              text={vi ? "Bắt đầu đúng level." : "Start at the right level."}
            />
            <Feature
              icon={Gamepad2}
              title={vi ? "Học qua nhiệm vụ" : "Mission-based learning"}
              text={vi ? "Game, XP, xu và boss battle." : "Games, XP, coins and boss battles."}
            />
            <Feature
              icon={GraduationCap}
              title={vi ? "IELTS giống thi máy" : "Computer-based IELTS"}
              text={vi ? "Timer, navigator và split view." : "Timer, navigator and split view."}
            />
            <Feature
              icon={Languages}
              title={vi ? "Song ngữ EN–VI" : "English–Vietnamese"}
              text={vi ? "Chuyển ngôn ngữ tức thì." : "Switch language instantly."}
            />
          </div>
        </div>

        <div className={styles.nori}>
          <NoriMascot
            size={150}
            mood="happy"
            speech={
              vi
                ? "Chào mừng quay lại! Nhiệm vụ hôm nay đang chờ bạn."
                : "Welcome back! Today's mission is ready."
            }
          />
        </div>
      </section>

      <section className={styles.formPanel}>
        <div className={styles.formCard}>
          <div className={styles.mobileBrand}>
            <NoriMascot size={92} />
            <strong>NEXORA</strong>
          </div>

          <p className="eyebrow">
            {mode === "signup"
              ? vi
                ? "TẠO TÀI KHOẢN"
                : "CREATE ACCOUNT"
              : vi
                ? "CHÀO MỪNG TRỞ LẠI"
                : "WELCOME BACK"}
          </p>

          <h2>
            {mode === "signup"
              ? vi
                ? "Bắt đầu cùng Nexora"
                : "Start with Nexora"
              : vi
                ? "Tiếp tục lộ trình"
                : "Continue your pathway"}
          </h2>

          <p className={styles.formIntro}>
            {mode === "signup"
              ? vi
                ? "Tạo tài khoản, làm Placement Test và nhận level đề xuất."
                : "Create an account, take the placement test and receive your recommended level."
              : vi
                ? "Đăng nhập để tiếp tục nhiệm vụ, streak và tiến độ đã lưu."
                : "Sign in to continue your saved missions, streak and progress."}
          </p>

          <form onSubmit={submit} className={styles.form}>
            {mode === "signup" && (
              <label>
                {vi ? "Họ và tên" : "Full name"}
                <input
                  required
                  autoComplete="name"
                  value={form.name}
                  onChange={(event) =>
                    setForm({ ...form, name: event.target.value })
                  }
                />
              </label>
            )}

            <label>
              Email
              <input
                type="email"
                required
                autoComplete="email"
                value={form.email}
                onChange={(event) =>
                  setForm({ ...form, email: event.target.value })
                }
              />
            </label>

            <label>
              {vi ? "Mật khẩu" : "Password"}
              <div className={styles.passwordField}>
                <LockKeyhole size={18} />
                <input
                  type="password"
                  required
                  minLength={6}
                  autoComplete={mode === "signup" ? "new-password" : "current-password"}
                  value={form.password}
                  onChange={(event) =>
                    setForm({ ...form, password: event.target.value })
                  }
                />
              </div>
            </label>

            <button className={styles.submit} disabled={busy}>
              {busy
                ? "..."
                : mode === "signup"
                  ? vi
                    ? "Tạo tài khoản"
                    : "Create account"
                  : vi
                    ? "Đăng nhập"
                    : "Sign in"}
              <ArrowRight size={18} />
            </button>
          </form>

          {!supabaseConfigured && (
            <div className={styles.configurationNotice}>
              <strong>
                {vi ? "Cần cấu hình Supabase" : "Supabase configuration required"}
              </strong>
              <span>
                {vi
                  ? "Package hiện hỗ trợ cả PUBLISHABLE_KEY và ANON_KEY. Thêm biến trên Vercel rồi redeploy."
                  : "This package supports both PUBLISHABLE_KEY and ANON_KEY. Add the variables in Vercel and redeploy."}
              </span>
            </div>
          )}

          {message && <div className={styles.message}>{message}</div>}

          <button
            type="button"
            className={styles.switch}
            onClick={() => {
              setMode(mode === "signin" ? "signup" : "signin");
              setMessage("");
            }}
          >
            {mode === "signin"
              ? vi
                ? "Chưa có tài khoản? Tạo tài khoản"
                : "New to Nexora? Create an account"
              : vi
                ? "Đã có tài khoản? Đăng nhập"
                : "Already registered? Sign in"}
          </button>

          <Link href="/" className={styles.homeLink}>
            {vi ? "← Quay về trang chủ" : "← Return to homepage"}
          </Link>
        </div>
      </section>
    </main>
  );
}

function Feature({ icon: Icon, title, text }) {
  return (
    <article>
      <span>
        <Icon size={19} />
      </span>
      <div>
        <strong>{title}</strong>
        <small>{text}</small>
      </div>
    </article>
  );
}
