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
