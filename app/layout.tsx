import type { Metadata } from "next";
import "./globals.css";

const title = "유영찬 | Web Developer Portfolio";
const description =
  "웹 개발, 프론트엔드, UI/UX 디자인과 웹서비스 기획 역량을 프로젝트로 보여주는 유영찬의 포트폴리오";
const socialImage =
  process.env.GITHUB_PAGES === "true"
    ? "https://y-youngchan.github.io/2026Y_Portfolio/og-yu-youngchan.png"
    : "https://yoo-youngchan-portfolio.sunhama2000.chatgpt.site/og-yu-youngchan.png";
const favicon =
  process.env.GITHUB_PAGES === "true"
    ? "/2026Y_Portfolio/favicon.svg"
    : "/favicon.svg";

export const metadata: Metadata = {
  title,
  description,
  icons: {
    icon: favicon,
    shortcut: favicon,
  },
  openGraph: {
    title,
    description,
    type: "website",
    images: [{ url: socialImage, width: 1200, height: 630, alt: title }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [socialImage],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
