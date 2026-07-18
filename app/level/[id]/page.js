"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  useParams,
  useRouter,
} from "next/navigation";
import Link from "next/link";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL;

const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(
        supabaseUrl,
        supabaseAnonKey
      )
    : null;

const lessonSections = [
  {
    id: "overview",
    label: "Overview",
    icon: "✦",
  },
  {
    id: "vocabulary",
    label: "Vocabulary",
    icon: "Aa",
  },
  {
    id: "grammar",
    label: "Grammar",
    icon: "G",
  },
  {
    id: "listening",
    label: "Listening",
    icon: "L",
  },
  {
    id: "speaking",
    label: "Speaking",
    icon: "S",
  },
  {
    id: "quiz",
    label: "Checkpoint",
    icon: "✓",
  },
];

const stageData = [
  {
    start: 1,
    end: 10,
    name: "Starter Foundations",
    cefr: "Pre-A1",
  },
  {
    start: 11,
    end: 20,
    name: "Essential English",
    cefr: "A1",
  },
  {
    start: 21,
    end: 30,
    name: "Everyday Communication",
    cefr: "A2",
  },
  {
    start: 31,
    end: 40,
    name: "Independent English",
    cefr: "B1",
  },
  {
    start: 41,
    end: 50,
    name: "IELTS Core Skills",
    cefr: "B1+",
  },
  {
    start: 51,
    end: 60,
    name: "Academic Development",
    cefr: "B2",
  },
  {
    start: 61,
    end: 70,
    name: "Confident IELTS User",
    cefr: "B2+",
  },
  {
    start: 71,
    end: 80,
    name: "Advanced IELTS Skills",
    cefr: "C1",
  },
  {
    start: 81,
    end: 90,
    name: "Band 7.5 Performance",
    cefr: "C1+",
  },
  {
    start: 91,
    end: 100,
    name: "Road to Band 8",
    cefr: "Advanced",
  },
];

const beginnerLessons = [
  {
    title: "Introducing yourself",
    objective:
      "Introduce yourself and share basic personal information.",
    vocabulary: [
      ["name", "the word people use to identify you"],
      ["country", "the nation where you live or were born"],
      ["city", "a large town where people live and work"],
      ["student", "a person who studies"],
      ["teacher", "a person who helps others learn"],
      ["live", "to have your home in a place"],
    ],
    grammarTitle: "Using “I am” and “My name is”",
    grammarExplanation:
      "Use “I am” before an adjective, nationality or occupation. Use “My name is” when giving your name.",
    examples: [
      "My name is Alex.",
      "I am Vietnamese.",
      "I am a student.",
      "I live in Ho Chi Minh City.",
    ],
    listeningText:
      "Hello. My name is Anna. I am from Australia, but I live in Singapore. I am a teacher.",
    speakingPrompt:
      "Introduce yourself. Say your name, country, city and occupation.",
    question:
      "Which sentence correctly introduces your name?",
    answers: [
      "I name Anna.",
      "My name is Anna.",
      "Me is Anna.",
      "I from Anna.",
    ],
    correctAnswer: 1,
  },
  {
    title: "Numbers and personal information",
    objective:
      "Understand and share numbers, ages and contact information.",
    vocabulary: [
      ["number", "a symbol or word used for counting"],
      ["age", "the number of years a person has lived"],
      ["phone", "a device used to call someone"],
      ["address", "the details of where someone lives"],
      ["email", "a digital message address"],
      ["postcode", "a code used to identify an area"],
    ],
    grammarTitle: "Questions with “What” and “How old”",
    grammarExplanation:
      "Use “What is” to ask for information and “How old are you?” to ask someone’s age.",
    examples: [
      "What is your phone number?",
      "What is your email address?",
      "How old are you?",
      "I am twenty years old.",
    ],
    listeningText:
      "My name is David. I am twenty-five years old. My phone number is zero nine one two, four five six, seven eight nine.",
    speakingPrompt:
      "Say your age and practise giving a fictional phone number.",
    question:
      "Which question asks about age?",
    answers: [
      "What is your city?",
      "How old are you?",
      "Where old are you?",
      "What number age?",
    ],
    correctAnswer: 1,
  },
  {
    title: "Family and relationships",
    objective:
      "Talk about close family members and relationships.",
    vocabulary: [
      ["mother", "a female parent"],
      ["father", "a male parent"],
      ["sister", "a female sibling"],
      ["brother", "a male sibling"],
      ["parents", "a mother and father"],
      ["family", "a group of related people"],
    ],
    grammarTitle: "Using “have” and “has”",
    grammarExplanation:
      "Use “have” with I, you, we and they. Use “has” with he, she and it.",
    examples: [
      "I have one sister.",
      "She has two brothers.",
      "We have a small family.",
      "My father has a new job.",
    ],
    listeningText:
      "I have a small family. I have one brother. My brother is eighteen years old. My parents live in Hanoi.",
    speakingPrompt:
      "Describe your family using three or four short sentences.",
    question:
      "Choose the grammatically correct sentence.",
    answers: [
      "She have one brother.",
      "She has one brother.",
      "She having one brother.",
      "She is have one brother.",
    ],
    correctAnswer: 1,
  },
];

