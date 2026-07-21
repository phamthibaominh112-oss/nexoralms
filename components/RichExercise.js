"use client";
import {useMemo,useState} from "react";
import AudioButton from "@/components/AudioButton";
import styles from "./exercise.module.css";

const norm=v=>String(v??"").trim().toLowerCase().replace(/[.,!?]/g,"");

function sameSet(a,b){
  const aa=[...(a||[])].map(norm).sort();
  const bb=[...(b||[])].map(norm).sort();
  return aa.length===bb.length && aa.every((x,i)=>x===bb[i]);
}
function isCorrect(e,a){
  if(e.type==="multi_select") return sameSet(a,e.answer);
  if(e.type==="matching"){
    const expected=Object.fromEntries(e.pairs||[]);
    return Object.keys(expected).every(k=>norm(a?.[k])===norm(expected[k]));
  }
  if(e.type==="ordering"||e.type==="sentence_builder"){
    return JSON.stringify(a||[])===JSON.stringify(e.answer||[]);
  }
  if(e.type==="categorize"){
    return Object.entries(e.answer||{}).every(([k,v])=>norm(a?.[k])===norm(v));
  }
  return norm(a)===norm(e.answer);
}

export default function RichExercise({block,onComplete}){
  const data=block?.content||block||{};
  const exercises=data.exercises||[];
  const[answers,setAnswers]=useState({});
  const[checked,setChecked]=useState(false);
  const[flashIndex,setFlashIndex]=useState(0);
  const[flipped,setFlipped]=useState(false);

  const score=useMemo(
    ()=>exercises.reduce((sum,e,i)=>sum+(isCorrect(e,answers[i])?1:0),0),
    [answers,exercises]
  );

  function update(i,v){setAnswers(x=>({...x,[i]:v}));setChecked(false)}
  function check(){
    const currentScore=exercises.reduce((sum,e,i)=>sum+(isCorrect(e,answers[i])?1:0),0);
    setChecked(true);
    onComplete?.({
      score:currentScore,
      total:exercises.length,
      passed:currentScore===exercises.length,
      answers,
      results:exercises.map((exercise,index)=>({
        index,
        skill:exercise.skill||"general",
        level:exercise.level||1,
        correct:isCorrect(exercise,answers[index])
      }))
    });
  }

  if(data.cards?.length){
    const card=data.cards[flashIndex];
    return <section className={styles.flashWrap}>
      <button className={styles.flashCard} onClick={()=>setFlipped(!flipped)}>
        {!flipped
          ? <><small>{card.pronunciation}</small><strong>{card.front}</strong><AudioButton text={card.front}/></>
          : <><strong>{card.back}</strong><p>{card.example}</p></>}
      </button>
      <div className={styles.flashNav}>
        <button className="secondary" disabled={flashIndex===0} onClick={()=>{setFlashIndex(x=>x-1);setFlipped(false)}}>←</button>
        <span>{flashIndex+1}/{data.cards.length}</span>
        <button className="primary" disabled={flashIndex===data.cards.length-1} onClick={()=>{setFlashIndex(x=>x+1);setFlipped(false)}}>→</button>
      </div>
    </section>
  }

  return <section className={styles.wrap}>
    {exercises.map((e,i)=>{
      const correct=checked&&isCorrect(e,answers[i]);
      return <article className={`card ${styles.exercise}`} key={`${e.type}-${i}`}>
        <p className="eyebrow">{e.type.replaceAll("_"," ")} · {i+1}/{exercises.length}</p>
        <h3>{e.prompt}</h3>
        {e.audio_text&&<AudioButton text={e.audio_text} audioUrl={e.audio_url}/>}
        {e.type==="multiple_choice"&&<div className={styles.options}>{e.options.map(o=>{
          const selected=answers[i]===o;
          const optionCorrect=checked&&norm(o)===norm(e.answer);
          const wrong=checked&&selected&&!optionCorrect;
          return <button key={o} className={`${selected?styles.selected:""} ${optionCorrect?styles.correct:""} ${wrong?styles.wrong:""}`} onClick={()=>update(i,o)}>{o}</button>
        })}</div>}
        {e.type==="multi_select"&&<div className={styles.options}>{e.options.map(o=>{
          const arr=answers[i]||[],on=arr.includes(o);
          const shouldBe=checked&&(e.answer||[]).some(x=>norm(x)===norm(o));
          const wrong=checked&&on&&!shouldBe;
          return <button key={o} className={`${on?styles.selected:""} ${shouldBe?styles.correct:""} ${wrong?styles.wrong:""}`} onClick={()=>update(i,on?arr.filter(x=>x!==o):[...arr,o])}>{o}</button>
        })}</div>}
        {(e.type==="fill_blank"||e.type==="dictation"||e.type==="short_answer")&&<input className={styles.input} value={answers[i]||""} onChange={x=>update(i,x.target.value)} placeholder="Type your answer..."/>}
        {e.type==="matching"&&<div className={styles.matching}>{e.pairs.map(([l])=><label key={l}><strong>{l}</strong><select value={answers[i]?.[l]||""} onChange={x=>update(i,{...(answers[i]||{}),[l]:x.target.value})}><option value="">Choose...</option>{e.pairs.map(([,r])=><option key={r}>{r}</option>)}</select></label>)}</div>}
        {(e.type==="ordering"||e.type==="sentence_builder")&&<TokenBuilder items={e.items} value={answers[i]||[]} onChange={v=>update(i,v)}/>}
        {e.type==="categorize"&&<div className={styles.matching}>{e.items.map(item=><label key={item}><strong>{item}</strong><select value={answers[i]?.[item]||""} onChange={x=>update(i,{...(answers[i]||{}),[item]:x.target.value})}><option value="">Choose category</option>{e.categories.map(c=><option key={c}>{c}</option>)}</select></label>)}</div>}
        {e.type==="pronunciation"&&<PronunciationPractice text={e.text}/>}
        {e.type==="memory"&&<MemoryGame pairs={e.pairs}/>}
        {checked&&<p className={correct?styles.good:styles.feedback}>{correct?(e.correct_feedback||"Correct."):(e.explanation||`Correct answer: ${Array.isArray(e.answer)?e.answer.join(", "):e.answer}`)}</p>}
      </article>
    })}
    {exercises.length>0&&<div className={styles.footer}><button className="primary" onClick={check}>Check answers</button>{checked&&<strong className={score===exercises.length?styles.goodText:styles.badText}>{score}/{exercises.length}</strong>}</div>}
  </section>
}

