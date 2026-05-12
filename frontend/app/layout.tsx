import type { Metadata } from "next";
import { IBM_Plex_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { SiteNavbar } from "@/shared/components/SiteNavbar";
import { SiteFooter } from "@/shared/components/SiteFooter";
import { Toaster } from "sonner";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  weight: ["400", "500", "600"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ArchFlow - Agentic Design Studio",
  description: "Automated software architecture and technology recommendation workspace",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${ibmPlexMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SiteNavbar />

        <div className="min-h-screen bg-[radial-gradient(circle_at_14%_14%,rgba(14,165,233,0.18),transparent_34%),radial-gradient(circle_at_86%_11%,rgba(249,115,22,0.14),transparent_30%),radial-gradient(circle_at_50%_90%,rgba(16,185,129,0.12),transparent_36%),linear-gradient(180deg,#020617_0%,#0b1220_42%,#111827_100%)]">
          {children}
        </div>

        <Toaster position="bottom-right" theme="dark" richColors />
        <SiteFooter />
      </body>
    </html >
  );
}
