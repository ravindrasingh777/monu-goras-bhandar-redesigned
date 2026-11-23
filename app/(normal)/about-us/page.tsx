import type { Metadata } from "next";
import AboutHero from "@/components/about/about-hero";
import AboutServices from "@/components/about/about-services";
import Team from "@/components/about/team";
import CtaBanner from "@/components/home/cta-banner";

export const metadata: Metadata = { title: "About us | Monu Goras Bhandar" };

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <AboutServices />
      <Team />
      <CtaBanner />
    </>
  );
}