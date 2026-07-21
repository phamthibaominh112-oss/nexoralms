import "./globals.css";
import Providers from "@/components/Providers";
export const metadata={title:"Nexora — Road to IELTS 8.0",description:"Interactive bilingual IELTS learning platform."};
export default function RootLayout({children}){return <html lang="en"><body><Providers>{children}</Providers></body></html>}
