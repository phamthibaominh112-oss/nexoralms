"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import Link from "next/link";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Dashboard() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      router.replace("/auth");
      return;
    }

    setUser(session.user);
    setLoading(false);
  }

  async function logout() {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  if (loading) {
    return (
      <main
        style={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          fontSize: 20,
        }}
      >
        Loading dashboard...
      </main>
    );
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f4f7fb",
        padding: 40,
        fontFamily: "Arial",
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 40,
          }}
        >
          <div>
            <h1>Nexora Dashboard</h1>

            <p>{user.email}</p>
          </div>

          <button
            onClick={logout}
            style={{
              background: "#ef4444",
              color: "#fff",
              border: 0,
              borderRadius: 10,
              padding: "12px 22px",
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
            gap: 20,
          }}
        >
          <Card title="Current Level" value="1" />
          <Card title="Total XP" value="0" />
          <Card title="Current Streak" value="0 days" />
          <Card title="Estimated IELTS" value="Unknown" />
        </div>

        <div
          style={{
            marginTop: 40,
            background: "#fff",
            borderRadius: 20,
            padding: 30,
          }}
        >
          <h2>Today's Mission</h2>

          <ul
            style={{
              lineHeight: 2,
            }}
          >
            <li>Learn 10 vocabulary words</li>
            <li>Complete Grammar Lesson 1</li>
            <li>Practice Listening</li>
            <li>Earn 100 XP</li>
          </ul>

          <Link
            href="/roadmap"
            style={{
              display: "inline-block",
              marginTop: 20,
              background: "#6d5dfc",
              color: "#fff",
              textDecoration: "none",
              padding: "14px 28px",
              borderRadius: 12,
            }}
          >
            Continue Learning →
          </Link>
        </div>
      </div>
    </main>
  );
}

function Card({ title, value }) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 20,
        padding: 24,
      }}
    >
      <div
        style={{
          color: "#777",
          fontSize: 14,
        }}
      >
        {title}
      </div>

      <h2
        style={{
          marginTop: 10,
          fontSize: 36,
        }}
      >
        {value}
      </h2>
    </div>
  );
}