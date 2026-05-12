import type { Metadata } from "next";
import { buildMetadata } from "@/src/lib/seo/metadata";

import Hero from "@/src/components/marketing/landing/Hero";
import TrustStrip from "@/src/components/marketing/landing/TrustStrip";
import Problem from "@/src/components/marketing/landing/Problem";
import Solution from "@/src/components/marketing/landing/Solution";
import Pillars from "@/src/components/marketing/landing/Pillars";
import PipelineStory from "@/src/components/marketing/landing/PipelineStory";
import ChapterWhatsApp from "@/src/components/marketing/landing/ChapterWhatsApp";
import ChapterMeta from "@/src/components/marketing/landing/ChapterMeta";
import ChapterAutomations from "@/src/components/marketing/landing/ChapterAutomations";
import ChapterReports from "@/src/components/marketing/landing/ChapterReports";
import IndustriesShowcase from "@/src/components/marketing/landing/IndustriesShowcase";
import HowItWorks from "@/src/components/marketing/landing/HowItWorks";
import QuantifiedParallax from "@/src/components/marketing/landing/QuantifiedParallax";
import Testimonials from "@/src/components/marketing/landing/Testimonials";
import Comparison from "@/src/components/marketing/landing/Comparison";
import IntegrationsMarquee from "@/src/components/marketing/landing/IntegrationsMarquee";
import Faq from "@/src/components/marketing/landing/Faq";
import FinalCta from "@/src/components/marketing/landing/FinalCta";

export const metadata: Metadata = buildMetadata({
  title: "Xale — The CRM operating system",
  description:
    "Capture, nurture, and convert leads with WhatsApp, Meta Ads, and automation — one platform, every channel, built for teams that move fast.",
  path: "/",
});

export default function LandingPage() {
  return (
    <>
      <Hero />
      <TrustStrip />
      <Problem />
      <Solution />
      <Pillars />
      <QuantifiedParallax />
      <PipelineStory />
      <ChapterWhatsApp />
      <ChapterMeta />
      <ChapterAutomations />
      <ChapterReports />
      <IndustriesShowcase />
      <HowItWorks />
      <Testimonials />
      <Comparison />
      <IntegrationsMarquee />
      <Faq />
      <FinalCta />
    </>
  );
}
