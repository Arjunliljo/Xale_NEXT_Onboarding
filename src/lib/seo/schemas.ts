import { SITE_NAME, SITE_URL, SITE_DESCRIPTION, absoluteUrl } from "./metadata";

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/assets/Logo.png`,
    sameAs: ["https://marketlube.in"],
    description: SITE_DESCRIPTION,
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

type BlogPostingInput = {
  title: string;
  description: string;
  slug: string;
  publishedAt: Date | string;
  updatedAt?: Date | string;
  author: { name: string };
  cover?: string;
  tags?: string[];
};

export function blogPostingSchema(post: BlogPostingInput) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    image: post.cover ? absoluteUrl(post.cover) : undefined,
    datePublished: toIso(post.publishedAt),
    dateModified: toIso(post.updatedAt ?? post.publishedAt),
    author: { "@type": "Person", name: post.author.name },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/assets/Logo.png` },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": absoluteUrl(`/blog/${post.slug}`),
    },
    keywords: post.tags?.join(", "),
  };
}

type FaqInput = { question: string; answer: string };

export function faqPageSchema(items: FaqInput[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((q) => ({
      "@type": "Question",
      name: q.question,
      acceptedAnswer: { "@type": "Answer", text: q.answer },
    })),
  };
}

type ProductInput = {
  name: string;
  description: string;
  offers: { name: string; price: number; currency: string; url: string }[];
};

export function productSchema(product: ProductInput) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    brand: { "@type": "Brand", name: SITE_NAME },
    offers: product.offers.map((o) => ({
      "@type": "Offer",
      name: o.name,
      price: o.price,
      priceCurrency: o.currency,
      url: o.url,
      availability: "https://schema.org/InStock",
    })),
  };
}

function toIso(date: Date | string): string {
  return typeof date === "string" ? date : date.toISOString();
}
