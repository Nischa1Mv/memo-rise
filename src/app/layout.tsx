import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Note Taking App",
  description: "A simple note-taking application",
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
