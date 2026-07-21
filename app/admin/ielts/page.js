"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  CheckCircle2,
  FileJson,
  FileUp,
  GraduationCap,
  Loader2,
  ShieldCheck,
  UploadCloud,
} from "lucide-react";

import AppShell from "@/components/AppShell";
import NoriMascot from "@/components/NoriMascot";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/lib/supabase";
import styles from "./admin.module.css";

export default function AdminIELTSPage() {
  const { user, profile, loading } = useAuth();

  const [jsonText, setJsonText] = useState("");
  const [message, setMessage] = useState("");
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState(false);
  const [suites, setSuites] = useState([]);

  const isAdmin = ["admin", "founder"].includes(profile?.role);

  useEffect(() => {
    if (isAdmin) loadSuites();
  }, [isAdmin]);

  async function loadSuites() {
    if (!supabase) return;
    const { data } = await supabase
      .from("ielts_test_suites")
      .select(`
        id,
        slug,
        title,
        status,
        source_filename,
        created_at,
        ielts_papers(id,module,title,status,is_published)
      `)
      .order("created_at", { ascending: false });

    setSuites(data || []);
  }

  function readFile(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith(".json")) {
      setMessage(
        "Upload a Nexora IELTS bundle JSON. DOCX must first be converted because its tables, images and answer structure cannot be imported reliably as raw text."
      );
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setJsonText(String(reader.result || ""));
      setMessage(`Loaded ${file.name}`);
    };
    reader.readAsText(file);
  }

  async function loadOsirBundle() {
    setBusy(true);
    setMessage("");

    try {
      const response = await fetch("/imports/osir-aca-1.bundle.json");
      if (!response.ok) throw new Error("Could not load bundled OSIR test.");
      const payload = await response.json();
      setJsonText(JSON.stringify(payload, null, 2));
      setMessage(
        "OSIR ACA 1 bundle loaded. It contains Reading 40, Listening 40, Writing and Speaking. It remains draft because answer keys and Listening audio are missing."
      );
    } catch (error) {
      setMessage(error.message);
    } finally {
      setBusy(false);
    }
  }

  async function importBundle() {
    if (!supabase) {
      setMessage("Supabase is not configured.");
      return;
    }

    let payload;

    try {
      payload = JSON.parse(jsonText);
    } catch {
      setMessage("The JSON is not valid.");
      return;
    }

    if (!payload?.suite || !Array.isArray(payload?.papers)) {
      setMessage("The file must contain a suite object and a papers array.");
      return;
    }

    setBusy(true);
    setResult(null);
    setMessage("");

    const { data, error } = await supabase.rpc(
      "admin_import_ielts_bundle_json",
      { payload }
    );

    setBusy(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    setResult(data);
    setMessage(
      `Imported ${data.paper_count} modules successfully as a draft test suite.`
    );

    await loadSuites();
  }

  async function publishSuite(id) {
    setBusy(true);
    setMessage("");

    const { data, error } = await supabase.rpc(
      "admin_publish_ielts_suite",
      { p_suite_id: id }
    );

    setBusy(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    if (!data.success) {
      setMessage(
        `${data.message} Missing answers: ${data.missing_answers}. Missing Listening audio sections: ${data.missing_audio_sections}.`
      );
      return;
    }

    setMessage("The test suite is now published.");
    await loadSuites();
  }

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner" />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <AppShell>
        <section className={styles.denied}>
          <NoriMascot size={130} mood="thinking" />
          <p className="eyebrow">ADMIN TEST STUDIO</p>
          <h1>Administrator access required</h1>
          <p>
            Your profile role must be <code>admin</code> or <code>founder</code>.
          </p>
          <Link className="primary" href="/dashboard">
            Return to dashboard
          </Link>
        </section>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <header className={styles.header}>
        <div>
          <p className="eyebrow">ADMIN · IELTS TEST STUDIO</p>
          <h1>Import, review and publish IELTS tests</h1>
          <p>
            Upload structured Nexora JSON, complete answer keys and audio, then
            publish the test for learners.
          </p>
        </div>

        <NoriMascot
          size={120}
          mood="happy"
          speech="Only admins can import or publish tests."
        />
      </header>

      <section className={styles.summary}>
        <article className="card">
          <ShieldCheck size={22} />
          <span>Current role</span>
          <strong>{profile.role}</strong>
        </article>
        <article className="card">
          <GraduationCap size={22} />
          <span>Test suites</span>
          <strong>{suites.length}</strong>
        </article>
        <article className="card">
          <FileJson size={22} />
          <span>Import format</span>
          <strong>JSON bundle</strong>
        </article>
      </section>

      <section className={styles.grid}>
        <article className={`card ${styles.importCard}`}>
          <div className={styles.cardHeading}>
            <div>
              <p className="eyebrow">IMPORT TEST</p>
              <h2>IELTS bundle JSON</h2>
            </div>
            <UploadCloud size={30} />
          </div>

          <div className={styles.actions}>
            <label className="secondary">
              <FileUp size={17} />
              Choose JSON
              <input
                type="file"
                accept=".json,application/json"
                onChange={readFile}
                hidden
              />
            </label>

            <button
              className="secondary"
              onClick={loadOsirBundle}
              disabled={busy}
            >
              Load OSIR ACA 1
            </button>
          </div>

          <textarea
            value={jsonText}
            onChange={(event) => setJsonText(event.target.value)}
            placeholder='{"suite": {...}, "papers": [...]}'
          />

          <button
            className="primary"
            onClick={importBundle}
            disabled={busy || !jsonText.trim()}
          >
            {busy ? <Loader2 size={18} className={styles.spin} /> : <FileUp size={18} />}
            Import as draft
          </button>

          <div className={styles.note}>
            <AlertTriangle size={18} />
            <span>
              Raw DOCX upload is not used as the production format. DOCX files
              can contain merged tables, maps, charts and incomplete answer
              keys. Convert them to the Nexora JSON schema, then import and
              review.
            </span>
          </div>
        </article>

        <article className={`card ${styles.guideCard}`}>
          <p className="eyebrow">PUBLISHING CHECKLIST</p>
          <h2>Before learners can see a test</h2>

          {[
            "Reading and Listening contain the expected item count.",
            "Every objective question has a correct answer.",
            "All four Listening sections have uploaded audio.",
            "Maps, charts and diagrams have valid asset URLs.",
            "Writing and Speaking tasks have review rubrics.",
            "Academic team has reviewed wording and licensing.",
          ].map((item) => (
            <div key={item}>
              <CheckCircle2 size={18} />
              <span>{item}</span>
            </div>
          ))}
        </article>
      </section>

      {message && <div className={styles.message}>{message}</div>}

      {result && (
        <div className={styles.success}>
          <CheckCircle2 size={20} />
          Imported suite ID {result.suite_id} with {result.paper_count} modules.
        </div>
      )}

      <section className={styles.library}>
        <div className={styles.libraryHeader}>
          <div>
            <p className="eyebrow">TEST LIBRARY</p>
            <h2>Imported suites</h2>
          </div>
          <button className="secondary" onClick={loadSuites}>
            Refresh
          </button>
        </div>

        <div className={styles.suiteList}>
          {suites.length === 0 && (
            <div className={styles.empty}>No test suite has been imported.</div>
          )}

          {suites.map((suite) => (
            <article className="card" key={suite.id}>
              <div>
                <span className={`${styles.status} ${styles[suite.status]}`}>
                  {suite.status}
                </span>
                <h3>{suite.title}</h3>
                <p>{suite.source_filename || suite.slug}</p>
              </div>

              <div className={styles.modules}>
                {(suite.ielts_papers || []).map((paper) => (
                  <span key={paper.id}>
                    {paper.module} · {paper.status}
                  </span>
                ))}
              </div>

              <button
                className="primary"
                disabled={busy || suite.status === "published"}
                onClick={() => publishSuite(suite.id)}
              >
                Publish suite
              </button>
            </article>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
