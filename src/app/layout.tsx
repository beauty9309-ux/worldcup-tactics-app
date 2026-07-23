import type { Metadata } from "next";
import { Song_Myung, Noto_Serif_KR } from "next/font/google";
import "./globals.css";

const songMyung = Song_Myung({
  variable: "--font-song-myung",
  weight: "400",
});

const notoSerifKr = Noto_Serif_KR({
  variable: "--font-noto-serif-kr",
  weight: ["400", "600", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "위기의 순간, 내가 감독이라면?",
  description: "2026 월드컵 실제 실점 장면으로 돌아가 전술을 다시 짜보는 인터랙티브 감독 시뮬레이션",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${songMyung.variable} ${notoSerifKr.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
