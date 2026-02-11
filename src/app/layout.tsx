import "@/styles/globals.css";
import { Inter, IBM_Plex_Sans_Thai } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

const ibmPlexSansThai = IBM_Plex_Sans_Thai({
  subsets: ["thai", "latin"], 
  weight: ["400", "500", "600", "700"],
  variable: "--font-thai",
  display: "swap",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th" className={`${inter.variable} ${ibmPlexSansThai.variable}`}>
      <body className="h-dvh overflow-hidden">{children}</body>
    </html>
  );
}

