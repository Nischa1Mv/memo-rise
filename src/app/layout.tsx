import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MemoRise",
  description: "A simple note-taking application",
  icons: {
    icon: [
      { url: "/favicon-16x16.png" },
      { url: "/favicon-32x32.png" },
      { url: "/favicon.ico" }
    ],
    apple: "/apple-touch-icon.png",
    shortcut: "/favicon.ico"
  }
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark antialiased w-full mx-auto">
      <body className={`${inter.className} bg-[#121212] text-white`}>
        {children}
      </body>
    </html>
  );
}
