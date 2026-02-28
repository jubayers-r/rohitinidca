import { Montserrat } from "next/font/google";
import type { Metadata } from "next/types";
import "./globals.css";

const montserrat = Montserrat({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ICEPots",
  description: "ICEPots - Not for everyone",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${montserrat.className} bg-size-[300%] bg-[linear-gradient(rgba(255,255,255,0.7),rgba(255,255,255,0.5)),url('/bg.png')] md:bg-none md:bg-white`}
      >
        {children}
      </body>
    </html>
  );
}
