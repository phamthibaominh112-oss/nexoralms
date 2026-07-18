"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { supabase } from "../../lib/supabase";
import styles from "./dashboard.module.css";

const lessonNames = [
  "Introducing yourself",
  "Numbers and personal information",
  "Family and relationships",
  "Daily routines",
  "Food and drinks",
  "Home and neighbourhood",
  "Study and work",
  "Free-time activities",
  "Travel and transport",
  "Foundation checkpoint",
  "Describing people",
  "Past experiences",
  "Future plans",
  "Health and wellbeing",
  "Shopping and services",
  "Technology in daily life",
  "Weather and environment",
  "Culture and celebrations",
  "Making comparisons",
  "Essential English checkpoint",
];

const navigation = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: "D",
    active: true,
  },
  {
    label: "Learning roadmap",
    href: "/roadmap",
    icon: "R",
  },
  {
    label: "Learner profile",
    href: "/onboarding",
    icon: "P",
  },
];

function getLessonName(level) {
  if (
    level >= 1 &&
    level <= lessonNames.length
  ) {
    return lessonNames[level - 1];
  }

  const cycle = [
    "Vocabulary development",
    "Grammar accuracy",
    "Listening comprehension",
    "Reading strategies",
    "Speaking fluency",
    "Writing development",
    "Pronunciation practice",
    "IELTS skill integration",
    "Exam strategy",
    "Stage checkpoint",
  ];

  return cycle[(level - 1) % cycle.length];
}

function getStage(level) {
  if (level <= 10) {
    return {
      name: "Starter Foundations",
      cefr: "Pre-A1",
    };
  }

  if (level <= 20) {
    return {
      name: "Essential English",
      cefr: "A1",
    };
  }

  if (level <= 30) {
    return {
      name: "Everyday Communication",
      cefr: "A2",
    };
  }

  if (level <= 40) {
    return {
      name: "Independent English",
      cefr: "B1",
    };
  }

  if (level <= 50) {
    return {
      name: "IELTS Core Skills",
      cefr: "B1+",
    };
  }

  if (level <= 60) {
    return {
      name: "Academic Development",
      cefr: "B2",
    };
  }

  if (level <= 70) {
    return {
      name: "Confident IELTS User",
      cefr: "B2+",
    };
  }

  if (level <= 80) {
    return {
      name: "Advanced IELTS Skills",
      cefr: "C1",
    };
  }

  if (level <= 90) {
    return {
      name: "Band 7.5 Performance",
      cefr: "C1+",
    };
  }

  return {
    name: "Road to Band 8",
    cefr: "Advanced",
  };
}

function formatActivityDate(value) {
  if (!value) {
    return "Recently";
  }

  const activityDate = new Date(value);
  const now = new Date();

  const todayStart = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );

  const activityStart = new Date(
    activityDate.getFullYear(),
    activityDate.getMonth(),
    activityDate.getDate()
  );

  const difference =
    Math.round(
      (todayStart - activityStart) /
        86400000
    );

  if (difference === 0) {
    return "Today";
  }

  if (difference === 1) {
    return "Yesterday";
  }

  return activityDate.toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year:
        activityDate.getFullYear() !==
        now.getFullYear()
          ? "numeric"
          : undefined,
    }
  );
}

function getInitials(name, email) {
  const source =
    name?.trim() ||
    email?.split("@")[0] ||
    "N";

  const parts = source
    .split(" ")
    .filter(Boolean);

  if (parts.length >= 2) {
    return (
      parts[0][0] +
      parts[parts.length - 1][0]
    ).toUpperCase();
  }

  return source
    .slice(0, 2)
    .toUpperCase();
}

