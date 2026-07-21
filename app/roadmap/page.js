"use client";
import{useEffect,useState}from"react";
import Link from"next/link";
import{Lock,Check,Gamepad2}from"lucide-react";
import AppShell from"@/components/AppShell";
import{useAuth}from"@/components/AuthProvider";
import{useLanguage}from"@/components/LanguageProvider";
import{getLessons}from"@/lib/data";
import styles from"./roadmap.module.css";

export default function Roadmap(){
  const[lessons,setLessons]=useState([]),{profile}=useAuth(),{language}=useLanguage(),vi=language==="vi";
  const current=Number(profile?.current_lesson||1);
  useEffect(()=>{getLessons().then(setLessons)},[]);
  return <AppShell><header className={styles.header}><p className="eyebrow">{vi?"LỘ TRÌNH 100 LEVEL":"100-LEVEL ROADMAP"}</p><h1>{vi?"Mỗi chặng là một cuộc phiêu lưu":"Every stage is an adventure"}</h1></header><div className={styles.path}>{lessons.map(l=>{const locked=l.level_number>current,done=l.level_number<current,boss=l.level_number%10===0;const inner=<><span className={`${styles.node} ${boss?styles.boss:""}`}>{done?<Check/>:locked?<Lock/>:boss?<Gamepad2/>:l.level_number}</span><div><small>{l.cefr_level} · {l.stage_name}</small><strong>{vi?(l.title_vi||l.title):l.title}</strong><p>{vi?(l.subtitle_vi||l.subtitle):l.subtitle}</p></div></>;return locked?<article key={l.id} className={`${styles.level} ${styles.locked}`}>{inner}</article>:<Link key={l.id} href={`/level/${l.level_number}`} className={`${styles.level} ${done?styles.done:styles.current}`}>{inner}</Link>})}</div></AppShell>
}
