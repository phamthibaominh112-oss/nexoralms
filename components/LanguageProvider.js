"use client";
import {createContext,useContext,useEffect,useMemo,useState} from "react";
import {translations} from "@/lib/translations";
const C=createContext(null);
export function LanguageProvider({children}){const[language,setLanguage]=useState("en");useEffect(()=>{const s=localStorage.getItem("nexora-language");if(s==="en"||s==="vi")setLanguage(s)},[]);const change=n=>{setLanguage(n);localStorage.setItem("nexora-language",n)};const value=useMemo(()=>({language,setLanguage:change,t:k=>translations[language]?.[k]??translations.en[k]??k,localize:(item,field)=>language==="vi"&&item?.[`${field}_vi`]?item[`${field}_vi`]:item?.[field]??""}),[language]);return <C.Provider value={value}>{children}</C.Provider>}
export function useLanguage(){const v=useContext(C);if(!v)throw new Error("LanguageProvider missing");return v}