function TokenBuilder({items=[],value=[],onChange}){const remain=items.filter((x,idx)=>!value.includes(x));return <><div className={styles.answerZone}>{value.map((x,i)=><button key={`${x}-${i}`} onClick={()=>onChange(value.filter((_,j)=>j!==i))}>{x}</button>)}</div><div className={styles.bank}>{remain.map((x,i)=><button key={`${x}-${i}`} onClick={()=>onChange([...value,x])}>{x}</button>)}</div></>}

function PronunciationPractice({text}){
  const[recording,setRecording]=useState(false),[status,setStatus]=useState("");
  async function record(){
    if(!navigator.mediaDevices){setStatus("Microphone unavailable.");return}
    const stream=await navigator.mediaDevices.getUserMedia({audio:true});
    const rec=new MediaRecorder(stream);
    rec.onstop=()=>{stream.getTracks().forEach(t=>t.stop());setStatus("Recording captured. Compare it with the model audio.")};
    rec.start();setRecording(true);
    setTimeout(()=>{rec.stop();setRecording(false)},5000)
  }
  return <div className={styles.pronounce}><AudioButton text={text} label="Model"/><button className="primary" onClick={record}>{recording?"Recording...":"Record 5s"}</button>{status&&<small>{status}</small>}</div>
}

function MemoryGame({pairs=[]}){
  const cards=pairs.flatMap(([a,b],i)=>[{id:`${i}a`,pair:i,text:a},{id:`${i}b`,pair:i,text:b}]);
  const[open,setOpen]=useState([]),[done,setDone]=useState([]);
  function flip(c){if(open.length===2||done.includes(c.pair)||open.some(x=>x.id===c.id))return;const next=[...open,c];setOpen(next);if(next.length===2)setTimeout(()=>{if(next[0].pair===next[1].pair)setDone(d=>[...d,c.pair]);setOpen([])},600)}
  return <div className={styles.memory}>{cards.map(c=><button key={c.id} onClick={()=>flip(c)} className={done.includes(c.pair)?styles.memoryDone:""}>{open.some(x=>x.id===c.id)||done.includes(c.pair)?c.text:"?"}</button>)}</div>
}
