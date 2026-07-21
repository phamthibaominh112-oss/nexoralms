"use client";
import Link from "next/link";
import {useAuth} from "@/components/AuthProvider";
import NoriMascot from "@/components/NoriMascot";

export default function AdminGuard({children}){
  const{user,profile,loading}=useAuth();
  if(loading)return <div className="loading"><div className="spinner"/></div>;
  if(!user||!["admin","founder"].includes(profile?.role))return <section style={{minHeight:"70vh",display:"grid",placeItems:"center",alignContent:"center",textAlign:"center"}}><NoriMascot size={130} mood="thinking"/><h1>Administrator access required</h1><p className="muted">Your account must have the admin or founder role.</p><Link href="/dashboard" className="primary">Return to dashboard</Link></section>;
  return children;
}
