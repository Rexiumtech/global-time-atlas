import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Global Time Atlas — Timezone converter",
  description:
    "Convert any moment across 956 major cities and 195 national capitals. DST-aware, bilingual (EN/ES), and fully private — everything runs in your browser.",
};

export const viewport: Viewport = {
  themeColor: "#132321",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
