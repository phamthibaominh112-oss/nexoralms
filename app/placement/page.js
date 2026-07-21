"use client";
import{useState}from"react";
import{useRouter}from"next/navigation";
import AppShell from"@/components/AppShell";
import RichExercise from"@/components/RichExercise";
import NoriMascot from"@/components/NoriMascot";
import{placementQuestions}from"@/lib/demo";
import{useLanguage}from"@/components/LanguageProvider";
import{useAuth}from"@/components/AuthProvider";
import{supabase}from"@/lib/supabase";
import styles from"./placement.module.css";

export default function Placement(){
  const{language}=useLanguage(),vi=language==="vi",router=useRouter(),{user,setProfile}=useAuth();
  const[started,setStarted]=useState(false),[result,setResult]=useState(null);
  async function finish(r){
    const ratio=r.total?r.score/r.total:0;
    const level=ratio<.3?1:ratio<.5?11:ratio<.7?31:ratio<.88?51:71;
    const cefr=level===1?"Pre-A1":level===11?"A1":level===31?"B1":level===51?"B2":"C1";
    const ielts=level===1?"Below 3.5":level===11?"3.5–4.0":level===31?"4.5–5.0":level===51?"5.5–6.5":"7.0+";
    const out={...r,level,cefr,ielts};setResult(out);
    if(supabase&&user){
      await supabase.from("placement_attempts").insert({user_id:user.id,score:r.score,total_questions:r.total,recommended_level:level,estimated_cefr:cefr,estimated_ielts:ielts});
      const{data}=await supabase.from("profiles").update({current_lesson:level,placement_completed:true}).eq("id",user.id).select().single();
      if(data)setProfile(data);
    }
  }
  if(result)return <AppShell><section className={styles.result}><NoriMascot size={145} mood="celebrate" speech={vi?"Mình đã tìm được điểm bắt đầu phù hợp!":"I found your best starting point!"}/><p className="eyebrow">PLACEMENT RESULT</p><h1>{result.cefr}</h1><div className={styles.resultGrid}><article><span>IELTS range</span><strong>{result.ielts}</strong></article><article><span>{vi?"Level đề xuất":"Recommended level"}</span><strong>{result.level}</strong></article><article><span>{vi?"Điểm":"Score"}</span><strong>{result.score}/{result.total}</strong></article></div><button className="primary" onClick={()=>router.push(`/level/${result.level}`)}>{vi?"Bắt đầu lộ trình":"Start recommended path"}</button></section></AppShell>;
  if(!started)return <AppShell><section className={styles.intro}><div><p className="eyebrow">{vi?"KIỂM TRA ĐẦU VÀO":"DIAGNOSTIC PLACEMENT"}</p><h1>{vi?"Đừng tự đoán level của mình":"Don't guess your starting point"}</h1><p>{vi?"Bài test thích ứng kiểm tra grammar, vocabulary và reading. Kết quả đề xuất CEFR, IELTS range và level bắt đầu.":"An adaptive diagnostic checks grammar, vocabulary and reading, then recommends CEFR, IELTS range and starting level."}</p><ul><li>8 diagnostic questions in this starter package</li><li>Expandable to listening and speaking</li><li>Stores attempts and recommended level</li></ul><button className="primary" onClick={()=>setStarted(true)}>{vi?"Bắt đầu test":"Start placement test"}</button></div><NoriMascot size={220} mood="thinking"/></section></AppShell>;
  return <AppShell><header className={styles.header}><p className="eyebrow">PLACEMENT TEST</p><h1>{vi?"Làm hết các câu hỏi":"Complete all questions"}</h1></header><RichExercise block={{content:{exercises:placementQuestions}}} onComplete={finish}/></AppShell>
}
