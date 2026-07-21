import "./globals.css";
import Providers from "@/components/Providers";

export const metadata = {
  title: "Nexora V3 — Gamified Road to IELTS 8.0",
  description: "Bilingual gamified English and IELTS learning platform."
};

export default function RootLayout({ children }) {
  return <html lang="en"><body><Providers>{children}</Providers></body></html>;
}
