import type { Metadata } from "next";
import { Jua, Noto_Sans_KR } from "next/font/google";
import "./globals.css";
import InstagramFab from "@/components/InstagramFab";

const jua = Jua({
  variable: "--font-jua",
  subsets: ["latin"],
  weight: "400",
});

const noto = Noto_Sans_KR({
  variable: "--font-noto",
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://rest-and-rise.vercel.app"),
  title: {
    default: "레스트앤라이즈 · REST&RISE",
    template: "%s · 레스트앤라이즈",
  },
  description:
    "진짜 웰니스가 필요한 이들을 위한 회복과 성장의 소셜 웰니스 캠페인. 봉사할수록 자라나는 씨앗, 기백씨(Give Back Seed)와 함께해요.",
  openGraph: {
    title: "레스트앤라이즈 · REST&RISE",
    description:
      "봉사할수록 자라나는 씨앗, 기백씨와 함께하는 소셜 웰니스 캠페인.",
    type: "website",
    locale: "ko_KR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${jua.variable} ${noto.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-cream text-ink">
        {children}
        <InstagramFab />
      </body>
    </html>
  );
}
