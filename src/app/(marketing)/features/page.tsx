import type { Metadata } from "next";
import { buildMetadata } from "@/src/lib/seo/metadata";
import FeaturesContent from "./FeaturesContent";

export const metadata: Metadata = buildMetadata({
  title: "Features",
  description:
    "Lead pipeline, WhatsApp Business, Meta Ads, automations, RBAC, custom fields, mobile, security, integrations, API — everything Xale ships.",
  path: "/features",
});

export default function FeaturesPage() {
  return <FeaturesContent />;
}