export default function DashboardPage() {
  const router = useRouter();

  const [loading, setLoading] =
    useState(true);

  const [loggingOut, setLoggingOut] =
    useState(false);

  const [user, setUser] =
    useState(null);

  const [profile, setProfile] =
    useState(null);

  const [activities, setActivities] =
    useState([]);

  const [errorMessage, setErrorMessage] =
    useState("");

  const loadDashboard = useCallback(
    async () => {
      setLoading(true);
      setErrorMessage("");

      if (!supabase) {
        setErrorMessage(
          "Supabase environment variables are missing."
        );
        setLoading(false);
        return;
      }

      try {
        const {
          data: userData,
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) {
          throw userError;
        }

        if (!userData?.user) {
          router.replace("/auth");
          return;
        }

        const currentUser =
          userData.user;

        setUser(currentUser);

        const {
          data: profileData,
          error: profileError,
        } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", currentUser.id)
          .maybeSingle();

        if (profileError) {
          throw profileError;
        }

        if (
          !profileData ||
          !profileData.onboarding_completed
        ) {
          router.replace("/onboarding");
          return;
        }

        setProfile(profileData);

        const {
          data: progressData,
          error: progressError,
        } = await supabase
          .from("user_progress")
          .select(
            "level_id, completed, earned_xp, completed_at, updated_at"
          )
          .eq(
            "user_id",
            currentUser.id
          )
          .eq("completed", true)
          .order("completed_at", {
            ascending: false,
          })
          .limit(6);

        if (progressError) {
          throw progressError;
        }

        setActivities(
          progressData || []
        );
      } catch (error) {
        setErrorMessage(
          error?.message ||
            "The dashboard could not be loaded."
        );
      } finally {
        setLoading(false);
      }
    },
    [router]
  );

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  async function handleLogout() {
    if (!supabase) {
      return;
    }

    setLoggingOut(true);

    await supabase.auth.signOut();

    router.replace("/");
    router.refresh();
  }

  const dashboardData = useMemo(() => {
    const currentLevel = Math.min(
      Math.max(
        Number(
          profile?.current_lesson || 1
        ),
        1
      ),
      100
    );

    const completedLevels =
      activities.length > 0
        ? Math.max(
            currentLevel - 1,
            activities.length
          )
        : Math.max(
            currentLevel - 1,
            0
          );

    const progressPercentage =
      Math.min(
        Math.round(
          (completedLevels / 100) *
            100
        ),
        100
      );

    const totalXp = Number(
      profile?.total_xp || 0
    );

    const targetBand = Number(
      profile?.target_band || 8
    ).toFixed(1);

    const dailyMinutes = Number(
      profile?.daily_minutes || 30
    );

    const streakDays = Number(
      profile?.streak_days || 0
    );

    const stage =
      getStage(currentLevel);

    return {
      currentLevel,
      completedLevels,
      progressPercentage,
      totalXp,
      targetBand,
      dailyMinutes,
      streakDays,
      stage,
      lessonName:
        getLessonName(currentLevel),
      xpReward:
        80 +
        ((currentLevel - 1) % 5) *
          10,
    };
  }, [profile, activities]);

  if (loading) {
    return (
      <main
        className={
          styles.loadingPage
        }
      >
        <div
          className={styles.spinner}
        />

        <p
          className={
            styles.loadingText
          }
        >
          Loading your Nexora
          dashboard...
        </p>
      </main>
    );
  }

  if (
    errorMessage ||
    !profile ||
    !user
  ) {
    return (
      <main
        className={
          styles.loadingPage
        }
      >
        <section
          className={styles.errorCard}
        >
          <h1
            className={
              styles.errorTitle
            }
          >
            Dashboard unavailable
          </h1>

          <p
            className={
              styles.errorText
            }
          >
            {errorMessage ||
              "Your learner profile could not be found."}
          </p>

          <button
            type="button"
            onClick={loadDashboard}
            className={
              styles.retryButton
            }
          >
            Try again
          </button>
        </section>
      </main>
    );
  }

  const learnerName =
    profile.full_name ||
    user.email?.split("@")[0] ||
    "Learner";

  const initials = getInitials(
    learnerName,
    user.email
  );

  const achievements = [
    {
      name: "First Lesson",
      description:
        "Complete your first Nexora level.",
      unlocked:
        dashboardData.completedLevels >=
        1,
      icon: "01",
    },
    {
      name: "100 XP",
      description:
        "Earn your first 100 XP.",
      unlocked:
        dashboardData.totalXp >= 100,
      icon: "XP",
    },
    {
      name: "Stage 1",
      description:
        "Complete the first 10 levels.",
      unlocked:
        dashboardData.completedLevels >=
        10,
      icon: "S1",
    },
    {
      name: "7-day streak",
      description:
        "Study for seven consecutive days.",
      unlocked:
        dashboardData.streakDays >= 7,
      icon: "7D",
    },
  ];

  return (
    <main className={styles.page}>
      <aside
        className={styles.sidebar}
      >
        <Link
          href="/"
          className={styles.brand}
        >
          <span
            className={
              styles.brandMark
            }
          >
            N
          </span>

          <span>
            <strong
              className={
                styles.brandName
              }
            >
              NEXORA
            </strong>

            <small
              className={
                styles.brandSubtitle
              }
            >
              Road to IELTS 8.0
            </small>
          </span>
        </Link>

        <nav
          className={
            styles.navigation
          }
        >
          {navigation.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`${styles.navLink} ${
                item.active
                  ? styles.activeNav
                  : ""
              }`}
            >
              <span
                className={
                  styles.navIcon
                }
              >
                {item.icon}
              </span>

              {item.label}
            </Link>
          ))}
        </nav>

        <section
          className={
            styles.sidebarPlan
          }
        >
          <p
            className={
              styles.sidebarPlanLabel
            }
          >
            YOUR LEARNING PLAN
          </p>

          <h3
            className={
              styles.sidebarPlanTitle
            }
          >
            IELTS{" "}
            {
              dashboardData.targetBand
            }
          </h3>

          <p
            className={
              styles.sidebarPlanText
            }
          >
            {
              dashboardData.dailyMinutes
            }{" "}
            minutes of focused practice
            each day.
          </p>
        </section>

        <footer
          className={
            styles.sidebarFooter
          }
        >
          <p
            className={
              styles.accountName
            }
          >
            {learnerName}
          </p>

          <p
            className={
              styles.accountEmail
            }
          >
            {user.email}
          </p>

          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className={
              styles.logoutButton
            }
          >
            {loggingOut
              ? "Signing out..."
              : "Sign out"}
          </button>
        </footer>
      </aside>

      <section
        className={styles.content}
      >
        <header
          className={styles.topbar}
        >
          <div>
            <p
              className={
                styles.eyebrow
              }
            >
              LEARNER DASHBOARD
            </p>

            <h1
              className={
                styles.pageTitle
              }
            >
              Welcome back,{" "}
              {learnerName.split(" ")[0]}
            </h1>

            <p
              className={
                styles.subtitle
              }
            >
              Continue building your
              English step by step and
              move closer to your IELTS{" "}
              {
                dashboardData.targetBand
              }{" "}
              goal.
            </p>
          </div>

          <div
            className={
              styles.profilePill
            }
          >
            <span
              className={styles.avatar}
            >
              {initials}
            </span>

            <span>
              <strong
                className={
                  styles.profileName
                }
              >
                {learnerName}
              </strong>

              <small
                className={
                  styles.profileLevel
                }
              >
                {
                  dashboardData.stage
                    .cefr
                }{" "}
                learner
              </small>
            </span>
          </div>
        </header>

        <section
          className={styles.hero}
        >
          <div
            className={
              styles.heroContent
            }
          >
            <p
              className={
                styles.heroLabel
              }
            >
              CONTINUE LEARNING
            </p>

            <h2
              className={
                styles.heroTitle
              }
            >
              Level{" "}
              {
                dashboardData.currentLevel
              }
              :{" "}
              {
                dashboardData.lessonName
              }
            </h2>

            <p
              className={
                styles.heroText
              }
            >
              Complete vocabulary,
              grammar, listening,
              speaking and the final
              checkpoint to unlock your
              next level.
            </p>

            <div
              className={
                styles.heroMeta
              }
            >
              <span
                className={
                  styles.metaPill
                }
              >
                {
                  dashboardData.stage
                    .name
                }
              </span>

              <span
                className={
                  styles.metaPill
                }
              >
                {
                  dashboardData.stage
                    .cefr
                }
              </span>

              <span
                className={
                  styles.metaPill
                }
              >
                25–30 minutes
              </span>

              <span
                className={
                  styles.metaPill
                }
              >
                +
                {
                  dashboardData.xpReward
                }{" "}
                XP
              </span>
            </div>

            <Link
              href={`/level/${dashboardData.currentLevel}`}
              className={
                styles.continueButton
              }
            >
              Continue Level{" "}
              {
                dashboardData.currentLevel
              }{" "}
              →
            </Link>
          </div>

          <div
            className={
              styles.heroLevel
            }
          >
            <span
              className={
                styles.heroLevelLabel
              }
            >
              CURRENT LEVEL
            </span>

            <strong
              className={
                styles.heroLevelValue
              }
            >
              {
                dashboardData.currentLevel
              }
            </strong>

            <span
              className={
                styles.heroLevelTotal
              }
            >
              of 100
            </span>
          </div>
        </section>

        <section
          className={
            styles.statsGrid
          }
        >
          <StatCard
            label="Completed"
            value={
              dashboardData.completedLevels
            }
            detail="levels completed"
          />

          <StatCard
            label="Total XP"
            value={
              dashboardData.totalXp
            }
            detail="experience earned"
          />

          <StatCard
            label="Current CEFR"
            value={
              dashboardData.stage.cefr
            }
            detail={
              dashboardData.stage.name
            }
          />

          <StatCard
            label="Study streak"
            value={`${dashboardData.streakDays}d`}
            detail="consecutive days"
          />
        </section>

        <section
          className={
            styles.dashboardGrid
          }
        >
          <article
            className={styles.card}
          >
            <header
              className={
                styles.cardHeader
              }
            >
              <div>
                <p
                  className={
                    styles.cardEyebrow
                  }
                >
                  ROAD TO IELTS{" "}
                  {
                    dashboardData.targetBand
                  }
                </p>

                <h2
                  className={
                    styles.cardTitle
                  }
                >
                  Learning progress
                </h2>
              </div>

              <Link
                href="/roadmap"
                className={
                  styles.cardAction
                }
              >
                View roadmap →
              </Link>
            </header>

            <div
              className={
                styles.progressLayout
              }
            >
              <div
                className={
                  styles.progressRing
                }
                style={{
                  "--progress": `${dashboardData.progressPercentage}%`,
                }}
              >
                <div
                  className={
                    styles.progressRingInner
                  }
                >
                  <strong
                    className={
                      styles.progressPercentage
                    }
                  >
                    {
                      dashboardData.progressPercentage
                    }
                    %
                  </strong>

                  <span
                    className={
                      styles.progressCaption
                    }
                  >
                    COMPLETE
                  </span>
                </div>
              </div>

              <div
                className={
                  styles.progressInfo
                }
              >
                <ProgressRow
                  label="Current stage"
                  value={
                    dashboardData.stage
                      .name
                  }
                />

                <ProgressRow
                  label="Levels completed"
                  value={`${dashboardData.completedLevels} of 100`}
                />

                <ProgressRow
                  label="Current level"
                  value={`Level ${dashboardData.currentLevel}`}
                />

                <ProgressRow
                  label="Target band"
                  value={`IELTS ${dashboardData.targetBand}`}
                />
              </div>
            </div>
          </article>

          <article
            className={styles.card}
          >
            <header
              className={
                styles.cardHeader
              }
            >
              <div>
                <p
                  className={
                    styles.cardEyebrow
                  }
                >
                  DAILY PLAN
                </p>

                <h2
                  className={
                    styles.cardTitle
                  }
                >
                  Today&apos;s goal
                </h2>
              </div>
            </header>

            <div
              className={
                styles.goalBox
              }
            >
              <div
                className={
                  styles.goalTop
                }
              >
                <div>
                  <strong
                    className={
                      styles.goalMinutes
                    }
                  >
                    {
                      dashboardData.dailyMinutes
                    }
                  </strong>

                  <span
                    className={
                      styles.goalUnit
                    }
                  >
                    {" "}
                    minutes
                  </span>
                </div>

                <span
                  className={
                    styles.goalBadge
                  }
                >
                  DAILY TARGET
                </span>
              </div>

              <p
                className={
                  styles.goalText
                }
              >
                Complete one focused
                learning session today to
                maintain your momentum.
              </p>
            </div>
          </article>

          <article
            className={styles.card}
          >
            <header
              className={
                styles.cardHeader
              }
            >
              <div>
                <p
                  className={
                    styles.cardEyebrow
                  }
                >
                  LEARNING HISTORY
                </p>

                <h2
                  className={
                    styles.cardTitle
                  }
                >
                  Recent activity
                </h2>
              </div>
            </header>

            {activities.length > 0 ? (
              <div
                className={
                  styles.activityList
                }
              >
                {activities.map(
                  (activity) => (
                    <div
                      key={
                        activity.level_id
                      }
                      className={
                        styles.activityItem
                      }
                    >
                      <span
                        className={
                          styles.activityIcon
                        }
                      >
                        ✓
                      </span>

                      <div>
                        <p
                          className={
                            styles.activityTitle
                          }
                        >
                          Completed Level{" "}
                          {
                            activity.level_id
                          }
                        </p>

                        <p
                          className={
                            styles.activityDate
                          }
                        >
                          {formatActivityDate(
                            activity.completed_at ||
                              activity.updated_at
                          )}
                        </p>
                      </div>

                      <span
                        className={
                          styles.activityXp
                        }
                      >
                        +
                        {Number(
                          activity.earned_xp ||
                            0
                        )}{" "}
                        XP
                      </span>
                    </div>
                  )
                )}
              </div>
            ) : (
              <div
                className={
                  styles.emptyState
                }
              >
                Complete your first
                lesson and your activity
                history will appear here.
              </div>
            )}
          </article>

          <article
            className={styles.card}
          >
            <header
              className={
                styles.cardHeader
              }
            >
              <div>
                <p
                  className={
                    styles.cardEyebrow
                  }
                >
                  ACHIEVEMENTS
                </p>

                <h2
                  className={
                    styles.cardTitle
                  }
                >
                  Your milestones
                </h2>
              </div>
            </header>

            <div
              className={
                styles.achievementGrid
              }
            >
              {achievements.map(
                (achievement) => (
                  <article
                    key={
                      achievement.name
                    }
                    className={`${styles.achievement} ${
                      achievement.unlocked
                        ? styles.achievementUnlocked
                        : styles.achievementLocked
                    }`}
                  >
                    <span
                      className={
                        styles.achievementIcon
                      }
                    >
                      {achievement.unlocked
                        ? achievement.icon
                        : "—"}
                    </span>

                    <h3
                      className={
                        styles.achievementName
                      }
                    >
                      {achievement.name}
                    </h3>

                    <p
                      className={
                        styles.achievementText
                      }
                    >
                      {
                        achievement.description
                      }
                    </p>
                  </article>
                )
              )}
            </div>
          </article>
        </section>
      </section>
    </main>
  );
}

function StatCard({
  label,
  value,
  detail,
}) {
  return (
    <article
      className={styles.statCard}
    >
      <span
        className={styles.statLabel}
      >
        {label}
      </span>

      <strong
        className={styles.statValue}
      >
        {value}
      </strong>

      <span
        className={styles.statDetail}
      >
        {detail}
      </span>
    </article>
  );
}

function ProgressRow({
  label,
  value,
}) {
  return (
    <div
      className={styles.progressRow}
    >
      <span
        className={styles.progressKey}
      >
        {label}
      </span>

      <strong
        className={
          styles.progressValueText
        }
      >
        {value}
      </strong>
    </div>
  );
}