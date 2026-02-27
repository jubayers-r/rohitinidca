import { Montserrat } from "next/font/google";
import type { Metadata } from "next/types";
import "./globals.css";

const montserrat = Montserrat({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ICEPots",
  description: "ICEPots - Not for everyone",
  openGraph: {
    images: [
      {
        url: "https://bolt.new/static/og_default.png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: [
      {
        url: "https://bolt.new/static/og_default.png",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={montserrat.className}>{children}</body>
    </html>
  );
}
