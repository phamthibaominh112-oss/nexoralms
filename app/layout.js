import "./globals.css";

export const metadata = {
  title: "Nexora | Road to IELTS 8.0",
  description: "A complete, gamified English learning roadmap from zero to IELTS 8.0."
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
import "./globals.css";

export const metadata = {
  title: "Nexora | Road to IELTS 8.0",
  description: "Road to IELTS 8.0",

  icons: {
    icon: "/favicon.jpeg",
    shortcut: "/favicon.jpeg",
    apple: "/favicon.jpeg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}