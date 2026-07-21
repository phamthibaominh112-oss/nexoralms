"use client";
import Link from "next/link";
import { LayoutDashboard, Map, GraduationCap, Gamepad2, ClipboardCheck, User, LogOut, Gem, Heart, Flame, Menu } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useLanguage } from "@/components/LanguageProvider";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/lib/supabase";
import LanguageToggle from "@/components/LanguageToggle";
import NoriMascot from "@/components/NoriMascot";
import styles from "./shell.module.css";

export default function AppShell({children}){
  const path=usePathname(),router=useRouter(),{t}=useLanguage(),{user,profile}=useAuth();
  const links=[
    ["/dashboard",t("dashboard"),LayoutDashboard],
    ["/placement",t("placement"),ClipboardCheck],
    ["/roadmap",t("roadmap"),Map],
    ["/ielts",t("ielts"),GraduationCap],
    ["/games",t("games"),Gamepad2],
    ["/onboarding",t("profile"),User]
  ];
  async function signOut(){if(supabase)await supabase.auth.signOut();router.replace("/")}
  return <div className={styles.layout}>
    <aside className={styles.sidebar}>
      <Link href="/" className={styles.brand}><span>N</span><div><strong>NEXORA</strong><small>Road to IELTS 8.0</small></div></Link>
      <div className={styles.mascot}><NoriMascot size={76}/><small>Nori</small></div>
      <nav>{links.map(([href,label,Icon])=><Link key={href} href={href} className={path.startsWith(href)?styles.active:""}><Icon size={18}/>{label}</Link>)}</nav>
      <div className={styles.resources}>
        <span><Heart size={15}/> {profile?.hearts??5}</span>
        <span><Gem size={15}/> {profile?.coins??0}</span>
        <span><Flame size={15}/> {profile?.streak_days??0}</span>
      </div>
      <div className={styles.bottom}><LanguageToggle/><strong>{profile?.full_name||user?.email?.split("@")[0]||"Learner"}</strong>{user&&<button onClick={signOut}><LogOut size={16}/>{t("signout")}</button>}</div>
    </aside>
    <section className={styles.workspace}>
      <header className={styles.topbar}>
        <div className={styles.topIdentity}>
          <strong>{profile?.full_name||user?.email?.split("@")[0]||"Learner"}</strong>
          <small>{user?.email||"Demo mode"}</small>
        </div>
        <div className={styles.topActions}>
          <LanguageToggle/>
          {user&&<button className={styles.topLogout} onClick={signOut}><LogOut size={16}/>{t("signout")}</button>}
        </div>
      </header>
      <main className={styles.main}>{children}</main>
    </section>
  </div>
}
