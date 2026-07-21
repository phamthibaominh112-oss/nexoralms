"use client";
import styles from "./mascot.module.css";

export default function NoriMascot({ mood="idle", size=112, speech }) {
  const eyeY = mood==="thinking" ? 49 : 47;
  return (
    <div className={styles.wrap}>
      {speech && <div className={styles.bubble}>{speech}</div>}
      <svg width={size} height={size} viewBox="0 0 140 140" role="img" aria-label="Nori, Nexora AI learning companion">
        <defs>
          <linearGradient id="shell" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#6c63ff"/>
            <stop offset="100%" stopColor="#d83ed3"/>
          </linearGradient>
          <linearGradient id="visor" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#18234f"/>
            <stop offset="100%" stopColor="#0d1231"/>
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2.5" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>
        <circle cx="70" cy="70" r="58" fill="rgba(117,71,255,.08)"/>
        <path d="M70 10 88 18 104 14 112 30 127 40 123 59 131 73 120 89 118 108 99 113 87 127 70 119 52 127 40 113 21 108 19 89 8 73 16 59 12 40 27 30 35 14 52 18Z" fill="url(#shell)"/>
        <path d="M31 44Q70 20 109 44L104 91Q70 112 36 91Z" fill="url(#visor)" stroke="#96a6ff" strokeWidth="2"/>
        <circle cx="49" cy={eyeY} r="12" fill="#fff"/>
        <circle cx="91" cy={eyeY} r="12" fill="#fff"/>
        <circle cx="49" cy={eyeY} r="5.5" fill="#50d9ff" filter="url(#glow)"/>
        <circle cx="91" cy={eyeY} r="5.5" fill="#50d9ff" filter="url(#glow)"/>
        <path d="M58 74Q70 82 82 74" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round"/>
        <path d="M65 63 75 63 70 69Z" fill="#f4c95d"/>
        <path d="M42 101 29 111M98 101 111 111" stroke="#9dd9ff" strokeWidth="5" strokeLinecap="round"/>
        <path d="M70 18V7" stroke="#b6c3ff" strokeWidth="4" strokeLinecap="round"/>
        <circle cx="70" cy="5" r="4" fill="#50d9ff" filter="url(#glow)"/>
        <path d="M48 33 39 24M92 33 101 24" stroke="#c8d0ff" strokeWidth="4" strokeLinecap="round"/>
        <path d="M45 115Q70 129 95 115" fill="none" stroke="#d9dcff" strokeWidth="4" strokeLinecap="round"/>
      </svg>
    </div>
  );
}
