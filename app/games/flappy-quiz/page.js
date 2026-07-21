"use client";
import {useEffect,useRef,useState} from "react";
import AppShell from "@/components/AppShell";
import NoriMascot from "@/components/NoriMascot";
import styles from "./flappy.module.css";

const questions=[
  {q:"Choose the correct sentence.",options:["I am a student.","I is a student.","I are a student."],a:0},
  {q:"Complete: She ___ from Korea.",options:["am","is","are"],a:1},
  {q:"Which word means 'your job'?",options:["hometown","occupation","interest"],a:1},
  {q:"Which sentence is natural?",options:["I currently live in Hanoi.","I live currently Hanoi in.","Currently I in Hanoi live."],a:0},
  {q:"Select the correct form.",options:["They are ready.","They is ready.","They am ready."],a:0}
];

export default function FlappyQuiz(){
  const canvasRef=useRef(null);
  const[state,setState]=useState("ready");
  const[score,setScore]=useState(0);
  const[gates,setGates]=useState(0);
  const[qIndex,setQIndex]=useState(0);
  const[feedback,setFeedback]=useState("");
  const engine=useRef({birdY:210,velocity:0,pipes:[],frame:0});

  useEffect(()=>{
    const canvas=canvasRef.current;if(!canvas)return;
    const ctx=canvas.getContext("2d");
    let raf;
    function freshPipes(){
      return [
        {x:520,gapY:145,gap:155,passed:false,theme:0},
        {x:770,gapY:245,gap:145,passed:false,theme:1},
        {x:1020,gapY:180,gap:160,passed:false,theme:2}
      ];
    }
    if(state==="playing"&&engine.current.pipes.length===0){
      engine.current={birdY:210,velocity:0,pipes:freshPipes(),frame:0};
    }

    function drawNori(x,y){
      ctx.save();ctx.translate(x,y);
      const g=ctx.createLinearGradient(-20,-20,20,20);g.addColorStop(0,"#7547ff");g.addColorStop(1,"#e63ec6");
      ctx.fillStyle=g;ctx.beginPath();
      for(let i=0;i<16;i++){const a=i*Math.PI/8,r=i%2===0?23:17,px=Math.cos(a)*r,py=Math.sin(a)*r;i===0?ctx.moveTo(px,py):ctx.lineTo(px,py)}
      ctx.closePath();ctx.fill();
      ctx.fillStyle="#fff";ctx.beginPath();ctx.arc(-7,-4,6,0,Math.PI*2);ctx.arc(8,-4,6,0,Math.PI*2);ctx.fill();
      ctx.fillStyle="#172452";ctx.beginPath();ctx.arc(-5,-3,2.5,0,Math.PI*2);ctx.arc(6,-3,2.5,0,Math.PI*2);ctx.fill();
      ctx.strokeStyle="#fff";ctx.lineWidth=3;ctx.lineCap="round";ctx.beginPath();ctx.arc(0,5,9,.2,2.9);ctx.stroke();
      ctx.restore();
    }

    function draw(){
      const e=engine.current;
      ctx.clearRect(0,0,canvas.width,canvas.height);
      const grad=ctx.createLinearGradient(0,0,0,canvas.height);grad.addColorStop(0,"#131a3c");grad.addColorStop(1,"#39216a");ctx.fillStyle=grad;ctx.fillRect(0,0,canvas.width,canvas.height);
      for(let i=0;i<35;i++){ctx.fillStyle=`rgba(255,255,255,${.08+(i%4)*.03})`;ctx.fillRect((i*97+e.frame*.3)%canvas.width,(i*61)%canvas.height,2,2)}
      ctx.fillStyle="rgba(255,255,255,.05)";ctx.fillRect(0,canvas.height-55,canvas.width,55);

      e.pipes.forEach((p,idx)=>{
        const colors=[["#56d6b1","#2ea983"],["#4bc6d9","#2d8ea0"],["#f2a933","#c27b14"]][p.theme%3];
        const pg=ctx.createLinearGradient(p.x,0,p.x+64,0);pg.addColorStop(0,colors[0]);pg.addColorStop(1,colors[1]);
        ctx.fillStyle=pg;
        ctx.fillRect(p.x,0,64,p.gapY-p.gap/2);
        ctx.fillRect(p.x,p.gapY+p.gap/2,64,canvas.height-(p.gapY+p.gap/2));
        ctx.fillStyle="rgba(255,255,255,.22)";
        ctx.fillRect(p.x+7,0,7,p.gapY-p.gap/2);
        ctx.fillRect(p.x+7,p.gapY+p.gap/2,7,canvas.height);
      });
      drawNori(108,e.birdY);
      ctx.fillStyle="#fff";ctx.font="800 18px system-ui";ctx.fillText(`Gates ${gates}`,18,28);ctx.fillText(`Score ${score}`,18,52);

      if(state==="playing"){
        e.frame++;e.velocity+=.34;e.birdY+=e.velocity;
        e.pipes.forEach(p=>p.x-=3.15);
        const last=e.pipes[e.pipes.length-1];
        if(last&&last.x<canvas.width-235){
          const theme=(last.theme+1)%3;
          e.pipes.push({x:last.x+245,gapY:115+Math.random()*205,gap:140+Math.random()*35,passed:false,theme});
        }
        e.pipes=e.pipes.filter(p=>p.x>-90);
        for(const p of e.pipes){
          if(!p.passed&&p.x+64<108){
            p.passed=true;
            setGates(x=>{
              const next=x+1;setScore(s=>s+10);
              if(next%3===0)setState("question");
              return next
            });
          }
          if(108+20>p.x&&108-20<p.x+64&&(e.birdY-20<p.gapY-p.gap/2||e.birdY+20>p.gapY+p.gap/2))setState("gameover");
        }
        if(e.birdY>canvas.height-22||e.birdY<22)setState("gameover");
      }
      raf=requestAnimationFrame(draw);
    }
    draw();
    function flap(){if(state==="playing")engine.current.velocity=-6.4}
    canvas.addEventListener("pointerdown",flap);
    const key=e=>{if(e.code==="Space"){e.preventDefault();flap()}};
    window.addEventListener("keydown",key);
    return()=>{cancelAnimationFrame(raf);canvas.removeEventListener("pointerdown",flap);window.removeEventListener("keydown",key)}
  },[state,gates,score]);

  function start(){
    engine.current={birdY:210,velocity:0,pipes:[],frame:0};
    setGates(0);setScore(0);setQIndex(0);setFeedback("");setState("playing");
  }
  function answer(i){
    if(i===questions[qIndex%questions.length].a){
      setFeedback("Correct! +25 bonus points");
      setScore(s=>s+25);
      setTimeout(()=>{setFeedback("");setQIndex(x=>x+1);setState("playing")},650);
    } else setFeedback("Not yet. Choose the correct answer to continue.");
  }

  return <AppShell>
    <header className={styles.header}><div><p className="eyebrow">FLAPPY NORI</p><h1>Fly. Learn. Unlock.</h1><p>Nori flies through varied gates. Every three gates opens a knowledge lock.</p></div><NoriMascot size={110} mood={state==="question"?"thinking":"happy"}/></header>
    <section className={styles.game}>
      <canvas ref={canvasRef} width="760" height="470"/>
      {state==="ready"&&<div className={styles.overlay}><h2>Ready, Nori?</h2><p>Click the game or press Space to fly.</p><button className="primary" onClick={start}>Start game</button></div>}
      {state==="question"&&<div className={styles.overlay}><p className="eyebrow">KNOWLEDGE LOCK</p><h2>{questions[qIndex%questions.length].q}</h2><div className={styles.options}>{questions[qIndex%questions.length].options.map((o,i)=><button key={o} onClick={()=>answer(i)}>{o}</button>)}</div>{feedback&&<strong>{feedback}</strong>}</div>}
      {state==="gameover"&&<div className={styles.overlay}><h2>Run complete</h2><p>Score: {score} · Gates: {gates}</p><button className="primary" onClick={start}>Try again</button></div>}
    </section>
    <div className={styles.stats}><span>Score <strong>{score}</strong></span><span>Gates <strong>{gates}</strong></span><span>Next lock <strong>{3-(gates%3)||3}</strong></span></div>
  </AppShell>
}
