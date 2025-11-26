import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dr. Atef Abdelrahman Hassan | MD, AI & ML Specialist in Healthcare",
  description: "Chief Operating Officer at OrthoGlobe | Founder of CiteSort.AI | Clinical Researcher | AI & ML Specialist in Healthcare | Faculty of Medicine, Al-Azhar University",
  keywords: ["Atef Hassan", "OrthoGlobe", "CiteSort.AI", "AI Healthcare", "Clinical Research", "Machine Learning", "Medical AI"],
  authors: [{ name: "Dr. Atef Abdelrahman Hassan" }],
  openGraph: {
    title: "Dr. Atef Abdelrahman Hassan | MD, AI & ML Specialist",
    description: "Chief Operating Officer at OrthoGlobe | Founder of CiteSort.AI | Clinical Researcher",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#0a0a0a] text-[#ededed]`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
