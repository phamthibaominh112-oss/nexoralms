"use client";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";

const C=createContext(null);

export function AuthProvider({children}){
  const[user,setUser]=useState(null),[profile,setProfile]=useState(null),[loading,setLoading]=useState(Boolean(supabase));
  useEffect(()=>{
    if(!supabase){setLoading(false);return}
    let alive=true;
    async function load(){
      try{
        const{data}=await supabase.auth.getSession();
        const u=data?.session?.user||null;
        if(!alive)return;
        setUser(u);
        if(u){
          const{data:p}=await supabase.from("profiles").select("*").eq("id",u.id).maybeSingle();
          if(alive)setProfile(p||null);
        }
      }finally{if(alive)setLoading(false)}
    }
    load();
    const{data:s}=supabase.auth.onAuthStateChange(async(_,session)=>{
      const u=session?.user||null;setUser(u);
      if(!u){setProfile(null);return}
      const{data:p}=await supabase.from("profiles").select("*").eq("id",u.id).maybeSingle();
      setProfile(p||null);
    });
    return()=>{alive=false;s?.subscription?.unsubscribe()}
  },[]);
  async function refreshProfile(){
    if(!supabase||!user)return null;
    const{data}=await supabase.from("profiles").select("*").eq("id",user.id).maybeSingle();
    setProfile(data||null);return data;
  }
  const value=useMemo(()=>({user,profile,loading,setProfile,refreshProfile}),[user,profile,loading]);
  return <C.Provider value={value}>{children}</C.Provider>
}
export function useAuth(){return useContext(C)}
