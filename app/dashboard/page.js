"use client";
import Link from "next/link";
import {Trophy,Heart,Gem,Flame,Target,Gamepad2,ClipboardCheck,GraduationCap} from "lucide-react";
import AppShell from "@/components/AppShell";
import NoriMascot from "@/components/NoriMascot";
import {useAuth} from "@/components/AuthProvider";
import {useLanguage} from "@/components/LanguageProvider";
import styles from "./dashboard.module.css";

export default function Dashboard(){
  const{profile}=useAuth(),{language}=useLanguage(),vi=language==="vi";
  const level=Number(profile?.current_lesson||1);
  return <AppShell>
    <header className={styles.header}><div><p className="eyebrow">{vi?"TRUNG TÂM HỌC TẬP":"LEARNING COMMAND CENTER"}</p><h1>{vi?"Chào mừng trở lại":"Welcome back"}, {profile?.full_name?.split(" ")[0]||"Learner"}</h1><p className="muted">{vi?"Nori đã chuẩn bị nhiệm vụ hôm nay.":"Nori has prepared today's mission."}</p></div><NoriMascot size={125} speech={vi?"Hoàn thành 1 nhiệm vụ và 1 game nhé!":"Let's finish one mission and one game!"}/></header>
    <section className={styles.resources}>
      <Stat icon={Heart} label={vi?"Tim":"Hearts"} value={profile?.hearts??5}/>
      <Stat icon={Gem} label={vi?"Xu":"Coins"} value={profile?.coins??0}/>
      <Stat icon={Flame} label={vi?"Streak":"Streak"} value={`${profile?.streak_days??0}d`}/>
      <Stat icon={Trophy} label="XP" value={profile?.total_xp??0}/>
    </section>
    <section className={styles.hero}>
      <div><p className="eyebrow">{vi?"NHIỆM VỤ CHÍNH":"MAIN QUEST"}</p><h2>Level {level}: Interactive Mission</h2><p>{vi?"35–45 phút với từ vựng, grammar discovery, memory game, listening, shadowing, speaking, writing và boss checkpoint.":"35–45 minutes with vocabulary, grammar discovery, memory, listening, shadowing, speaking, writing and a boss checkpoint."}</p><Link className="primary" href={`/level/${level}`}>{vi?"Bắt đầu nhiệm vụ":"Start mission"}</Link></div><div className={styles.progress}><strong>{level}</strong><span>/100</span></div>
    </section>
    <section className={styles.grid}>
      <Quick href="/placement" icon={ClipboardCheck} title={vi?"Placement Test":"Placement Test"} text={vi?"Xác định level nên bắt đầu.":"Find your recommended starting level."}/>
      <Quick href="/games/flappy-quiz" icon={Gamepad2} title="Flappy Quiz" text={vi?"Qua 3 cổng phải trả lời đúng để chơi tiếp.":"Answer after every three gates to continue."}/>
      <Quick href="/ielts" icon={GraduationCap} title={vi?"IELTS Lab":"IELTS Lab"} text={vi?"Giao diện thi máy, timer và question navigator.":"Computer-test UI, timer and navigator."}/>
      <Quick href="/roadmap" icon={Target} title={vi?"Lộ trình cá nhân":"Personal roadmap"} text={vi?"100 level và boss battle theo chặng.":"100 levels with stage boss battles."}/>
    </section>
  </AppShell>
}
function Stat({icon:Icon,label,value}){return <article className={`card ${styles.stat}`}><Icon size={20}/><span>{label}</span><strong>{value}</strong></article>}
function Quick({href,icon:Icon,title,text}){return <Link href={href} className={`card ${styles.quick}`}><Icon size={25}/><h3>{title}</h3><p>{text}</p></Link>}