const skillCycles = [
  {
    title: "Vocabulary development",
    objective:
      "Expand your vocabulary and use new words accurately in context.",
    grammarTitle: "Building accurate sentences",
    grammarExplanation:
      "Combine clear subjects, suitable verbs and relevant details to communicate complete ideas.",
    speakingPrompt:
      "Use the target vocabulary to speak for one minute about a familiar topic.",
    question:
      "Which strategy is most effective for remembering vocabulary?",
    answers: [
      "Read each word once only.",
      "Memorize translations without context.",
      "Use new words in meaningful sentences.",
      "Avoid reviewing difficult words.",
    ],
    correctAnswer: 2,
  },
  {
    title: "Grammar accuracy",
    objective:
      "Improve grammatical control when communicating more complex ideas.",
    grammarTitle: "Controlling sentence structure",
    grammarExplanation:
      "Check subject–verb agreement, verb tense and sentence boundaries before finalizing an answer.",
    speakingPrompt:
      "Describe a past experience while carefully controlling your verb tenses.",
    question:
      "What should you check when editing a sentence?",
    answers: [
      "Only the number of words.",
      "Subject–verb agreement and verb tense.",
      "Only punctuation colour.",
      "The font used in the sentence.",
    ],
    correctAnswer: 1,
  },
  {
    title: "Listening comprehension",
    objective:
      "Identify main ideas, details and speaker intention in spoken English.",
    grammarTitle: "Using context to understand meaning",
    grammarExplanation:
      "Listen for key nouns, verbs, numbers and linking expressions rather than trying to translate every word.",
    speakingPrompt:
      "Summarize the main message of a short conversation in your own words.",
    question:
      "What should you listen for first?",
    answers: [
      "Every individual sound.",
      "The main idea and key details.",
      "Only unfamiliar words.",
      "The speaker’s accent name.",
    ],
    correctAnswer: 1,
  },
  {
    title: "Reading strategies",
    objective:
      "Locate information efficiently and understand relationships between ideas.",
    grammarTitle: "Recognizing cohesion",
    grammarExplanation:
      "Pronouns, linking words and repeated concepts help connect ideas across a text.",
    speakingPrompt:
      "Explain the main point of something you recently read.",
    question:
      "Which technique helps locate a specific name or date?",
    answers: [
      "Scanning",
      "Guessing",
      "Translating everything",
      "Reading backwards",
    ],
    correctAnswer: 0,
  },
  {
    title: "Speaking fluency",
    objective:
      "Speak more smoothly while developing and connecting ideas.",
    grammarTitle: "Extending spoken answers",
    grammarExplanation:
      "Build longer answers by giving a direct response, a reason and a relevant example.",
    speakingPrompt:
      "Answer a familiar IELTS-style question for one to two minutes.",
    question:
      "Which structure develops a speaking answer?",
    answers: [
      "Answer only",
      "Answer, reason and example",
      "Example only",
      "Repeat the question",
    ],
    correctAnswer: 1,
  },
  {
    title: "Writing development",
    objective:
      "Organize ideas clearly and develop paragraphs with relevant support.",
    grammarTitle: "Building a clear paragraph",
    grammarExplanation:
      "An effective paragraph commonly contains a central idea, explanation and supporting example.",
    speakingPrompt:
      "Explain how you would organize a paragraph about education.",
    question:
      "What belongs in a developed paragraph?",
    answers: [
      "Several unrelated ideas",
      "A central idea with support",
      "Only one short phrase",
      "A list without explanation",
    ],
    correctAnswer: 1,
  },
  {
    title: "Pronunciation practice",
    objective:
      "Improve clarity through word stress, sentence stress and natural rhythm.",
    grammarTitle: "Using sentence stress",
    grammarExplanation:
      "Content words such as nouns, main verbs and adjectives usually receive stronger stress.",
    speakingPrompt:
      "Record yourself saying five sentences with clear stress on important words.",
    question:
      "Which words commonly receive stronger sentence stress?",
    answers: [
      "Content words",
      "Every word equally",
      "Only articles",
      "Only prepositions",
    ],
    correctAnswer: 0,
  },
  {
    title: "IELTS skill integration",
    objective:
      "Combine language knowledge and test skills in realistic IELTS tasks.",
    grammarTitle: "Connecting evidence and explanation",
    grammarExplanation:
      "Use logical connectors to show contrast, cause, effect and examples.",
    speakingPrompt:
      "Give an opinion, explain your reason and support it with an example.",
    question:
      "Which connector introduces contrast?",
    answers: [
      "For example",
      "Therefore",
      "However",
      "Because",
    ],
    correctAnswer: 2,
  },
  {
    title: "Exam strategy",
    objective:
      "Manage time, interpret instructions and avoid common test mistakes.",
    grammarTitle: "Following task instructions",
    grammarExplanation:
      "Identify the required task, word limit and response format before answering.",
    speakingPrompt:
      "Explain one strategy you use to manage your time during an exam.",
    question:
      "What should you do before answering?",
    answers: [
      "Ignore the instructions.",
      "Identify the task and requirements.",
      "Write immediately without planning.",
      "Choose the longest answer.",
    ],
    correctAnswer: 1,
  },
  {
    title: "Stage checkpoint",
    objective:
      "Review the stage and demonstrate integrated language performance.",
    grammarTitle: "Reviewing your accuracy",
    grammarExplanation:
      "Review frequent errors and apply corrections before progressing to more difficult content.",
    speakingPrompt:
      "Reflect on what you learned during this stage and describe your strongest improvement.",
    question:
      "What is the purpose of a checkpoint?",
    answers: [
      "To skip previous learning",
      "To review progress and identify gaps",
      "To reduce practice",
      "To lock every lesson",
    ],
    correctAnswer: 1,
  },
];

function getStage(level) {
  return (
    stageData.find(
      (stage) =>
        level >= stage.start &&
        level <= stage.end
    ) || stageData[0]
  );
}

function getLesson(level) {
  if (level <= beginnerLessons.length) {
    return beginnerLessons[level - 1];
  }

  const cycle =
    skillCycles[(level - 1) % skillCycles.length];

  const stage = getStage(level);

  return {
    ...cycle,
    vocabulary: [
      [
        "analyse",
        "to examine something carefully",
      ],
      [
        "develop",
        "to grow or improve over time",
      ],
      [
        "evidence",
        "information supporting an idea",
      ],
      [
        "relevant",
        "closely connected to the topic",
      ],
      [
        "accurate",
        "correct and free from errors",
      ],
      [
        "effective",
        "successful in producing a result",
      ],
    ],
    examples: [
      `This lesson develops ${cycle.title.toLowerCase()}.`,
      "Clear evidence supports a strong argument.",
      "Relevant examples make an answer more effective.",
      "Accurate language improves communication.",
    ],
    listeningText:
      `Welcome to Level ${level} of ${stage.name}. ` +
      `This lesson focuses on ${cycle.title.toLowerCase()}. ` +
      "Listen for the main idea, supporting details and important vocabulary.",
  };
}

