import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "結婚MBTI・32キャラ診断",
  description:
    "MBTIそのものではなく、恋愛・結婚時の人格反応を分析する独自の結婚MBTI（結婚人格分析）。相手分析ではなく、あなたの恋愛の癖・未成熟さ・結婚で苦しくなる理由を見える化します。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#fbf7f2] font-sans text-[#2a2522] antialiased">
        {children}
      </body>
    </html>
  );
}
