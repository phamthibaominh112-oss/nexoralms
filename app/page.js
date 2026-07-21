"use client";
import Link from "next/link";
import { ArrowRight, Gamepad2, ClipboardCheck, GraduationCap, Sparkles, Headphones, Languages } from "lucide-react";
import LanguageToggle from "@/components/LanguageToggle";
import NoriMascot from "@/components/NoriMascot";
import {useLanguage} from "@/components/LanguageProvider";
import styles from "./landing.module.css";

export default function Landing(){
  const{language}=useLanguage(),vi=language==="vi";
  const features=[
    [ClipboardCheck,vi?"Placement Test cá nhân hóa":"Personalized placement test",vi?"Xác định CEFR, IELTS range và level nên bắt đầu.":"Find your CEFR, IELTS range and recommended starting level."],
    [Gamepad2,vi?"Game-based learning":"Game-based learning",vi?"Flappy Quiz, memory, matching, quests và streak.":"Flappy Quiz, memory, matching, quests and streaks."],
    [GraduationCap,vi?"IELTS computer-based":"Computer-based IELTS",vi?"Timer, passage split view, navigator, answer sheet và recording.":"Timer, split view, navigator, answer sheet and recording."],
    [Sparkles,vi?"Nhiều dạng bài":"Rich activity types",vi?"Flashcard, dictation, pronunciation, sorting, categorizing, writing và speaking.":"Flashcards, dictation, pronunciation, sorting, categorizing, writing and speaking."],
    [Headphones,vi?"Audio và shadowing":"Audio and shadowing",vi?"Audio thật từ Storage, browser voice chỉ là phương án dự phòng.":"Real Storage audio with browser voice only as fallback."],
    [Languages,vi?"Song ngữ EN–VI":"Bilingual EN–VI",vi?"Chuyển ngôn ngữ giao diện và hướng dẫn trong một nút.":"Switch interface and instructions instantly."]
  ];
  return <main className={styles.page}>
    <header className={`container ${styles.header}`}><Link href="/" className={styles.brand}><span>N</span><strong>NEXORA LMS</strong></Link><div><LanguageToggle/><Link href="/auth" className="secondary">{vi?"Đăng nhập":"Sign in"}</Link></div></header>
    <section className={`container ${styles.hero}`}>
      <div><p className="eyebrow">{vi?"LMS SONG NGỮ, GAME HÓA":"BILINGUAL, GAMIFIED LMS"}</p><h1>{vi?"Biết mình đang ở đâu. Học đúng thứ mình cần.":"Know where you are. Learn exactly what you need."}</h1><p>{vi?"Nexora chẩn đoán đầu vào, xây lộ trình 100 level, biến bài học thành hoạt động tương tác và mô phỏng IELTS trên máy tính.":"Nexora diagnoses your starting point, builds a 100-level path, turns lessons into interactive missions and simulates computer-based IELTS."}</p><div className={styles.actions}><Link href="/placement" className="primary">{vi?"Làm Placement Test":"Take Placement Test"}<ArrowRight size={18}/></Link><Link href="/games" className="secondary">{vi?"Thử Flappy Quiz":"Try Flappy Quiz"}</Link></div></div>
      <div className={styles.mascot}><NoriMascot size={260} mood="celebrate" speech={vi?"Mình là Nori. Mình sẽ đồng hành cùng bạn!":"I'm Nori. I'll guide your journey!"}/></div>
    </section>
    <section className={`container ${styles.how}`}><div><p className="eyebrow">HOW NEXORA WORKS</p><h2>{vi?"Một hệ thống học tập, không chỉ là danh sách bài":"A learning system, not a list of lessons"}</h2></div><div className={styles.steps}>{["Placement","Personal roadmap","Interactive missions","IELTS simulation","Analytics & review"].map((x,i)=><article key={x}><span>{i+1}</span><strong>{x}</strong></article>)}</div></section>
    <section className={`container ${styles.features}`}>{features.map(([Icon,title,text])=><article className="card" key={title}><Icon size={25}/><h3>{title}</h3><p>{text}</p></article>)}</section>
    <section className={`container ${styles.cta}`}><NoriMascot size={110}/><div><h2>{vi?"Bắt đầu bằng dữ liệu, không phải phỏng đoán":"Start with data, not guesswork"}</h2><p>{vi?"Placement Test sẽ đề xuất level bắt đầu và kỹ năng cần ưu tiên.":"The placement test recommends a starting level and priority skills."}</p></div><Link href="/placement" className="primary">{vi?"Bắt đầu":"Start now"}</Link></section>
  </main>
}
