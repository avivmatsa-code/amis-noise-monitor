import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://avivmatsa-code.github.io/amis-noise-monitor/"),
  title: "מערכת ניטור רעש | AMIS",
  description: "יישומון מקומי למדידת עוצמת רעש משוערת ולהתרעה בעת חריגה.",
  openGraph: {
    title: "מערכת ניטור רעש",
    description: "מדידה מקומית של עוצמת רעש משוערת והתרעה בעת חריגה.",
    images: [{ url: "og.png", width: 1735, height: 909 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "מערכת ניטור רעש",
    description: "מדידה מקומית של עוצמת רעש משוערת והתרעה בעת חריגה.",
    images: ["og.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="he" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
