"use client";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

const dict = {
  en: {
    dashboard:"Dashboard", roadmap:"Roadmap", placement:"Placement Test", ielts:"IELTS Lab",
    games:"Game Arcade", profile:"Profile", signout:"Sign out", continue:"Continue",
    previous:"Previous", check:"Check answers", complete:"Complete lesson",
    start:"Start", play:"Play", listen:"Listen", retry:"Try again"
  },
  vi: {
    dashboard:"Tổng quan", roadmap:"Lộ trình", placement:"Bài kiểm tra đầu vào", ielts:"Luyện thi IELTS",
    games:"Khu trò chơi", profile:"Hồ sơ", signout:"Đăng xuất", continue:"Tiếp tục",
    previous:"Quay lại", check:"Kiểm tra đáp án", complete:"Hoàn thành bài",
    start:"Bắt đầu", play:"Chơi", listen:"Nghe", retry:"Thử lại"
  }
};
const C=createContext(null);

export function LanguageProvider({children}){
  const[language,setLanguage]=useState("en");
  useEffect(()=>{const x=localStorage.getItem("nexora-lang");if(x==="en"||x==="vi")setLanguage(x)},[]);
  function change(v){setLanguage(v);localStorage.setItem("nexora-lang",v)}
  const value=useMemo(()=>({
    language,setLanguage:change,t:k=>dict[language]?.[k]||k,
    localize:(obj,key)=>language==="vi"&&obj?.[`${key}_vi`]?obj[`${key}_vi`]:obj?.[key]||""
  }),[language]);
  return <C.Provider value={value}>{children}</C.Provider>;
}
export function useLanguage(){return useContext(C)}
