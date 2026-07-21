"use client";
import {useState} from "react";
import {Volume2,Square} from "lucide-react";
export default function AudioButton({text,audioUrl,label="Listen"}){
  const[playing,setPlaying]=useState(false);
  function stop(){window.speechSynthesis?.cancel();setPlaying(false)}
  function play(){
    if(audioUrl){const a=new Audio(audioUrl);a.onplay=()=>setPlaying(true);a.onended=()=>setPlaying(false);a.play();return}
    if(!text||!("speechSynthesis"in window))return;
    const voices=window.speechSynthesis.getVoices();
    const preferred=voices.find(v=>/Google UK English Female|Microsoft Sonia|Samantha|Karen/i.test(v.name))||voices.find(v=>v.lang?.startsWith("en"));
    const u=new SpeechSynthesisUtterance(text);u.lang="en-GB";u.rate=.88;if(preferred)u.voice=preferred;u.onstart=()=>setPlaying(true);u.onend=()=>setPlaying(false);u.onerror=()=>setPlaying(false);window.speechSynthesis.cancel();window.speechSynthesis.speak(u)
  }
  return <button type="button" className="secondary" onClick={playing?stop:play}>{playing?<Square size={16}/>:<Volume2 size={17}/>} {playing?"Stop":label}</button>
}
