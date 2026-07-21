"use client";
import {useEffect,useMemo,useState} from "react";
import {useParams} from "next/navigation";
import {Clock3,Flag,ChevronLeft,ChevronRight,Volume2} from "lucide-react";
import AppShell from "@/components/AppShell";
import AudioButton from "@/components/AudioButton";
import styles from "./exam.module.css";

const readingPassage=`Urban green infrastructure includes parks, street trees, green roofs and restored waterways. Researchers have linked access to these spaces with lower temperatures, increased physical activity and improved mental wellbeing. Yet the benefits are not distributed equally. In many cities, wealthier neighbourhoods have better maintained green spaces, while lower-income communities face limited access or poorer facilities. Effective policy therefore requires not only increasing the quantity of green space but also improving accessibility, safety and long-term maintenance.`;

const data={
 reading:{title:"Academic Reading Practice Test 1",duration:60,passage:readingPassage,questions:[
 {type:"multiple_choice",prompt:"What is the main purpose of the passage?",options:["To argue that all parks are unsafe","To explain benefits and equity issues in urban green space","To describe how to build green roofs"],answer:"To explain benefits and equity issues in urban green space"},
 {type:"true_false_not_given",prompt:"All neighbourhoods have equal access to well-maintained green spaces.",options:["TRUE","FALSE","NOT GIVEN"],answer:"FALSE"},
 {type:"fill_blank",prompt:"Policy must consider accessibility, safety and long-term ________.",answer:"maintenance"}
 ]},
 listening:{title:"Listening Practice Test 1",duration:30,transcript:"Good morning. The museum tour begins at ten thirty beside the main information desk. Please bring your booking confirmation.",questions:[
 {type:"fill_blank",prompt:"The tour begins at ________.",answer:"ten thirty"},
 {type:"multiple_choice",prompt:"Where should visitors meet?",options:["At the café","Beside the information desk","Outside the museum"],answer:"Beside the information desk"}
 ]},
 writing:{title:"Academic Writing Practice Test 1",duration:60,tasks:[
 {label:"Task 1",prompt:"The chart shows the percentage of commuters using four transport methods in 2000 and 2025. Summarise the main features and make comparisons."},
 {label:"Task 2",prompt:"Some people believe cities should invest more in public transport than in new roads. To what extent do you agree or disagree?"}
 ]},
 speaking:{title:"Speaking Practice Test 1",duration:14,tasks:[
 {label:"Part 1",prompt:"Let's talk about your hometown. What do you like most about it?"},
 {label:"Part 2",prompt:"Describe a useful skill you learned. You should say what it was, how you learned it, why it was useful, and explain how you felt about learning it."},
 {label:"Part 3",prompt:"How has technology changed the way people learn practical skills?"}
 ]}
};

export default function Exam(){
 const{skill}=useParams(),exam=data[skill]||data.reading;
 const[seconds,setSeconds]=useState(exam.duration*60),[index,setIndex]=useState(0),[answers,setAnswers]=useState({}),[flagged,setFlagged]=useState([]),[submitted,setSubmitted]=useState(false);
 useEffect(()=>{const timer=setInterval(()=>setSeconds(x=>Math.max(0,x-1)),1000);return()=>clearInterval(timer)},[]);
 const time=`${String(Math.floor(seconds/60)).padStart(2,"0")}:${String(seconds%60).padStart(2,"0")}`;
 const qs=exam.questions||exam.tasks||[],q=qs[index];
 function update(v){setAnswers(x=>({...x,[index]:v}))}
 const score=useMemo(()=>exam.questions?exam.questions.reduce((s,x,i)=>s+(String(answers[i]||"").trim().toLowerCase()===String(x.answer).toLowerCase()?1:0),0):0,[answers,exam]);
 return <AppShell><section className={styles.exam}>
   <header className={styles.top}><div><strong>{exam.title}</strong><small>Section {skill}</small></div><div className={styles.timer}><Clock3 size={17}/>{time}</div><button className="primary" onClick={()=>setSubmitted(true)}>Submit test</button></header>
   <div className={styles.navigator}>{qs.map((_,i)=><button key={i} onClick={()=>setIndex(i)} className={`${i===index?styles.current:""} ${answers[i]?styles.answered:""} ${flagged.includes(i)?styles.flagged:""}`}>{i+1}</button>)}</div>
   <div className={styles.workspace}>
    {(skill==="reading"||skill==="listening")&&<article className={styles.source}>
      {skill==="listening"?<><h2>Section audio</h2><AudioButton text={exam.transcript}/><details><summary>Transcript for demo</summary><p>{exam.transcript}</p></details></>:<><h2>Reading Passage 1</h2><p>{exam.passage}</p></>}
    </article>}
    <section className={styles.question}>
      <div className={styles.qhead}><span>Question {index+1}</span><button onClick={()=>setFlagged(x=>x.includes(index)?x.filter(v=>v!==index):[...x,index])}><Flag size={16}/> Review</button></div>
      <h2>{q.prompt}</h2>
      {q.options?<div className={styles.options}>{q.options.map(o=><label key={o}><input type="radio" name={`q${index}`} checked={answers[index]===o} onChange={()=>update(o)}/><span>{o}</span></label>)}</div>:skill==="writing"?<textarea value={answers[index]||""} onChange={e=>update(e.target.value)} placeholder="Write your response..."/>:skill==="speaking"?<SpeakingBox prompt={q.prompt}/>:<input className={styles.answer} value={answers[index]||""} onChange={e=>update(e.target.value)} placeholder="Type your answer"/>}
      {(skill==="writing")&&<small>Word count: {(answers[index]||"").trim().split(/\s+/).filter(Boolean).length}</small>}
    </section>
   </div>
   <footer className={styles.bottom}><button className="secondary" disabled={index===0} onClick={()=>setIndex(x=>x-1)}><ChevronLeft/> Previous</button><button className="primary" disabled={index===qs.length-1} onClick={()=>setIndex(x=>x+1)}>Next <ChevronRight/></button></footer>
   {submitted&&<div className={styles.modal}><div><h2>Test submitted</h2><p>{exam.questions?`Demo score: ${score}/${exam.questions.length}`:"Writing/Speaking saved for review."}</p><button className="primary" onClick={()=>setSubmitted(false)}>Review answers</button></div></div>}
 </section></AppShell>
}
function SpeakingBox({prompt}){const[recording,setRecording]=useState(false);async function record(){const stream=await navigator.mediaDevices.getUserMedia({audio:true});const r=new MediaRecorder(stream);r.start();setRecording(true);setTimeout(()=>{r.stop();stream.getTracks().forEach(t=>t.stop());setRecording(false)},10000)}return <div className={styles.speaking}><p>{prompt}</p><button className="primary" onClick={record}>{recording?"Recording 10 seconds...":"Record response"}</button></div>}
