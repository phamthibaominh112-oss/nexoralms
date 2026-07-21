"use client";
import {useLanguage} from "@/components/LanguageProvider";
import styles from "./ui.module.css";
export default function LanguageToggle(){const{language,setLanguage}=useLanguage();return <div className={styles.languageToggle}><button className={language==="en"?styles.active:""} onClick={()=>setLanguage("en")}>EN</button><button className={language==="vi"?styles.active:""} onClick={()=>setLanguage("vi")}>VI</button></div>}
