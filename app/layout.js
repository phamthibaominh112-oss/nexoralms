import "./globals.css";

export const metadata = {
  title: {
    default: "Nexora | Road to IELTS 8.0",
    template: "%s | Nexora",
  },
  description:
    "Build your English skills through 100 guided levels and reach IELTS Band 8.0 with Nexora.",

  icons: {
    icon: [
      {
        url: "/favicon.jpeg",
        type: "image/jpeg",
      },
    ],
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