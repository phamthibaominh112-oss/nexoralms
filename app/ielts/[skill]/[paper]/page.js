"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  Clock3,
  Flag,
  Loader2,
} from "lucide-react";

import AppShell from "@/components/AppShell";
import AudioButton from "@/components/AudioButton";
import { ieltsMockData } from "@/lib/ieltsMockData";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/AuthProvider";
import styles from "./exam.module.css";

function normalizeOptions(value) {
  if (Array.isArray(value)) return value;
  if (value && typeof value === "object") {
    return Object.entries(value).map(([key, text]) => `${key}. ${text}`);
  }
  return [];
}

function normalizeDatabasePaper(paper, sections) {
  const questions = [];

  for (const section of sections || []) {
    for (const item of section.ielts_items || []) {
      questions.push({
        id: item.id,
        number: item.item_number,
        section: section.section_number,
        type: item.question_type,
        prompt: item.prompt,
        options: normalizeOptions(item.options),
        answer: item.correct_answer,
        metadata: item.metadata || {},
      });
    }
  }

  return {
    id: paper.id,
    slug: paper.slug,
    title: paper.title,
    module: paper.module,
    duration: paper.duration_minutes,
    instructions: paper.instructions,
    sections: (sections || []).map((section) => ({
      id: section.id,
      section_number: section.section_number,
      title: section.title,
      text: section.passage,
      passage: section.passage,
      audio_url: section.audio_url,
      transcript: section.transcript,
      instructions: section.instructions,
      metadata: section.metadata || {},
    })),
    questions,
    tasks: paper.metadata?.tasks || paper.metadata?.parts || [],
    database: true,
  };
}

