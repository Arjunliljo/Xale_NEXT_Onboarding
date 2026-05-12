import type { Metadata } from "next";
import { buildMetadata } from "@/src/lib/seo/metadata";
import PricingContent from "./PricingContent";

export const metadata: Metadata = buildMetadata({
  title: "Pricing",
  description:
    "Simple pricing that scales with you. Start free, pay only when you outgrow the free tier. No surprise fees.",
  path: "/pricing",
});

export default function PricingPage() {
  return <PricingContent />;
}
