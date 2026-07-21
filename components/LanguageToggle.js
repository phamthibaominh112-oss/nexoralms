"use client";
import {useLanguage} from "@/components/LanguageProvider";
import styles from "./ui.module.css";
export default function LanguageToggle(){
  const{language,setLanguage}=useLanguage();
  return <div className={styles.lang}><button className={language==="en"?styles.on:""} onClick={()=>setLanguage("en")}>EN</button><button className={language==="vi"?styles.on:""} onClick={()=>setLanguage("vi")}>VI</button></div>
}
