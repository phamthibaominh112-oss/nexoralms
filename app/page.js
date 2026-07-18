"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import {
  ArrowRight,
  BarChart3,
  BookOpen,
  BrainCircuit,
  Check,
  ChevronRight,
  Clock3,
  Flame,
  Headphones,
  LayoutDashboard,
  LockKeyhole,
  Menu,
  MessageSquareText,
  Mic2,
  Play,
  Rocket,
  Sparkles,
  Star,
  Target,
  Trophy,
  X,
} from "@/components/Icons";

import { stages, weeklyPlan } from "@/lib/levels";

const features = [
  {
    icon: BrainCircuit,
    title: "AI learning coach",
    text: "Personalized explanations, practice and feedback based on your mistakes.",
  },
  {
    icon: Mic2,
    title: "Speaking simulator",
    text: "Practice Parts 1–3, record answers and review fluency, grammar and pronunciation.",
  },
  {
    icon: BookOpen,
    title: "100-level roadmap",
    text: "A clear journey from first words to advanced IELTS test performance.",
  },
  {
    icon: BarChart3,
    title: "Smart analytics",
    text: "See your band estimate, skill gaps, study time and improvement trend.",
  },
];

const skills = [
  ["Vocabulary", 72],
  ["Grammar", 61],
  ["Listening", 56],
  ["Reading", 68],
  ["Writing", 48],
  ["Speaking", 54],
];

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  const [checked, setChecked] = useState([
    true,
    true,
    false,
    false,
    false,
  ]);

  function toggleTask(index) {
    setChecked((items) =>
      items.map((value, itemIndex) =>
        itemIndex === index ? !value : value
      )
    );
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <main>
      <header className="nav">
        <a className="brand" href="#top">
          <span className="brandMark">
            <Image
              src="/nexora-brand.jpeg"
              alt="Nexora"
              fill
              sizes="44px"
            />
          </span>

          <span>
            <strong>NEXORA</strong>
            <small>Road to IELTS 8.0</small>
          </span>
        </a>

        <nav className={menuOpen ? "navLinks open" : "navLinks"}>
          <a href="#roadmap" onClick={closeMenu}>
            Roadmap
          </a>

          <a href="#features" onClick={closeMenu}>
            Features
          </a>

          <a href="#dashboard" onClick={closeMenu}>
            Dashboard
          </a>

          <a href="#pricing" onClick={closeMenu}>
            Pricing
          </a>

          <Link
            href="/auth"
            className="ghostButton"
            onClick={closeMenu}
          >
            Sign in
          </Link>

          <Link
            href="/auth"
            className="primaryButton small"
            onClick={closeMenu}
          >
            Create account
          </Link>
        </nav>

        <button
          className="menuButton"
          onClick={() => setMenuOpen((current) => !current)}
          aria-label="Toggle menu"
          type="button"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      <section className="hero" id="top">
        <div className="orb orbOne" />
        <div className="orb orbTwo" />

        <div className="heroCopy">
          <div className="eyebrow">
            <Sparkles size={16} />
            Built for learners starting from zero
          </div>

          <h1>
            Your complete road to <span>IELTS 8.0</span>
          </h1>

          <p>
            Build English step by step through 100 guided levels,
            adaptive practice, AI feedback and measurable progress.
          </p>

          <div className="heroActions">
            <Link href="/auth" className="primaryButton">
              Start from Level 1
              <ArrowRight size={18} />
            </Link>

            <a className="videoButton" href="#roadmap">
              <span>
                <Play size={17} fill="currentColor" />
              </span>
              Explore the roadmap
            </a>
          </div>

          <div className="trustRow">
            <span>
              <Check size={16} />
              No credit card
            </span>

            <span>
              <Check size={16} />
              Free starter levels
            </span>

            <span>
              <Check size={16} />
              Learn at your pace
            </span>
          </div>
        </div>

        <div className="heroVisual">
          <div className="dashboardPreview">
            <div className="previewTop">
              <div>
                <small>Estimated level</small>
                <strong>IELTS 4.5</strong>
              </div>

              <span className="streak">
                <Flame size={16} />
                12 days
              </span>
            </div>

            <div className="progressRing">
              <div>
                <b>28</b>
                <span>Current level</span>
              </div>
            </div>

            <div className="previewLesson">
              <div className="lessonIcon">
                <Headphones size={20} />
              </div>

              <div>
                <small>Continue learning</small>
                <b>Past experiences</b>
                <span>18 min remaining</span>
              </div>

              <Link href="/auth" aria-label="Continue learning">
                <ChevronRight size={20} />
              </Link>
            </div>

            <div className="miniBars">
              {skills.slice(0, 4).map(([name, value]) => (
                <div key={name}>
                  <span>{name}</span>

                  <div>
                    <i style={{ width: `${value}%` }} />
                  </div>

                  <b>{value}%</b>
                </div>
              ))}
            </div>
          </div>

          <div className="floatingCard achievement">
            <Trophy size={22} />

            <span>
              <b>Level up!</b>
              <small>Foundation Explorer</small>
            </span>
          </div>

          <div className="floatingCard aiCard">
            <BrainCircuit size={22} />

            <span>
              <b>Nexora AI</b>
              <small>Your fluency improved</small>
            </span>
          </div>
        </div>
      </section>

      <section className="stats">
        <div>
          <b>100</b>
          <span>Progressive levels</span>
        </div>

        <div>
          <b>7</b>
          <span>Core skill labs</span>
        </div>

        <div>
          <b>8.0+</b>
          <span>Target band</span>
        </div>

        <div>
          <b>24/7</b>
          <span>AI study support</span>
        </div>
      </section>

      <section className="section" id="roadmap">
        <div className="sectionHeading">
          <div className="eyebrow">
            <Rocket size={16} />
            The complete journey
          </div>

          <h2>From your first English sentence to Band 8</h2>

          <p>
            Every stage has a clear target, practical outcomes and a
            checkpoint before you move forward.
          </p>
        </div>

        <div className="roadmapGrid">
          {stages.map((stage, index) => (
            <article className="stageCard" key={stage.id}>
              <div
                className="stageNumber"
                style={{ background: stage.gradient }}
              >
                {String(index + 1).padStart(2, "0")}
              </div>

              <div className="stageMeta">
                <span>{stage.range}</span>
                <b>{stage.target}</b>
              </div>

              <h3>{stage.name}</h3>

              <p>{stage.description}</p>

              <div className="stageFooter">
                <span>
                  {index < 2 ? (
                    <>
                      <Check size={15} />
                      Available
                    </>
                  ) : (
                    <>
                      <LockKeyhole size={14} />
                      Unlock by progress
                    </>
                  )}
                </span>

                <ChevronRight size={18} />
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section tinted" id="features">
        <div className="sectionHeading">
          <div className="eyebrow">
            <Sparkles size={16} />
            More than video lessons
          </div>

          <h2>A learning system that adapts to you</h2>

          <p>
            Study, practise, receive feedback, review mistakes and
            continuously improve.
          </p>
        </div>

        <div className="featureGrid">
          {features.map(({ icon: Icon, title, text }) => (
            <article className="featureCard" key={title}>
              <span className="featureIcon">
                <Icon size={25} />
              </span>

              <h3>{title}</h3>

              <p>{text}</p>

              <Link href="/auth">
                Discover feature
                <ArrowRight size={15} />
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section
        className="section dashboardSection"
        id="dashboard"
      >
        <div className="dashboardCopy">
          <div className="eyebrow">
            <LayoutDashboard size={16} />
            Your learning command centre
          </div>

          <h2>Know exactly what to study today</h2>

          <p>
            Nexora turns your target band, available time and skill
            gaps into a practical daily plan.
          </p>

          <ul>
            <li>
              <Check size={18} />
              Personalized daily missions
            </li>

            <li>
              <Check size={18} />
              Skill-level progress tracking
            </li>

            <li>
              <Check size={18} />
              Smart review based on recurring errors
            </li>

            <li>
              <Check size={18} />
              Weekly checkpoints and band estimates
            </li>
          </ul>

          <Link href="/auth" className="primaryButton">
            Open learner dashboard
            <ArrowRight size={18} />
          </Link>
        </div>

        <div className="appShell">
          <aside>
            <div className="miniBrand">
              <Image
                src="/nexora-brand.jpeg"
                alt="Nexora"
                fill
                sizes="36px"
              />
            </div>

            {[
              LayoutDashboard,
              Target,
              BookOpen,
              MessageSquareText,
              Trophy,
            ].map((Icon, index) => (
              <span
                className={index === 0 ? "active" : ""}
                key={index}
              >
                <Icon size={19} />
              </span>
            ))}
          </aside>

          <div className="appContent">
            <div className="appHeader">
              <div>
                <small>Good evening, learner</small>
                <h3>Today&apos;s learning plan</h3>
              </div>

              <div className="avatar">N</div>
            </div>

            <div className="overviewCards">
              <div>
                <span>
                  <Flame size={17} />
                </span>

                <b>12</b>
                <small>Day streak</small>
              </div>

              <div>
                <span>
                  <Clock3 size={17} />
                </span>

                <b>4.5h</b>
                <small>This week</small>
              </div>

              <div>
                <span>
                  <Star size={17} />
                </span>

                <b>1,840</b>
                <small>Total XP</small>
              </div>
            </div>

            <div className="todayCard">
              <div className="todayTop">
                <div>
                  <small>LEVEL 28</small>
                  <h4>Talking about past experiences</h4>
                </div>

                <b>65%</b>
              </div>

              <div className="largeProgress">
                <i style={{ width: "65%" }} />
              </div>

              <div className="tasks">
                {[
                  "Review 12 words",
                  "Grammar: present perfect",
                  "Listening practice",
                  "Speaking mission",
                  "Lesson checkpoint",
                ].map((task, index) => (
                  <button
                    key={task}
                    type="button"
                    onClick={() => toggleTask(index)}
                    className={checked[index] ? "done" : ""}
                  >
                    <span>
                      {checked[index] && <Check size={14} />}
                    </span>

                    {task}

                    <small>
                      {[5, 12, 10, 8, 6][index]} min
                    </small>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="sectionHeading">
          <div className="eyebrow">
            <Target size={16} />
            A plan that remains realistic
          </div>

          <h2>Your week, automatically organized</h2>
        </div>

        <div className="weekGrid">
          {weeklyPlan.map((item, index) => (
            <article
              key={item.day}
              className={item.done ? "complete" : ""}
            >
              <span>{item.day}</span>

              <h3>{item.task}</h3>

              <div>
                {item.done ? (
                  <>
                    <Check size={16} />
                    Complete
                  </>
                ) : index === 2 ? (
                  <>
                    <Play size={15} />
                    Today
                  </>
                ) : (
                  "Upcoming"
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section
        className="section pricingSection"
        id="pricing"
      >
        <div className="pricingCopy">
          <div className="eyebrow">
            <Star size={16} />
            Start without pressure
          </div>

          <h2>Begin free. Upgrade when you are ready.</h2>

          <p>
            Access the starter roadmap, placement diagnostic and daily
            learning plan before choosing a membership.
          </p>
        </div>

        <div className="priceCard">
          <div className="popular">MOST POPULAR</div>

          <small>NEXORA PRO</small>

          <h3>
            $12 <span>/ month</span>
          </h3>

          <ul>
            <li>
              <Check size={17} />
              Full 100-level roadmap
            </li>

            <li>
              <Check size={17} />
              AI writing and speaking feedback
            </li>

            <li>
              <Check size={17} />
              IELTS mock tests
            </li>

            <li>
              <Check size={17} />
              Personalized study plan
            </li>
          </ul>

          <Link href="/auth" className="primaryButton">
            Start 7-day trial
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <section className="finalCta">
        <div className="ctaLogo">
          <Image
            src="/nexora-brand.jpeg"
            alt="Nexora"
            fill
            sizes="90px"
          />
        </div>

        <h2>Your Band 8 journey starts with Level 1.</h2>

        <p>
          Build the habit. Master the skills. Reach the score.
        </p>

        <Link href="/auth" className="lightButton">
          Start learning free
          <ArrowRight size={18} />
        </Link>
      </section>

      <footer>
        <div className="footerBrand">
          <span className="brandMark">
            <Image
              src="/nexora-brand.jpeg"
              alt="Nexora"
              fill
              sizes="42px"
            />
          </span>

          <div>
            <b>NEXORA</b>
            <small>Learn beyond limits.</small>
          </div>
        </div>

        <p>© 2026 Nexora Learning. Road to IELTS 8.0.</p>

        <div>
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#">Support</a>
        </div>
      </footer>
    </main>
  );
}