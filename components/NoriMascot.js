"use client";
import styles from "./mascot.module.css";

export default function NoriMascot({ mood="happy", size=110, speech }) {
  return (
    <div className={styles.wrap}>
      {speech && <div className={styles.bubble}>{speech}</div>}
      <svg width={size} height={size} viewBox="0 0 120 120" role="img" aria-label="Nori, the Nexora mascot">
        <defs>
          <linearGradient id="noriBody" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#7547ff"/>
            <stop offset="100%" stopColor="#e63ec6"/>
          </linearGradient>
        </defs>
        <path d="M60 6 71 22 92 18 89 39 108 49 94 64 104 84 82 86 72 108 55 94 35 108 29 86 7 82 20 63 7 47 27 38 25 17 47 22Z" fill="url(#noriBody)"/>
        <circle cx="45" cy="53" r="13" fill="#fff"/>
        <circle cx="76" cy="53" r="13" fill="#fff"/>
        <circle cx="48" cy="55" r="6" fill="#172452"/>
        <circle cx="73" cy="55" r="6" fill="#172452"/>
        {mood==="happy" && <path d="M42 75 Q60 91 79 75" fill="none" stroke="#fff" strokeWidth="6" strokeLinecap="round"/>}
        {mood==="thinking" && <path d="M46 80 Q60 72 75 80" fill="none" stroke="#fff" strokeWidth="5" strokeLinecap="round"/>}
        {mood==="celebrate" && <>
          <path d="M41 75 Q60 94 80 75" fill="none" stroke="#fff" strokeWidth="6" strokeLinecap="round"/>
          <circle cx="18" cy="16" r="4" fill="#f2a933"/><circle cx="104" cy="23" r="4" fill="#4bc6d9"/>
        </>}
        <path d="M56 66 64 66 60 71Z" fill="#f8d36c"/>
      </svg>
    </div>
  );
}