export default function IELTSExamPage() {
  const { skill, paper: paperSlug } = useParams();
  const { user } = useAuth();

  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [seconds, setSeconds] = useState(0);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [flagged, setFlagged] = useState([]);
  const [submitResult, setSubmitResult] = useState(null);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setMessage("");

      if (paperSlug === "demo") {
        const demo = ieltsMockData[skill] || ieltsMockData.reading;
        setExam({ ...demo, module: skill, database: false });
        setSeconds(demo.duration * 60);
        setLoading(false);
        return;
      }

      if (!supabase) {
        setMessage("Supabase is not configured.");
        setLoading(false);
        return;
      }

      const { data: paperData, error: paperError } = await supabase
        .from("ielts_papers")
        .select("*")
        .eq("slug", paperSlug)
        .maybeSingle();

      if (paperError || !paperData) {
        setMessage(paperError?.message || "IELTS paper not found.");
        setLoading(false);
        return;
      }

      const { data: sectionData, error: sectionError } = await supabase
        .from("ielts_sections")
        .select(`
          *,
          ielts_items(*)
        `)
        .eq("paper_id", paperData.id)
        .order("section_number")
        .order("item_number", {
          foreignTable: "ielts_items",
          ascending: true,
        });

      if (sectionError) {
        setMessage(sectionError.message);
        setLoading(false);
        return;
      }

      const normalized = normalizeDatabasePaper(paperData, sectionData);
      setExam(normalized);
      setSeconds(normalized.duration * 60);
      setLoading(false);
    }

    load();
  }, [skill, paperSlug]);

  useEffect(() => {
    if (!exam || seconds <= 0) return;

    const timer = window.setInterval(() => {
      setSeconds((current) => Math.max(0, current - 1));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [exam, seconds]);

  const questions = exam?.questions || exam?.tasks || [];
  const question = questions[index];

  const sectionNumber = question?.section || index + 1;
  const section =
    exam?.sections?.find(
      (candidate) =>
        Number(candidate.section_number || candidate.section) ===
        Number(sectionNumber)
    ) ||
    exam?.sections?.[sectionNumber - 1];

  const time = `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(
    seconds % 60
  ).padStart(2, "0")}`;

  const answeredCount = Object.values(answers).filter((value) => {
    if (Array.isArray(value)) return value.length > 0;
    return String(value || "").trim().length > 0;
  }).length;

  function updateAnswer(value) {
    const key = String(question?.number || index + 1);
    setAnswers((current) => ({ ...current, [key]: value }));
  }

  function currentAnswer() {
    return answers[String(question?.number || index + 1)] ?? "";
  }

  async function submitTest() {
    if (!exam) return;

    if (!user) {
      localStorage.setItem(
        `nexora-ielts-${exam.slug || paperSlug}`,
        JSON.stringify({
          answers,
          flagged,
          submitted_at: new Date().toISOString(),
        })
      );

      setSubmitResult({
        success: true,
        local: true,
        message: "Saved in this browser. Sign in to save attempts to Nexora.",
      });
      return;
    }

    if (!exam.database || !exam.id) {
      setSubmitResult({
        success: true,
        local: true,
        message: "Demo completed. Database scoring applies to imported papers.",
      });
      return;
    }

    setSubmitting(true);
    setMessage("");

    const { data, error } = await supabase.rpc("save_ielts_attempt", {
      p_paper_id: exam.id,
      p_answers: answers,
      p_flagged_items: flagged,
      p_section_times: {
        total_seconds_used: exam.duration * 60 - seconds,
      },
      p_submit: true,
    });

    setSubmitting(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    setSubmitResult(data);
  }

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner" />
      </div>
    );
  }

  if (!exam) {
    return (
      <AppShell>
        <div className={styles.errorCard}>
          <h1>Test unavailable</h1>
          <p>{message || "The test could not be loaded."}</p>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <section className={styles.exam}>
        <header className={styles.top}>
          <div>
            <strong>{exam.title}</strong>
            <small>
              {String(skill).toUpperCase()} · {questions.length} questions/tasks
            </small>
          </div>

          <div className={styles.timer}>
            <Clock3 size={17} />
            {time}
          </div>

          <button
            className="primary"
            onClick={submitTest}
            disabled={submitting}
          >
            {submitting ? <Loader2 size={17} className={styles.spin} /> : null}
            Submit test
          </button>
        </header>

        <div className={styles.navigator}>
          {questions.map((item, itemIndex) => {
            const key = String(item.number || itemIndex + 1);
            return (
              <button
                key={key}
                title={`Question ${key}`}
                onClick={() => setIndex(itemIndex)}
                className={[
                  itemIndex === index ? styles.current : "",
                  answers[key] ? styles.answered : "",
                  flagged.includes(key) ? styles.flagged : "",
                ].join(" ")}
              >
                {key}
              </button>
            );
          })}
        </div>

        <div className={styles.workspace}>
          {(skill === "reading" || skill === "listening") && (
            <article className={styles.source}>
              {skill === "reading" ? (
                <>
                  <p className="eyebrow">READING PASSAGE {sectionNumber}</p>
                  <h2>{section?.title}</h2>
                  <p className={styles.passageText}>
                    {section?.passage || section?.text}
                  </p>
                </>
              ) : (
                <>
                  <p className="eyebrow">LISTENING SECTION {sectionNumber}</p>
                  <h2>{section?.title}</h2>
                  <AudioButton
                    text={section?.transcript}
                    audioUrl={section?.audio_url}
                    label={`Play Section ${sectionNumber}`}
                  />
                  {section?.transcript && (
                    <details>
                      <summary>Transcript</summary>
                      <p>{section.transcript}</p>
                    </details>
                  )}
                </>
              )}
            </article>
          )}

          <section className={styles.question}>
            <div className={styles.qhead}>
              <span>
                {question?.label ||
                  `Question ${question?.number || index + 1} of ${
                    questions.length
                  }`}
              </span>

              <button
                onClick={() => {
                  const key = String(question?.number || index + 1);
                  setFlagged((current) =>
                    current.includes(key)
                      ? current.filter((value) => value !== key)
                      : [...current, key]
                  );
                }}
              >
                <Flag size={16} />
                Flag for review
              </button>
            </div>

            {question?.metadata?.group_prompt && (
              <div className={styles.groupPrompt}>
                {question.metadata.group_prompt}
              </div>
            )}

            <h2>{question?.prompt}</h2>

            {question?.options?.length > 0 ? (
              <div className={styles.options}>
                {question.options.map((option) => {
                  const value =
                    typeof option === "string"
                      ? option.split(". ")[0]
                      : String(option);

                  return (
                    <label key={String(option)}>
                      <input
                        type="radio"
                        name={`question-${question?.number || index}`}
                        checked={
                          currentAnswer() === option ||
                          currentAnswer() === value
                        }
                        onChange={() => updateAnswer(value)}
                      />
                      <span>{String(option)}</span>
                    </label>
                  );
                })}
              </div>
            ) : skill === "writing" ? (
              <>
                <textarea
                  value={currentAnswer()}
                  onChange={(event) => updateAnswer(event.target.value)}
                  placeholder="Write your response here..."
                />
                <div className={styles.wordCount}>
                  Word count:{" "}
                  {String(currentAnswer())
                    .trim()
                    .split(/\s+/)
                    .filter(Boolean).length}
                </div>
              </>
            ) : skill === "speaking" ? (
              <SpeakingBox task={question} />
            ) : (
              <input
                className={styles.answer}
                value={currentAnswer()}
                onChange={(event) => updateAnswer(event.target.value)}
                placeholder="Type your answer"
              />
            )}
          </section>
        </div>

        <footer className={styles.bottom}>
          <button
            className="secondary"
            disabled={index === 0}
            onClick={() => setIndex((current) => current - 1)}
          >
            <ChevronLeft />
            Previous
          </button>

          <div>
            {answeredCount}/{questions.length} answered · {flagged.length} flagged
          </div>

          <button
            className="primary"
            disabled={index === questions.length - 1}
            onClick={() => setIndex((current) => current + 1)}
          >
            Next
            <ChevronRight />
          </button>
        </footer>
      </section>

      {message && <div className={styles.message}>{message}</div>}

      {submitResult && (
        <div className={styles.modal}>
          <div>
            <h2>Test submitted</h2>

            {submitResult.local ? (
              <p>{submitResult.message}</p>
            ) : (
              <>
                <p>
                  Raw score: {submitResult.raw_score}/
                  {submitResult.total_items}
                </p>
                <p>Score: {submitResult.score_percent}%</p>
                <p>Attempt ID: {submitResult.attempt_id}</p>
              </>
            )}

            <button
              className="primary"
              onClick={() => setSubmitResult(null)}
            >
              Return to review
            </button>
          </div>
        </div>
      )}
    </AppShell>
  );
}

function SpeakingBox({ task }) {
  const [recording, setRecording] = useState(false);
  const [status, setStatus] = useState("");

  async function record() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);

      recorder.onstop = () => {
        stream.getTracks().forEach((track) => track.stop());
        setStatus("Response recorded for this session.");
      };

      recorder.start();
      setRecording(true);

      window.setTimeout(() => {
        recorder.stop();
        setRecording(false);
      }, 15000);
    } catch {
      setStatus("Microphone permission is required.");
    }
  }

  return (
    <div className={styles.speaking}>
      <p>{task?.prompt}</p>
      <button className="primary" onClick={record}>
        {recording ? "Recording..." : "Record response"}
      </button>
      {status && <small>{status}</small>}
    </div>
  );
}
