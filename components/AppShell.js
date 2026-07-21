"use client";
import Image from "next/image";
import Link from "next/link";
import {
  LayoutDashboard, Map, GraduationCap, Gamepad2, ClipboardCheck, User,
  LogOut, Gem, Heart, Flame, ShieldCheck, BookOpenCheck, ListChecks,
  Users, MessageSquareText, LibraryBig, FilePenLine
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useLanguage } from "@/components/LanguageProvider";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/lib/supabase";
import LanguageToggle from "@/components/LanguageToggle";
import NoriMascot from "@/components/NoriMascot";
import styles from "./shell.module.css";

export default function AppShell({children}){
  const path=usePathname(),router=useRouter(),{t}=useLanguage(),{user,profile}=useAuth();
  const isAdmin=["admin","founder"].includes(profile?.role);
  const learnerLinks=[
    ["/dashboard",t("dashboard"),LayoutDashboard],
    ["/placement",t("placement"),ClipboardCheck],
    ["/roadmap",t("roadmap"),Map],
    ["/ielts",t("ielts"),GraduationCap],
    ["/games",t("games"),Gamepad2],
    ["/support","Support",MessageSquareText],
    ["/onboarding",t("profile"),User]
  ];
  const adminLinks=[
    ["/admin","Admin Dashboard",ShieldCheck],
    ["/admin/courses","Courses",BookOpenCheck],
    ["/admin/questions","Question Bank",LibraryBig],
    ["/admin/assignments","Assignments",ListChecks],
    ["/admin/users","Learners",Users],
    ["/admin/helpdesk","Helpdesk",MessageSquareText],
    ["/admin/ielts","IELTS Test Studio",FilePenLine]
  ];
  const links=isAdmin?[...learnerLinks,...adminLinks]:learnerLinks;
  async function signOut(){if(supabase)await supabase.auth.signOut();router.replace("/")}
  return <div className={styles.layout}>
    <aside className={styles.sidebar}>
      <Link href="/" className={styles.brand}>
        <Image src="/nexora-logo.png" alt="Nexora" width={44} height={44} className={styles.brandImage}/>
        <div><strong>NEXORA</strong><small>Learning Management System</small></div>
      </Link>
      <div className={styles.mascot}><NoriMascot size={78}/><small>Nori AI</small></div>
      <nav>{links.map(([href,label,Icon])=><Link key={href} href={href} className={path===href||path.startsWith(`${href}/`)?styles.active:""}><Icon size={18}/>{label}</Link>)}</nav>
      {!isAdmin&&<div className={styles.resources}>
        <span><Heart size={15}/> {profile?.hearts??5}</span>
        <span><Gem size={15}/> {profile?.coins??0}</span>
        <span><Flame size={15}/> {profile?.streak_days??0}</span>
      </div>}
      <div className={styles.bottom}><LanguageToggle/><strong>{profile?.full_name||user?.email?.split("@")[0]||"Learner"}</strong><small>{profile?.role||"learner"}</small>{user&&<button onClick={signOut}><LogOut size={16}/>{t("signout")}</button>}</div>
    </aside>
    <section className={styles.workspace}>
      <header className={styles.topbar}>
        <div className={styles.topIdentity}><strong>{profile?.full_name||user?.email?.split("@")[0]||"Learner"}</strong><small>{isAdmin?"Administrator Workspace":user?.email||"Demo mode"}</small></div>
        <div className={styles.topActions}><LanguageToggle/>{user&&<button className={styles.topLogout} onClick={signOut}><LogOut size={16}/>{t("signout")}</button>}</div>
      </header>
      <main className={styles.main}>{children}</main>
    </section>
  </div>
}
