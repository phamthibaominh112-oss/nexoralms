"use client";
import { LanguageProvider } from "@/components/LanguageProvider";
import { AuthProvider } from "@/components/AuthProvider";

export default function Providers({ children }) {
  return <LanguageProvider><AuthProvider>{children}</AuthProvider></LanguageProvider>;
}
