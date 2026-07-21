"use client";
import{useEffect,useMemo,useState}from"react";
import{useParams,useRouter}from"next/navigation";
import AppShell from"@/components/AppShell";
import RichExercise from"@/components/RichExercise";
import AudioButton from"@/components/AudioButton";
import NoriMascot from"@/components/NoriMascot";
import{getLesson}from"@/lib/data";
import{useLanguage}from"@/components/LanguageProvider";
import{useAuth}from"@/components/AuthProvider";
import{supabase}from"@/lib/supabase";
import styles from"./lesson.module.css";

export default function Lesson(){
  const{id}=useParams(),router=useRouter(),level=Number(id),{language,localize,t}=useLanguage(),{user,refreshProfile}=useAuth();
  const[lesson,setLesson]=useState(null),[active,setActive]=useState(0),[passed,setPassed]=useState(false),[message,setMessage]=useState(""),[loading,setLoading]=useState(true);
  useEffect(()=>{getLesson(level).then(x=>{setLesson(x);setLoading(false)})},[level]);
  const blocks=lesson?.blocks||[],block=blocks[active];
  const progress=Math.round(((active+1)/Math.max(blocks.length,1))*100);
  async function complete(){
    if(!passed){setMessage(language==="vi"?"Cần hoàn thành checkpoint cuối bài.":"Complete the final checkpoint first.");setActive(blocks.length-1);return}
    if(supabase&&user){
      const{error}=await supabase.rpc("complete_lesson",{p_level_number:level,p_score:100});
      if(error){
        const now=new Date().toISOString();
        await supabase.from("user_progress").upsert({user_id:user.id,level_id:level,completed:true,earned_xp:lesson.xp_reward,completed_at:now,updated_at:now},{onConflict:"user_id,level_id"});
        await supabase.from("profiles").update({current_lesson:Math.min(level+1,100)}).eq("id",user.id);
      }
      await refreshProfile()
    }
    setMessage(language==="vi"?`Hoàn thành! +${lesson.xp_reward} XP và +20 xu.`:`Completed! +${lesson.xp_reward} XP and +20 coins.`)
  }
  if(loading)return <div className="loading"><div className="spinner"/></div>;
  return <AppShell>
    <header className={styles.header}><div><p className="eyebrow">LEVEL {level} · {lesson.cefr_level}</p><h1>{language==="vi"?(lesson.title_vi||lesson.title):lesson.title}</h1><p>{language==="vi"?(lesson.subtitle_vi||lesson.subtitle):lesson.subtitle}</p></div><NoriMascot size={115} speech={`${progress}%`}/></header>
    <div className={styles.progress}><div style={{width:`${progress}%`}}/></div>
    <div className={styles.layout}>
      <aside className={styles.nav}>{blocks.map((b,i)=><button key={i} className={i===active?styles.active:""} onClick={()=>setActive(i)}><span>{i+1}</span>{language==="vi"?(b.title_vi||b.title):b.title}</button>)}</aside>
      <section className={`card ${styles.content}`}>
        <Block block={block} language={language} onResult={r=>{if(block.type==="checkpoint")setPassed(r.passed)}}/>
        {message&&<div className={styles.message}>{message}</div>}
        <footer className={styles.footer}><button className="secondary" disabled={active===0} onClick={()=>setActive(x=>x-1)}>{t("previous")}</button>{active<blocks.length-1?<button className="primary" onClick={()=>setActive(x=>x+1)}>{t("continue")}</button>:<button className="primary" onClick={complete}>{t("complete")}</button>}</footer>
      </section>
    </div>
  </AppShell>
}

function Block({block,language,onResult}){
  const c=block?.content||{},title=language==="vi"?(block?.title_vi||block?.title):block?.title;
  if(!block)return null;
  if(block.type==="mission_brief")return <><p className="eyebrow">MISSION BRIEF</p><h2>{title}</h2><div className={styles.objectives}>{(c.objectives||[]).map((x,i)=><div key={i}><span>✓</span>{x}</div>)}</div></>;
  if(block.type==="flashcards")return <><p className="eyebrow">POWER-UP</p><h2>{title}</h2><RichExercise block={block}/></>;
  if(["practice","grammar","listening","reading","pronunciation","checkpoint"].includes(block.type))return <><p className="eyebrow">{block.type}</p><h2>{title}</h2>{c.explanation&&<p className="muted">{c.explanation}</p>}{c.passage&&<article className={styles.passage}>{c.passage}</article>}{c.transcript&&<details className={styles.detail}><summary>Transcript</summary><p>{c.transcript}</p></details>}<RichExercise block={block} onComplete={onResult}/></>;
  if(block.type==="speaking")return <><p className="eyebrow">SPEAKING PRODUCTION</p><h2>{title}</h2><div className={styles.prompt}>{c.prompt}</div><AudioButton text={c.model} label="Model answer"/><RichExercise block={{content:{exercises:[{type:"pronunciation",prompt:"Record your response.",text:c.model}]}}}/></>;
  if(block.type==="writing")return <><p className="eyebrow">WRITING PRODUCTION</p><h2>{title}</h2><div className={styles.prompt}>{c.prompt}</div><textarea className={styles.textarea} placeholder="Write your response..."/><ul>{(c.checklist||[]).map((x,i)=><li key={i}>{x}</li>)}</ul></>;
  if(block.type==="game")return <><p className="eyebrow">GAME CHALLENGE</p><h2>{title}</h2><div className={styles.gameCard}><GamepadText/><button className="primary" onClick={()=>location.href="/games/flappy-quiz"}>Open Flappy Quiz</button></div></>;
  return null
}
function GamepadText(){return <div><strong>3 gates → 1 question</strong><p className="muted">Correct answers keep the run alive and add bonus XP.</p></div>}
