"use client";

import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  BookOpenCheck,
  BrainCircuit,
  CheckCircle2,
  ClipboardCheck,
  Gamepad2,
  GraduationCap,
  Headphones,
  Languages,
  LayoutDashboard,
  Map,
  Mic2,
  PenLine,
  Sparkles,
  Trophy,
} from "lucide-react";

import LanguageToggle from "@/components/LanguageToggle";
import NoriMascot from "@/components/NoriMascot";
import { useLanguage } from "@/components/LanguageProvider";
import styles from "./landing.module.css";

export default function LandingPage() {
  const { language } = useLanguage();
  const vi = language === "vi";

  const featureCards = [
    {
      icon: ClipboardCheck,
      title: vi ? "Placement Test có ma trận" : "Diagnostic placement matrix",
      text: vi
        ? "40 câu Grammar, Vocabulary, Reading và Listening tạo CEFR, IELTS range, điểm mạnh và kỹ năng ưu tiên."
        : "A 40-question Grammar, Vocabulary, Reading and Listening diagnostic produces CEFR, IELTS range, strengths and priority skills.",
    },
    {
      icon: Map,
      title: vi ? "Lộ trình 100 level" : "A 100-level pathway",
      text: vi
        ? "Từ Pre-A1 đến IELTS 8.0, chia theo stage, nhiệm vụ, checkpoint và boss battle."
        : "From Pre-A1 to IELTS 8.0 through stages, missions, checkpoints and boss battles.",
    },
    {
      icon: Gamepad2,
      title: vi ? "Game hóa có mục đích" : "Purposeful gamification",
      text: vi
        ? "Flappy Nori, memory match, sentence builder, XP, xu, tim, streak và daily quest."
        : "Flappy Nori, memory match, sentence building, XP, coins, hearts, streaks and daily quests.",
    },
    {
      icon: GraduationCap,
      title: vi ? "IELTS giống thi máy" : "Computer-based IELTS practice",
      text: vi
        ? "Timer, question navigator, split view, 40 câu, flag for review, word count và thu âm Speaking."
        : "Timers, question navigation, split view, 40 items, flags, word counts and Speaking recording.",
    },
    {
      icon: Headphones,
      title: vi ? "Audio và shadowing" : "Audio and shadowing",
      text: vi
        ? "Audio thật từ Supabase Storage, phát từng từ/câu và luyện nói theo model."
        : "Real Supabase Storage audio, word and sentence playback, and guided shadowing.",
    },
    {
      icon: Languages,
      title: vi ? "Song ngữ English–Vietnamese" : "English–Vietnamese bilingual",
      text: vi
        ? "Chuyển giao diện, hướng dẫn và hỗ trợ học tập mà không rời khỏi bài."
        : "Switch interface, instructions and learning support without leaving the lesson.",
    },
  ];

  const lessonFlow = [
    [Sparkles, vi ? "Mission brief" : "Mission brief"],
    [BookOpenCheck, vi ? "Từ vựng & ngữ pháp" : "Vocabulary & grammar"],
    [Headphones, vi ? "Nghe & dictation" : "Listening & dictation"],
    [Mic2, vi ? "Phát âm & speaking" : "Pronunciation & speaking"],
    [PenLine, vi ? "Reading & writing" : "Reading & writing"],
    [Gamepad2, vi ? "Game challenge" : "Game challenge"],
    [Trophy, vi ? "Checkpoint & reward" : "Checkpoint & reward"],
  ];

  return (
    <main className={styles.page}>
      <header className={`container ${styles.header}`}>
        <Link href="/" className={styles.brand}>
          <span className={styles.brandMark}>N</span>
          <span>
            <strong>NEXORA</strong>
            <small>Road to IELTS 8.0</small>
          </span>
        </Link>

        <nav className={styles.nav}>
          <a href="#how-it-works">{vi ? "Cách hoạt động" : "How it works"}</a>
          <a href="#learning-engine">{vi ? "Hệ thống học" : "Learning engine"}</a>
          <a href="#ielts">{vi ? "IELTS" : "IELTS"}</a>
          <a href="#outcomes">{vi ? "Lộ trình" : "Outcomes"}</a>
        </nav>

        <div className={styles.headerActions}>
          <LanguageToggle />
          <Link href="/auth" className="secondary">
            {vi ? "Đăng nhập" : "Sign in"}
          </Link>
        </div>
      </header>

      <section className={`container ${styles.hero}`}>
        <div className={styles.heroCopy}>
          <div className={styles.heroBadge}>
            <BrainCircuit size={16} />
            {vi
              ? "LMS SONG NGỮ, GAME HÓA, CÁ NHÂN HÓA"
              : "BILINGUAL, GAMIFIED, PERSONALIZED LMS"}
          </div>

          <h1>
            {vi ? "Không chỉ học tiếng Anh." : "Not another English course."}
            <br />
            <span className="gradientText">
              {vi ? "Nexora xây cả hành trình." : "Nexora builds the journey."}
            </span>
          </h1>

          <p className={styles.heroLead}>
            {vi
              ? "Nexora là hệ thống quản lý học tập giúp học viên biết mình đang ở đâu, học đúng level, luyện qua nhiều dạng tương tác, theo dõi tiến độ và chuyển dần sang mô phỏng IELTS trên máy tính."
              : "Nexora is a learning management system that identifies each learner's starting point, assigns the right level, delivers varied interactive practice, measures progress and gradually transitions into computer-based IELTS simulation."}
          </p>

          <div className={styles.heroActions}>
            <Link href="/placement" className="primary">
              {vi ? "Làm Placement Test" : "Take the placement test"}
              <ArrowRight size={18} />
            </Link>

            <Link href="/auth" className="secondary">
              {vi ? "Tạo tài khoản" : "Create an account"}
            </Link>
          </div>

          <div className={styles.heroProof}>
            <span><strong>100</strong>{vi ? " level" : " levels"}</span>
            <span><strong>40</strong>{vi ? " câu placement" : " placement items"}</span>
            <span><strong>4</strong>{vi ? " kỹ năng IELTS" : " IELTS skills"}</span>
            <span><strong>EN–VI</strong>{vi ? " song ngữ" : " bilingual"}</span>
          </div>
        </div>

        <div className={styles.heroProduct}>
          <div className={styles.productWindow}>
            <div className={styles.windowTop}>
              <i />
              <i />
              <i />
              <span>Nexora Learner Dashboard</span>
            </div>

            <div className={styles.productBody}>
              <div className={styles.productSidebar}>
                <span className={styles.productLogo}>N</span>
                {[1, 2, 3, 4, 5].map((item) => <i key={item} />)}
              </div>

              <div className={styles.productContent}>
                <div className={styles.productWelcome}>
                  <div>
                    <small>TODAY'S MAIN QUEST</small>
                    <strong>Level 36 · Independent English</strong>
                    <span>Listening accuracy + speaking confidence</span>
                  </div>

                  <NoriMascot size={90} />
                </div>

                <div className={styles.productStats}>
                  <article><span>XP</span><strong>1,840</strong></article>
                  <article><span>STREAK</span><strong>12 days</strong></article>
                  <article><span>COINS</span><strong>420</strong></article>
                </div>

                <div className={styles.productProgress}>
                  <span>Road to IELTS 8.0</span>
                  <div><i style={{ width: "36%" }} /></div>
                  <strong>36%</strong>
                </div>

                <div className={styles.productCards}>
                  <article>
                    <Gamepad2 size={20} />
                    <strong>Flappy Nori</strong>
                    <span>3 gates → 1 knowledge lock</span>
                  </article>
                  <article>
                    <GraduationCap size={20} />
                    <strong>IELTS Reading</strong>
                    <span>3 passages · 40 questions</span>
                  </article>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.noriHero}>
            <NoriMascot
              size={138}
              mood="celebrate"
              speech={
                vi
                  ? "Mình sẽ không để bạn học sai level."
                  : "I won't let you start at the wrong level."
              }
            />
          </div>
        </div>
      </section>

      <section id="how-it-works" className={`container ${styles.section}`}>
        <div className={styles.sectionHeading}>
          <p className="eyebrow">{vi ? "CÁCH NEXORA HOẠT ĐỘNG" : "HOW NEXORA WORKS"}</p>
          <h2>
            {vi
              ? "Từ dữ liệu đầu vào đến một lộ trình có thể đo lường"
              : "From diagnostic data to a measurable pathway"}
          </h2>
          <p>
            {vi
              ? "Học viên không tự đoán level và không bị ném vào một kho nội dung. Mỗi bước đều có mục đích và dữ liệu."
              : "Learners do not guess their level or get dropped into a content library. Every step has a purpose and produces data."}
          </p>
        </div>

        <div className={styles.process}>
          {[
            {
              number: "01",
              title: vi ? "Chẩn đoán" : "Diagnose",
              text: vi
                ? "Placement Test tạo ma trận Grammar, Vocabulary, Reading và Listening."
                : "A placement test creates a Grammar, Vocabulary, Reading and Listening matrix.",
            },
            {
              number: "02",
              title: vi ? "Cá nhân hóa" : "Personalize",
              text: vi
                ? "Nexora đề xuất CEFR, IELTS range, level bắt đầu và kỹ năng ưu tiên."
                : "Nexora recommends CEFR, IELTS range, starting level and priority skills.",
            },
            {
              number: "03",
              title: vi ? "Học theo nhiệm vụ" : "Learn through missions",
              text: vi
                ? "Mỗi level là một session 35–45 phút với nhiều dạng tương tác."
                : "Each level is a 35–45 minute session with varied interactions.",
            },
            {
              number: "04",
              title: vi ? "Đo tiến độ" : "Measure progress",
              text: vi
                ? "XP, streak, checkpoint, skill performance và lịch sử attempt."
                : "XP, streaks, checkpoints, skill performance and attempt history.",
            },
            {
              number: "05",
              title: vi ? "Chuyển sang IELTS" : "Transition into IELTS",
              text: vi
                ? "Bài học nền tảng dần chuyển sang giao diện và dạng bài thi máy."
                : "Foundation learning gradually transitions into computer-test formats.",
            },
          ].map((step) => (
            <article key={step.number} className="card">
              <span>{step.number}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="learning-engine" className={styles.darkSection}>
        <div className={`container ${styles.darkGrid}`}>
          <div>
            <p className="eyebrow">{vi ? "LESSON ENGINE" : "LESSON ENGINE"}</p>
            <h2>
              {vi
                ? "Một level không chỉ là đọc, nghe rồi chọn đáp án"
                : "A level is more than reading, listening and clicking an option"}
            </h2>
            <p>
              {vi
                ? "Lesson Engine hỗ trợ flashcard, memory, matching, sorting, sentence builder, categorization, dictation, pronunciation recording, speaking, writing, game challenge và checkpoint."
                : "The lesson engine supports flashcards, memory, matching, sorting, sentence building, categorization, dictation, pronunciation recording, speaking, writing, game challenges and checkpoints."}
            </p>

            <div className={styles.lessonFlow}>
              {lessonFlow.map(([Icon, label], index) => (
                <article key={label}>
                  <span><Icon size={19} /></span>
                  <strong>{index + 1}. {label}</strong>
                </article>
              ))}
            </div>
          </div>

          <div className={styles.missionCard}>
            <div className={styles.missionTop}>
              <div>
                <small>LEVEL 36 · B1</small>
                <h3>Mission: Explain an Experience</h3>
              </div>
              <span>+120 XP</span>
            </div>

            <div className={styles.missionProgress}>
              <span>Mission progress</span>
              <strong>68%</strong>
              <div><i /></div>
            </div>

            <div className={styles.activityPreview}>
              <p>MULTI SELECT · 3/8</p>
              <h4>Select all sentences that describe a past experience correctly.</h4>
              <button>I've visited Singapore twice.</button>
              <button className={styles.activitySelected}>I went there last year.</button>
              <button>I've went there yesterday.</button>
            </div>

            <div className={styles.missionFooter}>
              <NoriMascot size={72} mood="thinking" />
              <span>
                {vi
                  ? "Nori giải thích vì sao đáp án đúng hoặc sai, không chỉ báo điểm."
                  : "Nori explains why an answer is right or wrong instead of only showing a score."}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section id="ielts" className={`container ${styles.section}`}>
        <div className={styles.sectionHeading}>
          <p className="eyebrow">IELTS PRACTICE</p>
          <h2>
            {vi
              ? "Thiết kế theo trải nghiệm thi máy, không phải quiz đổi tên"
              : "Designed around the computer-test experience, not a renamed quiz"}
          </h2>
        </div>

        <div className={styles.ieltsGrid}>
          {[
            [Headphones, "Listening", "4 sections · 40 questions · section audio"],
            [BookOpenCheck, "Reading", "3 passages · 40 questions · split view"],
            [PenLine, "Writing", "Task 1 + Task 2 · timer · word count"],
            [Mic2, "Speaking", "Part 1–3 · preparation · recording"],
          ].map(([Icon, title, text]) => (
            <article key={title} className="card">
              <Icon size={27} />
              <h3>IELTS {title}</h3>
              <p>{text}</p>
              <Link href={`/ielts/${title.toLowerCase()}/demo`}>
                {vi ? "Xem giao diện mẫu" : "Open exam demo"} <ArrowRight size={16} />
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section id="outcomes" className={`container ${styles.outcomes}`}>
        <div className={styles.outcomeCopy}>
          <p className="eyebrow">{vi ? "LỘ TRÌNH ĐẦU RA" : "OUTCOME PATHWAY"}</p>
          <h2>
            {vi
              ? "10 stage, 100 level, một đích đến rõ ràng"
              : "10 stages, 100 levels and one visible destination"}
          </h2>
          <p>
            {vi
              ? "Từ ngôn ngữ nền tảng đến giao tiếp độc lập, kỹ năng học thuật và hiệu suất IELTS band cao."
              : "From foundational language to independent communication, academic skills and high-band IELTS performance."}
          </p>
        </div>

        <div className={styles.stageList}>
          {[
            ["01", "Pre-A1", vi ? "Starter Foundations" : "Starter Foundations"],
            ["02", "A1", vi ? "Essential English" : "Essential English"],
            ["03", "A2", vi ? "Everyday Communication" : "Everyday Communication"],
            ["04", "B1", vi ? "Independent English" : "Independent English"],
            ["05", "B1+", vi ? "IELTS Core Skills" : "IELTS Core Skills"],
            ["06", "B2", vi ? "Academic Development" : "Academic Development"],
            ["07", "B2+", vi ? "Confident IELTS User" : "Confident IELTS User"],
            ["08", "C1", vi ? "Advanced IELTS Skills" : "Advanced IELTS Skills"],
            ["09", "C1+", vi ? "Band 7.5 Performance" : "Band 7.5 Performance"],
            ["10", "IELTS 8.0", vi ? "Road to Band 8" : "Road to Band 8"],
          ].map(([stage, level, title]) => (
            <article key={stage}>
              <span>{stage}</span>
              <strong>{level}</strong>
              <small>{title}</small>
            </article>
          ))}
        </div>
      </section>

      <section className={`container ${styles.featureSection}`}>
        <div className={styles.sectionHeading}>
          <p className="eyebrow">{vi ? "NEXORA LMS" : "NEXORA LMS"}</p>
          <h2>
            {vi
              ? "Một nền tảng cho học viên, giáo viên và đội ngũ học thuật"
              : "One platform for learners, teachers and academic teams"}
          </h2>
        </div>

        <div className={styles.features}>
          {featureCards.map(({ icon: Icon, title, text }) => (
            <article className="card" key={title}>
              <span><Icon size={23} /></span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={`container ${styles.analytics}`}>
        <div className={styles.analyticsVisual}>
          <div className={styles.analyticsTitle}>
            <BarChart3 size={22} />
            <span>{vi ? "Skill analytics" : "Skill analytics"}</span>
          </div>
          {[
            ["Grammar", 76],
            ["Vocabulary", 84],
            ["Reading", 68],
            ["Listening", 59],
            ["Speaking", 64],
            ["Writing", 71],
          ].map(([skill, value]) => (
            <div className={styles.analyticsRow} key={skill}>
              <span>{skill}</span>
              <div><i style={{ width: `${value}%` }} /></div>
              <strong>{value}%</strong>
            </div>
          ))}
        </div>

        <div className={styles.analyticsCopy}>
          <p className="eyebrow">{vi ? "DỮ LIỆU TIẾN ĐỘ" : "PROGRESS DATA"}</p>
          <h2>
            {vi
              ? "Biết học viên yếu ở đâu, không chỉ biết đã hoàn thành bài"
              : "Know where a learner struggles, not only whether a lesson was completed"}
          </h2>
          <ul>
            <li><CheckCircle2 size={18} /> {vi ? "Điểm theo skill và question type" : "Performance by skill and question type"}</li>
            <li><CheckCircle2 size={18} /> {vi ? "Attempt history và review queue" : "Attempt history and review queue"}</li>
            <li><CheckCircle2 size={18} /> {vi ? "Recommended lesson và starting level" : "Recommended lessons and starting level"}</li>
            <li><CheckCircle2 size={18} /> {vi ? "XP, streak, quest và achievement" : "XP, streaks, quests and achievements"}</li>
          </ul>
        </div>
      </section>

      <section className={`container ${styles.finalCta}`}>
        <NoriMascot size={130} mood="celebrate" />
        <div>
          <p className="eyebrow">{vi ? "BẮT ĐẦU ĐÚNG CHỖ" : "START IN THE RIGHT PLACE"}</p>
          <h2>
            {vi
              ? "Làm Placement Test trước khi chọn bài học"
              : "Take the placement test before choosing a lesson"}
          </h2>
          <p>
            {vi
              ? "Nexora sẽ đề xuất level, CEFR, IELTS range và kỹ năng ưu tiên."
              : "Nexora will recommend your level, CEFR, IELTS range and priority skill."}
          </p>
        </div>
        <Link href="/placement" className="primary">
          {vi ? "Bắt đầu Placement Test" : "Start placement test"}
          <ArrowRight size={18} />
        </Link>
      </section>

      <footer className={styles.footer}>
        <div className="container">
          <div className={styles.footerBrand}>
            <span className={styles.brandMark}>N</span>
            <div>
              <strong>NEXORA</strong>
              <small>Road to IELTS 8.0</small>
            </div>
          </div>
          <p>
            {vi
              ? "Bilingual, gamified and measurable English learning."
              : "Bilingual, gamified and measurable English learning."}
          </p>
          <Link href="/auth">{vi ? "Đăng nhập" : "Sign in"} →</Link>
        </div>
      </footer>
    </main>
  );
}
