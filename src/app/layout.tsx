import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import SessionProvider from "@/components/session-provider";

export const metadata: Metadata = {
  title: "Investoir - Invest in Farmland, Grow Your Wealth",
  description:
    "Investoir is an innovative platform that allows individuals to invest in farmland through fractional ownership. Browse farms, purchase plots, and earn returns from crop yields.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col antialiased">
        <SessionProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </SessionProvider>
      </body>
    </html>
  );
}
