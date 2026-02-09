import { Inter, Momo_Signature } from "next/font/google";
import "./globals.css";
import Script from "next/script";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const momoSignature = Momo_Signature({
  variable: "--font-momo-signature",
  subsets: ["latin"],
  weight: "400"
});

export const metadata = {
  title: "OneMinute Support - Human-friendly AI",
  description:
    "Instantly resolve customer questions with an assistant that reads your docs and speaks with empathy.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${momoSignature.variable} bg-[#050509]  min-h-screen flex flex-col antialiased text-zinc-100 selection:bg-zinc-800 font-sans`}>
        {children}
      </body>
    </html>
  );
}