export default function LevelPage() {
  const params = useParams();
  const router = useRouter();

  const levelId = Number(params?.id);
  const validLevel =
    Number.isInteger(levelId) &&
    levelId >= 1 &&
    levelId <= 100;

  const lesson = useMemo(
    () =>
      validLevel
        ? getLesson(levelId)
        : null,
    [levelId, validLevel]
  );

  const stage = useMemo(
    () =>
      validLevel
        ? getStage(levelId)
        : null,
    [levelId, validLevel]
  );

  const xpReward =
    80 + ((levelId - 1) % 5) * 10;

  const [loading, setLoading] =
    useState(true);
  const [saving, setSaving] =
    useState(false);

  const [user, setUser] = useState(null);
  const [profile, setProfile] =
    useState(null);

  const [activeSection, setActiveSection] =
    useState("overview");

  const [visitedSections, setVisitedSections] =
    useState(["overview"]);

  const [selectedAnswer, setSelectedAnswer] =
    useState(null);

  const [quizChecked, setQuizChecked] =
    useState(false);

  const [alreadyCompleted, setAlreadyCompleted] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [errorMessage, setErrorMessage] =
    useState("");

  useEffect(() => {
    loadLesson();
  }, [levelId]);

  async function loadLesson() {
    if (!validLevel) {
      setErrorMessage(
        "This level does not exist."
      );
      setLoading(false);
      return;
    }

    if (!supabase) {
      setErrorMessage(
        "Supabase environment variables are missing."
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

      const currentLesson = Number(
        profileData.current_lesson || 1
      );

      if (levelId > currentLesson) {
        router.replace("/roadmap");
        return;
      }

      setProfile(profileData);

      const {
        data: progressData,
        error: progressError,
      } = await supabase
        .from("user_progress")
        .select("*")
        .eq("user_id", session.user.id)
        .eq("level_id", levelId)
        .maybeSingle();

      if (progressError) {
        throw progressError;
      }

      setAlreadyCompleted(
        Boolean(progressData?.completed)
      );
    } catch (error) {
      setErrorMessage(
        error?.message ||
          "The lesson could not be loaded."
      );
    } finally {
      setLoading(false);
    }
  }

  function changeSection(sectionId) {
    setActiveSection(sectionId);

    setVisitedSections((current) =>
      current.includes(sectionId)
        ? current
        : [...current, sectionId]
    );
  }

  function goToNextSection() {
    const currentIndex =
      lessonSections.findIndex(
        (section) =>
          section.id === activeSection
      );

    if (
      currentIndex <
      lessonSections.length - 1
    ) {
      changeSection(
        lessonSections[currentIndex + 1].id
      );
    }
  }

  function checkQuiz() {
    if (selectedAnswer === null) {
      setMessage(
        "Please select an answer first."
      );
      return;
    }

    setQuizChecked(true);

    if (
      selectedAnswer ===
      lesson.correctAnswer
    ) {
      setMessage(
        "Correct. You are ready to complete this level."
      );
    } else {
      setMessage(
        "Not quite. Review the lesson and try again."
      );
    }
  }

  async function completeLevel() {
    if (
      selectedAnswer !== lesson.correctAnswer
    ) {
      setMessage(
        "Complete the checkpoint correctly before finishing the level."
      );
      setActiveSection("quiz");
      return;
    }

    if (!supabase || !user || !profile) {
      setMessage(
        "Your session could not be found."
      );
      return;
    }

    if (alreadyCompleted) {
      if (levelId < 100) {
        router.push(`/level/${levelId + 1}`);
      } else {
        router.push("/roadmap");
      }

      return;
    }

    setSaving(true);
    setMessage("");

    try {
      const completedAt =
        new Date().toISOString();

      const {
        error: progressError,
      } = await supabase
        .from("user_progress")
        .upsert(
          {
            user_id: user.id,
            level_id: levelId,
            completed: true,
            earned_xp: xpReward,
            completed_at: completedAt,
            updated_at: completedAt,
          },
          {
            onConflict: "user_id,level_id",
          }
        );

      if (progressError) {
        throw progressError;
      }

      const oldCurrentLesson = Number(
        profile.current_lesson || 1
      );

      const newCurrentLesson =
        levelId >= oldCurrentLesson
          ? Math.min(levelId + 1, 100)
          : oldCurrentLesson;

      const oldXp = Number(
        profile.total_xp || 0
      );

      const {
        error: profileError,
      } = await supabase
        .from("profiles")
        .update({
          current_lesson:
            newCurrentLesson,
          total_xp: oldXp + xpReward,
          updated_at: completedAt,
        })
        .eq("id", user.id);

      if (profileError) {
        throw profileError;
      }

      setAlreadyCompleted(true);

      setProfile((current) => ({
        ...current,
        current_lesson:
          newCurrentLesson,
        total_xp: oldXp + xpReward,
      }));

      setMessage(
        `Level completed! You earned ${xpReward} XP.`
      );
    } catch (error) {
      setMessage(
        error?.message ||
          "Progress could not be saved."
      );
    } finally {
      setSaving(false);
    }
  }

  function openNextLevel() {
    if (levelId >= 100) {
      router.push("/roadmap");
      return;
    }

    router.push(`/level/${levelId + 1}`);
  }

  if (loading) {
    return (
      <main style={styles.loadingPage}>
        <div style={styles.spinner} />

        <p style={styles.loadingText}>
          Preparing Level {levelId}...
        </p>
      </main>
    );
  }

  if (errorMessage || !lesson || !stage) {
    return (
      <main style={styles.loadingPage}>
        <section style={styles.errorCard}>
          <h1 style={styles.errorTitle}>
            Lesson unavailable
          </h1>

          <p style={styles.errorText}>
            {errorMessage ||
              "This lesson could not be found."}
          </p>

          <Link
            href="/roadmap"
            style={styles.primaryLink}
          >
            Return to roadmap
          </Link>
        </section>
      </main>
    );
  }

  const sectionProgress = Math.round(
    (visitedSections.length /
      lessonSections.length) *
      100
  );

  const quizCorrect =
    quizChecked &&
    selectedAnswer === lesson.correctAnswer;

  const learnerName =
    profile?.full_name ||
    user?.email?.split("@")[0] ||
    "Learner";

  return (
    <main style={styles.page}>
      <aside style={styles.sidebar}>
        <Link href="/" style={styles.brand}>
          <span style={styles.brandMark}>
            N
          </span>

          <span>
            <strong style={styles.brandName}>
              NEXORA
            </strong>

            <small
              style={styles.brandSubtitle}
            >
              Road to IELTS 8.0
            </small>
          </span>
        </Link>

        <Link
          href="/roadmap"
          style={styles.backLink}
        >
          ← Back to roadmap
        </Link>

        <div style={styles.lessonIdentity}>
          <p style={styles.sideEyebrow}>
            {stage.name}
          </p>

          <h2 style={styles.sideTitle}>
            Level {levelId}
          </h2>

          <p style={styles.sideLessonTitle}>
            {lesson.title}
          </p>
        </div>

        <nav style={styles.sectionNavigation}>
          {lessonSections.map(
            (section, index) => {
              const visited =
                visitedSections.includes(
                  section.id
                );

              return (
                <button
                  key={section.id}
                  type="button"
                  onClick={() =>
                    changeSection(section.id)
                  }
                  style={{
                    ...styles.sectionButton,
                    ...(activeSection ===
                    section.id
                      ? styles.activeSectionButton
                      : {}),
                  }}
                >
                  <span
                    style={{
                      ...styles.sectionIcon,
                      ...(visited
                        ? styles.visitedSectionIcon
                        : {}),
                    }}
                  >
                    {visited
                      ? "✓"
                      : section.icon}
                  </span>

                  <span>
                    <small
                      style={
                        styles.sectionNumber
                      }
                    >
                      STEP {index + 1}
                    </small>

                    <strong
                      style={
                        styles.sectionLabel
                      }
                    >
                      {section.label}
                    </strong>
                  </span>
                </button>
              );
            }
          )}
        </nav>

        <div style={styles.sidebarProgress}>
          <div
            style={styles.progressHeading}
          >
            <span>Lesson progress</span>
            <strong>
              {sectionProgress}%
            </strong>
          </div>

          <div style={styles.progressTrack}>
            <div
              style={{
                ...styles.progressValue,
                width: `${sectionProgress}%`,
              }}
            />
          </div>
        </div>

        <div style={styles.sidebarAccount}>
          <strong>{learnerName}</strong>

          <small>{user?.email}</small>
        </div>
      </aside>

      <section style={styles.content}>
        <header style={styles.header}>
          <div>
            <p style={styles.eyebrow}>
              LEVEL {levelId} · {stage.cefr}
            </p>

            <h1 style={styles.title}>
              {lesson.title}
            </h1>

            <p style={styles.subtitle}>
              {lesson.objective}
            </p>
          </div>

          <div style={styles.rewardCard}>
            <span style={styles.rewardLabel}>
              LEVEL REWARD
            </span>

            <strong style={styles.rewardValue}>
              +{xpReward} XP
            </strong>
          </div>
        </header>

        <section style={styles.lessonCard}>
          {activeSection ===
            "overview" && (
            <OverviewSection
              lesson={lesson}
              level={levelId}
              stage={stage}
              xpReward={xpReward}
            />
          )}

          {activeSection ===
            "vocabulary" && (
            <VocabularySection
              vocabulary={lesson.vocabulary}
            />
          )}

          {activeSection ===
            "grammar" && (
            <GrammarSection
              lesson={lesson}
            />
          )}

          {activeSection ===
            "listening" && (
            <ListeningSection
              text={lesson.listeningText}
            />
          )}

          {activeSection ===
            "speaking" && (
            <SpeakingSection
              prompt={lesson.speakingPrompt}
            />
          )}

          {activeSection === "quiz" && (
            <QuizSection
              lesson={lesson}
              selectedAnswer={
                selectedAnswer
              }
              setSelectedAnswer={
                setSelectedAnswer
              }
              quizChecked={quizChecked}
              quizCorrect={quizCorrect}
              checkQuiz={checkQuiz}
            />
          )}

          {message && (
            <div
              style={{
                ...styles.message,
                ...(quizCorrect ||
                alreadyCompleted
                  ? styles.successMessage
                  : {}),
              }}
            >
              {message}
            </div>
          )}

          <footer style={styles.lessonFooter}>
            <div>
              {activeSection !==
                "overview" && (
                <button
                  type="button"
                  onClick={() => {
                    const currentIndex =
                      lessonSections.findIndex(
                        (section) =>
                          section.id ===
                          activeSection
                      );

                    if (currentIndex > 0) {
                      changeSection(
                        lessonSections[
                          currentIndex - 1
                        ].id
                      );
                    }
                  }}
                  style={styles.secondaryButton}
                >
                  ← Previous
                </button>
              )}
            </div>

            <div>
              {activeSection !== "quiz" ? (
                <button
                  type="button"
                  onClick={goToNextSection}
                  style={styles.primaryButton}
                >
                  Continue →
                </button>
              ) : alreadyCompleted ? (
                <button
                  type="button"
                  onClick={openNextLevel}
                  style={styles.primaryButton}
                >
                  {levelId === 100
                    ? "Return to roadmap"
                    : `Open Level ${
                        levelId + 1
                      } →`}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={completeLevel}
                  disabled={saving}
                  style={{
                    ...styles.primaryButton,
                    opacity: saving
                      ? 0.65
                      : 1,
                  }}
                >
                  {saving
                    ? "Saving progress..."
                    : `Complete Level ${levelId}`}
                </button>
              )}
            </div>
          </footer>
        </section>
      </section>
    </main>
  );
}

function OverviewSection({
  lesson,
  level,
  stage,
  xpReward,
}) {
  return (
    <div>
      <SectionHeading
        label="LESSON OVERVIEW"
        title="What you will learn"
        text={lesson.objective}
      />

      <div style={styles.overviewGrid}>
        <InfoCard
          label="Level"
          value={`${level} of 100`}
        />

        <InfoCard
          label="Stage"
          value={stage.name}
        />

        <InfoCard
          label="Estimated time"
          value="25–30 minutes"
        />

        <InfoCard
          label="Reward"
          value={`${xpReward} XP`}
        />
      </div>

      <div style={styles.outcomeBox}>
        <h3 style={styles.outcomeTitle}>
          Learning outcomes
        </h3>

        <ul style={styles.outcomeList}>
          <li>
            Understand the lesson’s target
            vocabulary.
          </li>

          <li>
            Apply the target grammar in
            meaningful sentences.
          </li>

          <li>
            Identify key details in a short
            listening text.
          </li>

          <li>
            Respond to a practical speaking
            prompt.
          </li>
        </ul>
      </div>
    </div>
  );
}

function VocabularySection({
  vocabulary,
}) {
  return (
    <div>
      <SectionHeading
        label="VOCABULARY LAB"
        title="Build your word bank"
        text="Read each word and its meaning. Say the word aloud, then create your own sentence."
      />

      <div style={styles.vocabularyGrid}>
        {vocabulary.map(
          ([word, definition], index) => (
            <article
              key={word}
              style={styles.wordCard}
            >
              <span style={styles.wordNumber}>
                {String(index + 1).padStart(
                  2,
                  "0"
                )}
              </span>

              <h3 style={styles.wordTitle}>
                {word}
              </h3>

              <p style={styles.wordDefinition}>
                {definition}
              </p>

              <button
                type="button"
                onClick={() => {
                  if (
                    typeof window !==
                      "undefined" &&
                    "speechSynthesis" in window
                  ) {
                    window.speechSynthesis.cancel();

                    const utterance =
                      new SpeechSynthesisUtterance(
                        word
                      );

                    utterance.lang = "en-US";

                    window.speechSynthesis.speak(
                      utterance
                    );
                  }
                }}
                style={styles.listenButton}
              >
                Listen
              </button>
            </article>
          )
        )}
      </div>
    </div>
  );
}

function GrammarSection({ lesson }) {
  return (
    <div>
      <SectionHeading
        label="GRAMMAR LAB"
        title={lesson.grammarTitle}
        text={lesson.grammarExplanation}
      />

      <div style={styles.ruleBox}>
        <span style={styles.ruleLabel}>
          KEY RULE
        </span>

        <p style={styles.ruleText}>
          {lesson.grammarExplanation}
        </p>
      </div>

      <h3 style={styles.exampleHeading}>
        Examples
      </h3>

      <div style={styles.exampleList}>
        {lesson.examples.map(
          (example, index) => (
            <div
              key={example}
              style={styles.exampleItem}
            >
              <span>
                {index + 1}
              </span>

              <p>{example}</p>
            </div>
          )
        )}
      </div>
    </div>
  );
}

function ListeningSection({ text }) {
  const [playing, setPlaying] =
    useState(false);

  function playListening() {
    if (
      typeof window === "undefined" ||
      !("speechSynthesis" in window)
    ) {
      return;
    }

    window.speechSynthesis.cancel();

    const utterance =
      new SpeechSynthesisUtterance(text);

    utterance.lang = "en-US";
    utterance.rate = 0.9;

    utterance.onstart = () =>
      setPlaying(true);

    utterance.onend = () =>
      setPlaying(false);

    utterance.onerror = () =>
      setPlaying(false);

    window.speechSynthesis.speak(
      utterance
    );
  }

  function stopListening() {
    if (
      typeof window !== "undefined" &&
      "speechSynthesis" in window
    ) {
      window.speechSynthesis.cancel();
    }

    setPlaying(false);
  }

  return (
    <div>
      <SectionHeading
        label="LISTENING LAB"
        title="Listen for key information"
        text="Play the recording twice. First listen for the general meaning, then listen again for details."
      />

      <div style={styles.audioCard}>
        <div style={styles.audioIcon}>
          ♪
        </div>

        <div style={styles.audioContent}>
          <small
            style={styles.audioLabel}
          >
            NEXORA LISTENING
          </small>

          <h3 style={styles.audioTitle}>
            Level listening practice
          </h3>

          <p style={styles.audioHint}>
            Approximately 20 seconds
          </p>
        </div>

        <button
          type="button"
          onClick={
            playing
              ? stopListening
              : playListening
          }
          style={styles.audioButton}
        >
          {playing ? "Stop" : "Play audio"}
        </button>
      </div>

      <details style={styles.transcript}>
        <summary
          style={styles.transcriptSummary}
        >
          Show transcript
        </summary>

        <p style={styles.transcriptText}>
          {text}
        </p>
      </details>

      <div style={styles.listeningTip}>
        <strong>Listening strategy</strong>

        <p>
          Do not translate every word. Focus
          on names, numbers, places, actions
          and repeated ideas.
        </p>
      </div>
    </div>
  );
}

function SpeakingSection({ prompt }) {
  const [practiceText, setPracticeText] =
    useState("");

  return (
    <div>
      <SectionHeading
        label="SPEAKING LAB"
        title="Build your spoken response"
        text="Plan your answer, speak aloud and then reflect on your fluency and accuracy."
      />

      <div style={styles.promptCard}>
        <span style={styles.promptLabel}>
          YOUR SPEAKING MISSION
        </span>

        <h3 style={styles.promptText}>
          {prompt}
        </h3>
      </div>

      <label style={styles.noteField}>
        <span style={styles.noteLabel}>
          Plan your answer
        </span>

        <textarea
          value={practiceText}
          onChange={(event) =>
            setPracticeText(
              event.target.value
            )
          }
          placeholder="Write short notes or useful vocabulary here..."
          style={styles.textarea}
        />
      </label>

      <div style={styles.speakingChecklist}>
        <h3>Before continuing, check:</h3>

        <ul>
          <li>
            I answered the question directly.
          </li>

          <li>
            I added at least one detail.
          </li>

          <li>
            I spoke clearly and at a natural
            speed.
          </li>

          <li>
            I checked my grammar and
            vocabulary.
          </li>
        </ul>
      </div>
    </div>
  );
}

function QuizSection({
  lesson,
  selectedAnswer,
  setSelectedAnswer,
  quizChecked,
  quizCorrect,
  checkQuiz,
}) {
  return (
    <div>
      <SectionHeading
        label="LEVEL CHECKPOINT"
        title="Check your understanding"
        text="Choose the best answer. You must answer correctly before completing the level."
      />

      <div style={styles.questionCard}>
        <span style={styles.questionLabel}>
          QUESTION 1 OF 1
        </span>

        <h3 style={styles.questionText}>
          {lesson.question}
        </h3>

        <div style={styles.answerList}>
          {lesson.answers.map(
            (answer, index) => {
              const selected =
                selectedAnswer === index;

              const correct =
                quizChecked &&
                index ===
                  lesson.correctAnswer;

              const incorrect =
                quizChecked &&
                selected &&
                index !==
                  lesson.correctAnswer;

              return (
                <button
                  type="button"
                  key={answer}
                  onClick={() => {
                    setSelectedAnswer(index);
                  }}
                  style={{
                    ...styles.answerButton,
                    ...(selected
                      ? styles.selectedAnswer
                      : {}),
                    ...(correct
                      ? styles.correctAnswer
                      : {}),
                    ...(incorrect
                      ? styles.incorrectAnswer
                      : {}),
                  }}
                >
                  <span
                    style={styles.answerLetter}
                  >
                    {String.fromCharCode(
                      65 + index
                    )}
                  </span>

                  <span>{answer}</span>
                </button>
              );
            }
          )}
        </div>

        <button
          type="button"
          onClick={checkQuiz}
          style={styles.checkButton}
        >
          Check answer
        </button>

        {quizChecked && (
          <div
            style={{
              ...styles.quizFeedback,
              ...(quizCorrect
                ? styles.correctFeedback
                : styles.incorrectFeedback),
            }}
          >
            {quizCorrect
              ? "Excellent. Your answer is correct."
              : "Review the options and try again."}
          </div>
        )}
      </div>
    </div>
  );
}

function SectionHeading({
  label,
  title,
  text,
}) {
  return (
    <header style={styles.sectionHeading}>
      <p style={styles.sectionEyebrow}>
        {label}
      </p>

      <h2 style={styles.sectionTitle}>
        {title}
      </h2>

      <p style={styles.sectionDescription}>
        {text}
      </p>
    </header>
  );
}

function InfoCard({ label, value }) {
  return (
    <article style={styles.infoCard}>
      <span style={styles.infoLabel}>
        {label}
      </span>

      <strong style={styles.infoValue}>
        {value}
      </strong>
    </article>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "grid",
    gridTemplateColumns:
      "280px minmax(0, 1fr)",
    background: "#f5f6fb",
    fontFamily:
      "Arial, Helvetica, sans-serif",
  },

  loadingPage: {
    minHeight: "100vh",
    display: "grid",
    placeItems: "center",
    alignContent: "center",
    gap: "16px",
    padding: "24px",
    background:
      "linear-gradient(145deg,#101735,#25194e)",
    fontFamily:
      "Arial, Helvetica, sans-serif",
  },

  spinner: {
    width: "42px",
    height: "42px",
    border:
      "4px solid rgba(255,255,255,.22)",
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

  sidebar: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    position: "sticky",
    top: 0,
    alignSelf: "start",
    padding: "28px 22px",
    boxSizing: "border-box",
    background:
      "linear-gradient(180deg,#121936,#191f46)",
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

  backLink: {
    marginTop: "34px",
    color: "#bfc5de",
    textDecoration: "none",
    fontSize: "11px",
    fontWeight: "700",
  },

  lessonIdentity: {
    marginTop: "26px",
    padding: "19px",
    borderRadius: "16px",
    background:
      "rgba(255,255,255,.07)",
  },

  sideEyebrow: {
    margin: "0 0 7px",
    color: "#a794ff",
    fontSize: "8px",
    fontWeight: "900",
    letterSpacing: "1px",
  },

  sideTitle: {
    margin: 0,
    fontSize: "27px",
  },

  sideLessonTitle: {
    margin: "7px 0 0",
    color: "#bfc5de",
    fontSize: "11px",
    lineHeight: 1.5,
  },

  sectionNavigation: {
    display: "grid",
    gap: "7px",
    marginTop: "23px",
  },

  sectionButton: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    gap: "11px",
    padding: "10px",
    border: 0,
    borderRadius: "12px",
    background: "transparent",
    color: "#bfc5de",
    cursor: "pointer",
    textAlign: "left",
  },

  activeSectionButton: {
    background:
      "rgba(255,255,255,.1)",
    color: "#ffffff",
  },

  sectionIcon: {
    width: "31px",
    height: "31px",
    display: "grid",
    placeItems: "center",
    flexShrink: 0,
    borderRadius: "10px",
    background:
      "rgba(255,255,255,.08)",
    fontSize: "10px",
    fontWeight: "900",
  },

  visitedSectionIcon: {
    background:
      "linear-gradient(135deg,#7448ff,#ec42c7)",
    color: "#ffffff",
  },

  sectionNumber: {
    display: "block",
    color: "#7f88ae",
    fontSize: "7px",
    fontWeight: "900",
    letterSpacing: ".8px",
  },

  sectionLabel: {
    display: "block",
    marginTop: "3px",
    fontSize: "11px",
  },

  sidebarProgress: {
    marginTop: "25px",
    paddingTop: "19px",
    borderTop:
      "1px solid rgba(255,255,255,.1)",
  },

  progressHeading: {
    display: "flex",
    justifyContent: "space-between",
    color: "#bfc5de",
    fontSize: "9px",
  },

  progressTrack: {
    height: "7px",
    overflow: "hidden",
    marginTop: "10px",
    borderRadius: "999px",
    background:
      "rgba(255,255,255,.12)",
  },

  progressValue: {
    height: "100%",
    borderRadius: "999px",
    background:
      "linear-gradient(90deg,#7448ff,#ec42c7)",
  },

  sidebarAccount: {
    display: "grid",
    gap: "5px",
    marginTop: "auto",
    paddingTop: "20px",
    borderTop:
      "1px solid rgba(255,255,255,.1)",
    fontSize: "10px",
  },

  content: {
    minWidth: 0,
    padding: "42px",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "25px",
    maxWidth: "1000px",
    margin: "0 auto 27px",
  },

  eyebrow: {
    margin: "0 0 8px",
    color: "#7448ff",
    fontSize: "9px",
    fontWeight: "900",
    letterSpacing: "1.3px",
  },

  title: {
    margin: 0,
    color: "#172452",
    fontSize:
      "clamp(30px,4vw,45px)",
  },

  subtitle: {
    maxWidth: "650px",
    margin: "10px 0 0",
    color: "#737b96",
    fontSize: "14px",
    lineHeight: 1.6,
  },

  rewardCard: {
    minWidth: "120px",
    padding: "17px",
    borderRadius: "18px",
    background:
      "linear-gradient(135deg,#7448ff,#ec42c7)",
    color: "#ffffff",
    textAlign: "center",
  },

  rewardLabel: {
    display: "block",
    fontSize: "8px",
    fontWeight: "900",
    letterSpacing: "1px",
  },

  rewardValue: {
    display: "block",
    marginTop: "5px",
    fontSize: "20px",
  },

  lessonCard: {
    maxWidth: "1000px",
    minHeight: "560px",
    margin: "0 auto",
    padding: "33px",
    border: "1px solid #e5e8f1",
    borderRadius: "24px",
    background: "#ffffff",
    boxShadow:
      "0 20px 60px rgba(30,40,80,.07)",
  },

  sectionHeading: {
    maxWidth: "720px",
  },

  sectionEyebrow: {
    margin: "0 0 8px",
    color: "#7448ff",
    fontSize: "9px",
    fontWeight: "900",
    letterSpacing: "1.3px",
  },

  sectionTitle: {
    margin: 0,
    color: "#172452",
    fontSize: "29px",
  },

  sectionDescription: {
    margin: "11px 0 0",
    color: "#737b96",
    fontSize: "13px",
    lineHeight: 1.7,
  },

  overviewGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(150px,1fr))",
    gap: "13px",
    marginTop: "28px",
  },

  infoCard: {
    display: "grid",
    gap: "7px",
    padding: "17px",
    borderRadius: "14px",
    background: "#f6f7fb",
  },

  infoLabel: {
    color: "#8b92a8",
    fontSize: "9px",
    fontWeight: "800",
  },

  infoValue: {
    color: "#172452",
    fontSize: "14px",
  },

  outcomeBox: {
    marginTop: "22px",
    padding: "23px",
    borderRadius: "17px",
    background:
      "linear-gradient(135deg,#f3f0ff,#fff2fb)",
  },

  outcomeTitle: {
    margin: 0,
    color: "#172452",
    fontSize: "17px",
  },

  outcomeList: {
    display: "grid",
    gap: "10px",
    margin: "16px 0 0",
    paddingLeft: "20px",
    color: "#5f6883",
    fontSize: "12px",
    lineHeight: 1.5,
  },

  vocabularyGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(210px,1fr))",
    gap: "14px",
    marginTop: "27px",
  },

  wordCard: {
    padding: "19px",
    border: "1px solid #e6e8f0",
    borderRadius: "16px",
    background: "#fafbfe",
  },

  wordNumber: {
    color: "#a29aff",
    fontSize: "9px",
    fontWeight: "900",
  },

  wordTitle: {
    margin: "9px 0 7px",
    color: "#172452",
    fontSize: "20px",
    textTransform: "capitalize",
  },

  wordDefinition: {
    minHeight: "35px",
    margin: 0,
    color: "#747c95",
    fontSize: "11px",
    lineHeight: 1.55,
  },

  listenButton: {
    marginTop: "14px",
    padding: "8px 11px",
    border: 0,
    borderRadius: "9px",
    background: "#eeeaff",
    color: "#7448ff",
    cursor: "pointer",
    fontSize: "9px",
    fontWeight: "900",
  },

  ruleBox: {
    marginTop: "27px",
    padding: "23px",
    borderLeft:
      "4px solid #7448ff",
    borderRadius: "14px",
    background: "#f5f2ff",
  },

  ruleLabel: {
    color: "#7448ff",
    fontSize: "9px",
    fontWeight: "900",
    letterSpacing: "1px",
  },

  ruleText: {
    margin: "10px 0 0",
    color: "#303957",
    fontSize: "14px",
    lineHeight: 1.7,
  },

  exampleHeading: {
    margin: "27px 0 14px",
    color: "#172452",
  },

  exampleList: {
    display: "grid",
    gap: "10px",
  },

  exampleItem: {
    display: "flex",
    alignItems: "center",
    gap: "13px",
    padding: "14px",
    borderRadius: "12px",
    background: "#f7f8fc",
  },

  audioCard: {
    display: "flex",
    alignItems: "center",
    gap: "18px",
    marginTop: "28px",
    padding: "23px",
    borderRadius: "18px",
    background:
      "linear-gradient(135deg,#171f48,#291d55)",
    color: "#ffffff",
  },

  audioIcon: {
    width: "50px",
    height: "50px",
    display: "grid",
    placeItems: "center",
    flexShrink: 0,
    borderRadius: "16px",
    background:
      "linear-gradient(135deg,#7448ff,#ec42c7)",
    fontSize: "21px",
  },

  audioContent: {
    flex: 1,
  },

  audioLabel: {
    color: "#a794ff",
    fontSize: "8px",
    fontWeight: "900",
  },

  audioTitle: {
    margin: "6px 0",
  },

  audioHint: {
    margin: 0,
    color: "#aeb5d4",
    fontSize: "10px",
  },

  audioButton: {
    padding: "11px 15px",
    border: 0,
    borderRadius: "10px",
    background: "#ffffff",
    color: "#172452",
    cursor: "pointer",
    fontWeight: "800",
  },

  transcript: {
    marginTop: "18px",
    padding: "16px",
    border: "1px solid #e3e6ef",
    borderRadius: "13px",
  },

  transcriptSummary: {
    color: "#7448ff",
    cursor: "pointer",
    fontSize: "11px",
    fontWeight: "800",
  },

  transcriptText: {
    margin: "14px 0 0",
    color: "#5f6883",
    fontSize: "12px",
    lineHeight: 1.8,
  },

  listeningTip: {
    marginTop: "18px",
    padding: "18px",
    borderRadius: "14px",
    background: "#f5f7fb",
    color: "#4f5873",
    fontSize: "12px",
    lineHeight: 1.6,
  },

  promptCard: {
    marginTop: "27px",
    padding: "25px",
    borderRadius: "18px",
    background:
      "linear-gradient(135deg,#f3f0ff,#fff1fb)",
  },

  promptLabel: {
    color: "#7448ff",
    fontSize: "9px",
    fontWeight: "900",
    letterSpacing: "1px",
  },

  promptText: {
    margin: "11px 0 0",
    color: "#172452",
    fontSize: "22px",
    lineHeight: 1.45,
  },

  noteField: {
    display: "grid",
    gap: "8px",
    marginTop: "20px",
  },

  noteLabel: {
    color: "#303957",
    fontSize: "11px",
    fontWeight: "800",
  },

  textarea: {
    minHeight: "125px",
    resize: "vertical",
    padding: "15px",
    border: "1px solid #dfe3ed",
    borderRadius: "13px",
    fontFamily: "inherit",
    fontSize: "13px",
    outline: "none",
  },

  speakingChecklist: {
    marginTop: "18px",
    padding: "20px",
    borderRadius: "15px",
    background: "#f6f7fb",
    color: "#515a75",
    fontSize: "12px",
    lineHeight: 1.7,
  },

  questionCard: {
    marginTop: "28px",
    padding: "25px",
    borderRadius: "19px",
    background: "#f7f8fc",
  },

  questionLabel: {
    color: "#7448ff",
    fontSize: "9px",
    fontWeight: "900",
    letterSpacing: "1px",
  },

  questionText: {
    margin: "12px 0 20px",
    color: "#172452",
    fontSize: "21px",
    lineHeight: 1.45,
  },

  answerList: {
    display: "grid",
    gap: "10px",
  },

  answerButton: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "13px",
    border: "1px solid #dfe3ed",
    borderRadius: "12px",
    background: "#ffffff",
    color: "#303957",
    cursor: "pointer",
    textAlign: "left",
  },

  selectedAnswer: {
    borderColor: "#7448ff",
    background: "#f2efff",
  },

  correctAnswer: {
    borderColor: "#39a879",
    background: "#edfff6",
  },

  incorrectAnswer: {
    borderColor: "#db5b76",
    background: "#fff0f3",
  },

  answerLetter: {
    width: "29px",
    height: "29px",
    display: "grid",
    placeItems: "center",
    flexShrink: 0,
    borderRadius: "9px",
    background: "#eceef5",
    fontSize: "10px",
    fontWeight: "900",
  },

  checkButton: {
    marginTop: "17px",
    padding: "11px 17px",
    border: 0,
    borderRadius: "10px",
    background: "#172452",
    color: "#ffffff",
    cursor: "pointer",
    fontWeight: "800",
  },

  quizFeedback: {
    marginTop: "15px",
    padding: "12px",
    borderRadius: "10px",
    fontSize: "11px",
  },

  correctFeedback: {
    background: "#e9fff4",
    color: "#147653",
  },

  incorrectFeedback: {
    background: "#fff0f3",
    color: "#bd294d",
  },

  message: {
    marginTop: "20px",
    padding: "13px",
    borderRadius: "11px",
    background: "#fff5e6",
    color: "#97631f",
    fontSize: "11px",
    lineHeight: 1.5,
  },

  successMessage: {
    background: "#e9fff4",
    color: "#147653",
  },

  lessonFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "15px",
    marginTop: "31px",
    paddingTop: "23px",
    borderTop: "1px solid #eceef4",
  },

  primaryButton: {
    padding: "13px 20px",
    border: 0,
    borderRadius: "11px",
    background:
      "linear-gradient(135deg,#7448ff,#ec42c7)",
    color: "#ffffff",
    cursor: "pointer",
    fontWeight: "900",
  },

  secondaryButton: {
    padding: "12px 17px",
    border: "1px solid #dfe3ed",
    borderRadius: "11px",
    background: "#ffffff",
    color: "#4c5570",
    cursor: "pointer",
    fontWeight: "800",
  },

  primaryLink: {
    display: "inline-flex",
    padding: "13px 19px",
    borderRadius: "11px",
    background:
      "linear-gradient(135deg,#7448ff,#ec42c7)",
    color: "#ffffff",
    textDecoration: "none",
    fontSize: "12px",
    fontWeight: "900",
  },
};