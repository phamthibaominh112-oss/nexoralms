"use client";
import {useEffect,useRef,useState} from "react";
import AppShell from "@/components/AppShell";
import NoriMascot from "@/components/NoriMascot";
import styles from "./flappy.module.css";

const questions=[
  {q:"Choose the correct sentence.",options:["I am a student.","I is a student.","I are a student."],a:0},
  {q:"Complete: She ___ from Korea.",options:["am","is","are"],a:1},
  {q:"Which word means 'your job'?",options:["hometown","occupation","interest"],a:1},
  {q:"Put the sentence together.",options:["I currently live in Hanoi.","I live currently Hanoi in.","Currently I in Hanoi live."],a:0}
];

export default function FlappyQuiz(){
  const canvasRef=useRef(null);
  const[state,setState]=useState("ready");
  const[score,setScore]=useState(0);
  const[gates,setGates]=useState(0);
  const[qIndex,setQIndex]=useState(0);
  const[feedback,setFeedback]=useState("");
  const engine=useRef({birdY:180,velocity:0,pipes:[],frame:0,running:false});

  useEffect(()=>{
    const canvas=canvasRef.current;if(!canvas)return;
    const ctx=canvas.getContext("2d");
    let raf;
    function reset(){engine.current={birdY:180,velocity:0,pipes:[{x:520,gapY:180,passed:false}],frame:0,running:true}}
    if(state==="playing")reset();
    function draw(){
      const e=engine.current;
      ctx.clearRect(0,0,canvas.width,canvas.height);
      const grad=ctx.createLinearGradient(0,0,0,canvas.height);grad.addColorStop(0,"#18204a");grad.addColorStop(1,"#312062");ctx.fillStyle=grad;ctx.fillRect(0,0,canvas.width,canvas.height);
      ctx.fillStyle="rgba(255,255,255,.15)";for(let i=0;i<20;i++)ctx.fillRect((i*83+e.frame)%canvas.width,(i*47)%canvas.height,2,2);
      e.pipes.forEach(p=>{ctx.fillStyle="#56d6b1";ctx.fillRect(p.x,0,58,p.gapY-70);ctx.fillRect(p.x,p.gapY+70,58,canvas.height-(p.gapY+70))});
      ctx.fillStyle="#f2a933";ctx.beginPath();ctx.arc(105,e.birdY,18,0,Math.PI*2);ctx.fill();ctx.fillStyle="#fff";ctx.beginPath();ctx.arc(111,e.birdY-5,6,0,Math.PI*2);ctx.fill();ctx.fillStyle="#172452";ctx.beginPath();ctx.arc(113,e.birdY-5,3,0,Math.PI*2);ctx.fill();
      ctx.fillStyle="#fff";ctx.font="700 18px system-ui";ctx.fillText(`Gates: ${gates}`,18,28);
      if(state!=="playing"){raf=requestAnimationFrame(draw);return}
      e.frame++;e.velocity+=.36;e.birdY+=e.velocity;
      e.pipes.forEach(p=>p.x-=2.8);
      if(e.pipes[e.pipes.length-1].x<300)e.pipes.push({x:540,gapY:115+Math.random()*160,passed:false});
      e.pipes=e.pipes.filter(p=>p.x>-70);
      for(const p of e.pipes){
        if(!p.passed&&p.x+58<105){p.passed=true;setGates(x=>{const next=x+1;setScore(s=>s+10);if(next%3===0){engine.current.running=false;setState("question")}return next})}
        if(105+18>p.x&&105-18<p.x+58&&(e.birdY-18<p.gapY-70||e.birdY+18>p.gapY+70)){setState("gameover")}
      }
      if(e.birdY>canvas.height-18||e.birdY<18)setState("gameover");
      raf=requestAnimationFrame(draw)
    }
    draw();
    function flap(){if(state==="playing")engine.current.velocity=-6.2}
    canvas.addEventListener("pointerdown",flap);
    window.addEventListener("keydown",e=>{if(e.code==="Space")flap()});
    return()=>{cancelAnimationFrame(raf);canvas.removeEventListener("pointerdown",flap)}
  },[state,gates]);

  function answer(i){
    if(i===questions[qIndex%questions.length].a){setFeedback("Correct! +25 XP");setScore(s=>s+25);setTimeout(()=>{setFeedback("");setQIndex(x=>x+1);setState("playing")},700)}
    else setFeedback("Not quite. Try again before continuing.")
  }

  return <AppShell><header className={styles.header}><div><p className="eyebrow">FLAPPY QUIZ</p><h1>Fly. Learn. Unlock.</h1><p>Pass three gates, then answer a question correctly to keep flying.</p></div><NoriMascot size={110} mood={state==="question"?"thinking":"happy"}/></header>
    <section className={styles.game}>
      <canvas ref={canvasRef} width="600" height="420"/>
      {state==="ready"&&<div className={styles.overlay}><h2>Ready?</h2><p>Click or press Space to flap.</p><button className="primary" onClick={()=>{setGates(0);setScore(0);setState("playing")}}>Start game</button></div>}
      {state==="question"&&<div className={styles.overlay}><p className="eyebrow">KNOWLEDGE GATE</p><h2>{questions[qIndex%questions.length].q}</h2><div className={styles.options}>{questions[qIndex%questions.length].options.map((o,i)=><button key={o} onClick={()=>answer(i)}>{o}</button>)}</div>{feedback&&<strong>{feedback}</strong>}</div>}
      {state==="gameover"&&<div className={styles.overlay}><h2>Mission over</h2><p>Score: {score} · Gates: {gates}</p><button className="primary" onClick={()=>{setGates(0);setScore(0);setState("playing")}}>Try again</button></div>}
    </section>
    <div className={styles.stats}><span>Score <strong>{score}</strong></span><span>Gates <strong>{gates}</strong></span><span>Next question <strong>{3-(gates%3)||3}</strong></span></div>
  </AppShell>
}
