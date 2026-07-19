import type { Metadata } from "next";
import { Geist } from "next/font/google";
import type { ReactNode } from "react";
import "./globals.css";

const geist = Geist({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ajarin",
  description: "Dari Siswa, Untuk Siswa",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="id" className={`${geist.variable} antialiased`}>
      <body className="h-screen flex items-center justify-center ">
        {children}
      </body>
    </html>
  );
}
