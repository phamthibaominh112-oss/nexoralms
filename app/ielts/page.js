"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Headphones,
  BookOpen,
  PenLine,
  Mic2,
  Clock3,
  Monitor,
  FileCheck2,
} from "lucide-react";

import AppShell from "@/components/AppShell";
import { useLanguage } from "@/components/LanguageProvider";
import { supabase } from "@/lib/supabase";
import styles from "./ielts.module.css";

const moduleIcons = {
  listening: Headphones,
  reading: BookOpen,
  writing: PenLine,
  speaking: Mic2,
};

export default function IELTSPage() {
  const { language } = useLanguage();
  const vi = language === "vi";
  const [papers, setPapers] = useState([]);

  useEffect(() => {
    async function load() {
      if (!supabase) return;

      const { data } = await supabase
        .from("ielts_papers")
        .select(`
          id,
          slug,
          title,
          module,
          duration_minutes,
          status,
          metadata,
          ielts_test_suites(title,slug,status)
        `)
        .eq("status", "published")
        .eq("is_published", true)
        .order("created_at", { ascending: false });

      setPapers(data || []);
    }

    load();
  }, []);

  const demos = [
    ["listening", Headphones, "IELTS Listening Demo", "4 sections · 40 questions · audio controls"],
    ["reading", BookOpen, "IELTS Reading Demo", "3 passages · 40 questions · split screen"],
    ["writing", PenLine, "IELTS Writing Demo", "Task 1 + Task 2 · timer · word count"],
    ["speaking", Mic2, "IELTS Speaking Demo", "Part 1–3 · preparation timer · recording"],
  ];

  return (
    <AppShell>
      <header className={styles.header}>
        <div>
          <p className="eyebrow">COMPUTER-BASED IELTS</p>
          <h1>
            {vi
              ? "Đề luyện thi IELTS đã được kiểm duyệt"
              : "Reviewed IELTS practice tests"}
          </h1>
          <p>
            {vi
              ? "Đề chỉ xuất hiện sau khi admin hoàn thiện đáp án, audio và publish từ Test Studio."
              : "Tests appear here only after an administrator completes the answer keys, audio and publishing checklist."}
          </p>
        </div>
        <Monitor size={80} />
      </header>

      <section className={styles.info}>
        <span><Clock3 /> Timed sections</span>
        <span><Monitor /> Computer-test layout</span>
        <span>40-question paper structure</span>
        <span>Autosaved attempts</span>
      </section>

      {papers.length > 0 && (
        <>
          <div className={styles.libraryHeading}>
            <p className="eyebrow">{vi ? "ĐỀ ĐÃ PUBLISH" : "PUBLISHED TESTS"}</p>
            <h2>{vi ? "Test library" : "Test library"}</h2>
          </div>

          <section className={styles.grid}>
            {papers.map((paper) => {
              const Icon = moduleIcons[paper.module] || FileCheck2;
              return (
                <Link
                  key={paper.id}
                  href={`/ielts/${paper.module}/${paper.slug}`}
                  className="card"
                >
                  <Icon size={28} />
                  <p className="eyebrow">
                    {paper.ielts_test_suites?.title || "NEXORA IELTS"}
                  </p>
                  <h2>{paper.title}</h2>
                  <p>
                    {paper.duration_minutes} minutes ·{" "}
                    {paper.module.toUpperCase()}
                  </p>
                  <strong>
                    {vi ? "Mở đề thi" : "Open test"} →
                  </strong>
                </Link>
              );
            })}
          </section>
        </>
      )}

      <div className={styles.libraryHeading}>
        <p className="eyebrow">ENGINE DEMOS</p>
        <h2>{vi ? "Giao diện mẫu" : "Interface demos"}</h2>
      </div>

      <section className={styles.grid}>
        {demos.map(([slug, Icon, title, text]) => (
          <Link
            key={slug}
            href={`/ielts/${slug}/demo`}
            className="card"
          >
            <Icon size={28} />
            <h2>{title}</h2>
            <p>{text}</p>
            <strong>
              {vi ? "Mở demo" : "Open demo"} →
            </strong>
          </Link>
        ))}
      </section>
    </AppShell>
  );
}
