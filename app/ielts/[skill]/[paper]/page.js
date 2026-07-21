"use client";
import {useEffect,useMemo,useState} from "react";
import {useParams} from "next/navigation";
import {Clock3,Flag,ChevronLeft,ChevronRight} from "lucide-react";
import AppShell from "@/components/AppShell";
import AudioButton from "@/components/AudioButton";
import {ieltsMockData} from "@/lib/ieltsMockData";
import styles from "./exam.module.css";

export default function Exam(){
  const{skill}=useParams();
  const exam=ieltsMockData[skill]||ieltsMockData.reading;
  const[seconds,setSeconds]=useState(exam.duration*60);
  const[index,setIndex]=useState(0);
  const[answers,setAnswers]=useState({});
  const[flagged,setFlagged]=useState([]);
  const[submitted,setSubmitted]=useState(false);

  useEffect(()=>{const timer=setInterval(()=>setSeconds(x=>Math.max(0,x-1)),1000);return()=>clearInterval(timer)},[]);
  const time=`${String(Math.floor(seconds/60)).padStart(2,"0")}:${String(seconds%60).padStart(2,"0")}`;
  const qs=exam.questions||exam.tasks||[],q=qs[index];
  const sectionNumber=q?.section||index+1;
  const section=exam.sections?.[sectionNumber-1];
  const score=useMemo(()=>exam.questions?exam.questions.reduce((s,x,i)=>s+(String(answers[i]||"").trim().toLowerCase()===String(x.answer).trim().toLowerCase()?1:0),0):0,[answers,exam]);

  function update(v){setAnswers(x=>({...x,[index]:v}))}

  return <AppShell><section className={styles.exam}>
    <header className={styles.top}>
      <div><strong>{exam.title}</strong><small>{String(skill).toUpperCase()} · {qs.length} questions/tasks</small></div>
      <div className={styles.timer}><Clock3 size={17}/>{time}</div>
      <button className="primary" onClick={()=>setSubmitted(true)}>Submit test</button>
    </header>

    <div className={styles.navigator}>{qs.map((item,i)=><button key={i} title={`Question ${i+1}`} onClick={()=>setIndex(i)} className={`${i===index?styles.current:""} ${answers[i]?styles.answered:""} ${flagged.includes(i)?styles.flagged:""}`}>{i+1}</button>)}</div>

    <div className={styles.workspace}>
      {(skill==="reading"||skill==="listening")&&<article className={styles.source}>
        {skill==="reading"
          ? <><p className="eyebrow">READING PASSAGE {sectionNumber}</p><h2>{section?.title}</h2><p className={styles.passageText}>{section?.text}</p></>
          : <><p className="eyebrow">LISTENING SECTION {sectionNumber}</p><h2>{section?.title}</h2><AudioButton text={section?.transcript} label={`Play Section ${sectionNumber}`}/><div className={styles.audioNotice}>In production, use one uploaded audio file per section. Browser speech is only the demo fallback.</div><details><summary>Demo transcript</summary><p>{section?.transcript}</p></details></>}
      </article>}

      <section className={styles.question}>
        <div className={styles.qhead}><span>{q?.label||`Question ${index+1} of ${qs.length}`}</span><button onClick={()=>setFlagged(x=>x.includes(index)?x.filter(v=>v!==index):[...x,index])}><Flag size={16}/> Flag for review</button></div>
        <h2>{q?.prompt}</h2>

        {q?.options?.length
          ? <div className={styles.options}>{q.options.map(o=><label key={o}><input type="radio" name={`q${index}`} checked={answers[index]===o} onChange={()=>update(o)}/><span>{o}</span></label>)}</div>
          : skill==="writing"
            ? <><textarea value={answers[index]||""} onChange={e=>update(e.target.value)} placeholder="Write your response here..."/><div className={styles.wordCount}>Word count: {(answers[index]||"").trim().split(/\s+/).filter(Boolean).length} · Minimum: {q.minimum_words}</div></>
            : skill==="speaking"
              ? <SpeakingBox task={q}/>
              : <input className={styles.answer} value={answers[index]||""} onChange={e=>update(e.target.value)} placeholder="Type your answer"/>}
      </section>
    </div>

    <footer className={styles.bottom}>
      <button className="secondary" disabled={index===0} onClick={()=>setIndex(x=>x-1)}><ChevronLeft/> Previous</button>
      <div>{Object.keys(answers).length}/{qs.length} answered · {flagged.length} flagged</div>
      <button className="primary" disabled={index===qs.length-1} onClick={()=>setIndex(x=>x+1)}>Next <ChevronRight/></button>
    </footer>

    {submitted&&<div className={styles.modal}><div><h2>Test submitted</h2><p>{exam.questions?`Demo raw score: ${score}/${exam.questions.length}`:"Writing/Speaking responses are ready for examiner or AI review."}</p><p>{Object.keys(answers).length} of {qs.length} responses completed.</p><button className="primary" onClick={()=>setSubmitted(false)}>Return to review</button></div></div>}
  </section></AppShell>
}

function SpeakingBox({task}){
  const[recording,setRecording]=useState(false);
  const[status,setStatus]=useState("");
  async function record(){
    try{
      const stream=await navigator.mediaDevices.getUserMedia({audio:true});
      const r=new MediaRecorder(stream);
      const chunks=[];
      r.ondataavailable=e=>chunks.push(e.data);
      r.onstop=()=>{stream.getTracks().forEach(t=>t.stop());setStatus("Response recorded for this demo session.")};
      r.start();setRecording(true);
      setTimeout(()=>{r.stop();setRecording(false)},15000);
    }catch{setStatus("Microphone permission is required.")}
  }
  return <div className={styles.speaking}>
    {task.prep_seconds>0&&<div className={styles.prep}>Preparation time: {task.prep_seconds} seconds</div>}
    <p>{task.prompt}</p>
    <button className="primary" onClick={record}>{recording?"Recording 15 seconds...":"Record response"}</button>
    {status&&<small>{status}</small>}
  </div>
}
