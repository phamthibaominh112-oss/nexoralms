"use client";
import Link from "next/link";
import {Headphones,BookOpen,PenLine,Mic2,Clock3,Monitor} from "lucide-react";
import AppShell from "@/components/AppShell";
import {useLanguage} from "@/components/LanguageProvider";
import styles from "./ielts.module.css";

export default function IELTS(){
  const{language}=useLanguage(),vi=language==="vi";
  const modules=[
    ["listening",Headphones,"IELTS Listening","4 sections · 40 questions · audio controls"],
    ["reading",BookOpen,"IELTS Reading","3 passages · 40 questions · split screen"],
    ["writing",PenLine,"IELTS Writing","Task 1 + Task 2 · timer · word count"],
    ["speaking",Mic2,"IELTS Speaking","Part 1–3 · preparation timer · recording"]
  ];
  return <AppShell>
    <header className={styles.header}><div><p className="eyebrow">COMPUTER-BASED IELTS</p><h1>{vi?"Không phải quiz gắn nhãn IELTS":"Not a quiz wearing an IELTS label"}</h1><p>{vi?"Nexora mô phỏng thời gian, bố cục, question navigator, passage, answer sheet và recording giống quy trình thi máy.":"Nexora reproduces timing, layout, question navigation, passages, answer sheet and recording workflow."}</p></div><Monitor size={80}/></header>
    <section className={styles.info}><span><Clock3/> Timed sections</span><span><Monitor/> Computer-test layout</span><span>40-question paper structure</span><span>Autosave-ready schema</span></section>
    <section className={styles.grid}>{modules.map(([slug,Icon,title,text])=><Link key={slug} href={`/ielts/${slug}/demo`} className="card"><Icon size={28}/><h2>{title}</h2><p>{text}</p><strong>{vi?"Mở bài thi mẫu":"Open exam demo"} →</strong></Link>)}</section>
  </AppShell>
}
