import { Fraunces, Instrument_Sans } from "next/font/google";
import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import "../globals.css";
import { Toaster } from "@/components/ui/toast";
import Marquee from "@/components/layout/marquee";
import RecentPurchasePopup from "@/components/RecentPurchasePopup";

const display = Fraunces({ subsets: ["latin"], variable: "--font-fraunces" });
const body = Instrument_Sans({ subsets: ["latin"], variable: "--font-instrument" });

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className="antialiased">
        <Marquee />
        <Header />
        <main>
          {children}
          <RecentPurchasePopup/>
          <Toaster />
        </main>
        <Footer />
      </body>
    </html>
  );
}