import "./globals.css";
import Providers from "@/components/Providers";

export const metadata = {
  title: {
    default: "Nexora — Road to IELTS 8.0",
    template: "%s | Nexora",
  },
  description:
    "A bilingual, gamified learning management system that diagnoses learners, builds a 100-level pathway and prepares them for computer-based IELTS.",
  applicationName: "Nexora LMS",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon-32.png", type: "image/png", sizes: "32x32" },
      { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
};

export const viewport = {
  themeColor: "#111735",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
