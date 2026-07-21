"use client";
import{useState}from"react";
import{useRouter}from"next/navigation";
import AppShell from"@/components/AppShell";
import RichExercise from"@/components/RichExercise";
import NoriMascot from"@/components/NoriMascot";
import{placementQuestions}from"@/lib/placementData";
import{useLanguage}from"@/components/LanguageProvider";
import{useAuth}from"@/components/AuthProvider";
import{supabase}from"@/lib/supabase";
import styles from"./placement.module.css";

const skillNames={grammar:"Grammar",vocabulary:"Vocabulary",reading:"Reading",listening:"Listening"};

export default function Placement(){
  const{language}=useLanguage(),vi=language==="vi",router=useRouter(),{user,setProfile}=useAuth();
  const[started,setStarted]=useState(false),[result,setResult]=useState(null);

  async function finish(r){
    const bySkill={};
    for(const skill of Object.keys(skillNames)){
      const rows=(r.results||[]).filter(x=>x.skill===skill);
      bySkill[skill]={correct:rows.filter(x=>x.correct).length,total:rows.length};
    }
    const weighted=(bySkill.grammar.correct/Math.max(1,bySkill.grammar.total))*.25+
      (bySkill.vocabulary.correct/Math.max(1,bySkill.vocabulary.total))*.20+
      (bySkill.reading.correct/Math.max(1,bySkill.reading.total))*.30+
      (bySkill.listening.correct/Math.max(1,bySkill.listening.total))*.25;

    let level=1,cefr="Pre-A1",ielts="Below 3.5";
    if(weighted>=.88){level=71;cefr="C1";ielts="7.0–8.0"}
    else if(weighted>=.74){level=56;cefr="B2";ielts="5.5–6.5"}
    else if(weighted>=.58){level=36;cefr="B1";ielts="4.5–5.0"}
    else if(weighted>=.42){level=21;cefr="A2";ielts="3.5–4.0"}
    else if(weighted>=.25){level=11;cefr="A1";ielts="3.0–3.5"}

    const strengths=Object.entries(bySkill).sort((a,b)=>(b[1].correct/b[1].total)-(a[1].correct/a[1].total));
    const out={...r,level,cefr,ielts,weighted,bySkill,strength:strengths[0][0],priority:strengths[strengths.length-1][0]};
    setResult(out);

    if(supabase&&user){
      await supabase.from("placement_attempts").insert({
        user_id:user.id,score:r.score,total_questions:r.total,recommended_level:level,
        estimated_cefr:cefr,estimated_ielts:ielts,skill_profile:bySkill
      });
      const{data}=await supabase.from("profiles").update({current_lesson:level,placement_completed:true}).eq("id",user.id).select().single();
      if(data)setProfile(data);
    }
  }

  if(result)return <AppShell><section className={styles.result}>
    <NoriMascot size={145} mood="celebrate" speech={vi?"Đã có ma trận năng lực của bạn!":"Your skill matrix is ready!"}/>
    <p className="eyebrow">PLACEMENT MATRIX</p><h1>{result.cefr}</h1>
    <div className={styles.resultGrid}><article><span>IELTS range</span><strong>{result.ielts}</strong></article><article><span>{vi?"Level đề xuất":"Recommended level"}</span><strong>{result.level}</strong></article><article><span>{vi?"Điểm tổng":"Overall score"}</span><strong>{result.score}/{result.total}</strong></article></div>
    <div className={`card ${styles.matrix}`}>
      <h2>{vi?"Ma trận kỹ năng":"Skill matrix"}</h2>
      {Object.entries(result.bySkill).map(([skill,data])=>{
        const pct=Math.round(data.correct/data.total*100);
        return <div className={styles.matrixRow} key={skill}><span>{skillNames[skill]}</span><div><i style={{width:`${pct}%`}}/></div><strong>{pct}%</strong></div>
      })}
      <p><b>{vi?"Điểm mạnh":"Strength"}:</b> {skillNames[result.strength]} · <b>{vi?"Ưu tiên":"Priority"}:</b> {skillNames[result.priority]}</p>
    </div>
    <button className="primary" onClick={()=>router.push(`/level/${result.level}`)}>{vi?"Bắt đầu lộ trình":"Start recommended path"}</button>
  </section></AppShell>;

  if(!started)return <AppShell><section className={styles.intro}><div>
    <p className="eyebrow">{vi?"PLACEMENT TEST 4 KỸ NĂNG":"FOUR-SKILL PLACEMENT TEST"}</p>
    <h1>{vi?"Một bài test có ma trận, không phải vài câu đoán level":"A diagnostic matrix, not a handful of guesses"}</h1>
    <p>{vi?"40 câu hỏi kiểm tra Grammar, Vocabulary, Reading và Listening theo bốn tầng độ khó. Kết quả tạo CEFR, IELTS range, level bắt đầu, điểm mạnh và kỹ năng ưu tiên.":"40 questions assess Grammar, Vocabulary, Reading and Listening across four difficulty bands. The report produces CEFR, IELTS range, starting level, strength and priority skill."}</p>
    <ul><li>40 questions</li><li>4 skills × 4 difficulty bands</li><li>Weighted diagnostic matrix</li><li>Recommended starting level</li><li>Stored attempt history</li></ul>
    <button className="primary" onClick={()=>setStarted(true)}>{vi?"Bắt đầu bài test":"Start diagnostic"}</button>
  </div><NoriMascot size={220} mood="thinking"/></section></AppShell>;

  return <AppShell><header className={styles.header}><p className="eyebrow">PLACEMENT TEST · 40 QUESTIONS</p><h1>{vi?"Hoàn thành toàn bộ ma trận":"Complete the full diagnostic"}</h1></header><RichExercise block={{content:{exercises:placementQuestions}}} onComplete={finish}/></AppShell>
}
