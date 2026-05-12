import type { Metadata } from "next";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://xale.in";
export const SITE_NAME = "Xale";
export const SITE_TITLE_DEFAULT = "Xale — The CRM operating system";
export const SITE_DESCRIPTION =
  "Capture, nurture, and convert leads with WhatsApp, Meta Ads, and automation — one platform, every channel, built for teams that move fast.";

type BuildMetadataInput = {
  title?: string;
  description?: string;
  path: string;
  image?: string;
  type?: "website" | "article";
  publishedTime?: string | Date;
  modifiedTime?: string | Date;
  authors?: string[];
  tags?: string[];
  noIndex?: boolean;
};

export function buildMetadata({
  title,
  description,
  path,
  image,
  type = "website",
  publishedTime,
  modifiedTime,
  authors,
  tags,
  noIndex,
}: BuildMetadataInput): Metadata {
  const url = absoluteUrl(path);
  const finalTitle = title ?? SITE_TITLE_DEFAULT;
  const finalDescription = description ?? SITE_DESCRIPTION;
  const ogImage = image ?? "/opengraph-image";

  return {
    title: finalTitle,
    description: finalDescription,
    alternates: { canonical: url },
    openGraph: {
      type,
      url,
      siteName: SITE_NAME,
      title: finalTitle,
      description: finalDescription,
      images: [{ url: ogImage }],
      ...(type === "article" && {
        publishedTime: toIso(publishedTime),
        modifiedTime: toIso(modifiedTime),
        authors,
        tags,
      }),
    },
    twitter: {
      card: "summary_large_image",
      title: finalTitle,
      description: finalDescription,
      images: [ogImage],
    },
    ...(noIndex && { robots: { index: false, follow: false } }),
  };
}

export function absoluteUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${normalized === "/" ? "" : normalized}`;
}

function toIso(date: string | Date | undefined): string | undefined {
  if (!date) return undefined;
  return typeof date === "string" ? date : date.toISOString();
}
