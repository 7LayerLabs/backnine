import type { Metadata } from "next";
import { DM_Serif_Display, Inter, Montserrat } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

const dmSerif = DM_Serif_Display({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-dm-serif",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.backnineshop.com"),
  title: "Back Nine Apparel | Premium Golf Clothing & Accessories",
  description: "Premium golf lifestyle clothing for those who appreciate the finer things — on and off the course.",
  openGraph: {
    title: "Back Nine Apparel",
    description: "Premium golf lifestyle clothing for those who appreciate the finer things.",
    url: "https://www.backnineshop.com",
    siteName: "Back Nine Apparel",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${dmSerif.variable} ${inter.variable} ${montserrat.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
