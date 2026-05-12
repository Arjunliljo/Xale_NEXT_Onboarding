"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

const NAV_ITEMS = [
  { href: "/features", label: "Features" },
  { href: "/pricing", label: "Pricing" },
  { href: "/industries", label: "Industries" },
  { href: "/case-studies", label: "Case studies" },
  { href: "/blog", label: "Blog" },
];

const ACCENT = "#319b72";
const NAV_HEIGHT = 56;

type Theme = "light" | "dark";

const THEME_TOKENS: Record<
  Theme,
  {
    bg: string;
    bgScrolled: string;
    border: string;
    borderScrolled: string;
    blur: string;
    blurScrolled: string;
    shadowScrolled: string;
    textPrimary: string;
    textSecondary: string;
    hoverPill: string;
    ctaBg: string;
    ctaBgHover: string;
    ctaText: string;
    hamburger: string;
  }
> = {
  light: {
    bg: "rgba(255,255,255,0.62)",
    bgScrolled: "rgba(255,255,255,0.82)",
    border: "rgba(230,232,231,0.5)",
    borderScrolled: "rgba(230,232,231,0.5)",
    blur: "blur(20px) saturate(160%)",
    blurScrolled: "blur(20px) saturate(160%)",
    shadowScrolled:
      "0 1px 0 rgba(5,25,18,0.06), 0 8px 24px -16px rgba(5,25,18,0.18)",
    textPrimary: "#051912",
    textSecondary: "rgba(5,25,18,0.62)",
    hoverPill: "rgba(49,155,114,0.10)",
    ctaBg: "#051912",
    ctaBgHover: "#156548",
    ctaText: "#ffffff",
    hamburger: "#051912",
  },
  dark: {
    bg: "rgba(5,25,18,0)",
    bgScrolled: "rgba(5,25,18,0.72)",
    border: "rgba(255,255,255,0)",
    borderScrolled: "rgba(255,255,255,0.08)",
    blur: "blur(0px)",
    blurScrolled: "blur(16px) saturate(140%)",
    shadowScrolled:
      "0 1px 0 rgba(0,0,0,0.25), 0 8px 24px -16px rgba(0,0,0,0.6)",
    textPrimary: "#ffffff",
    textSecondary: "rgba(255,255,255,0.72)",
    hoverPill: "rgba(255,255,255,0.10)",
    ctaBg: "#ffffff",
    ctaBgHover: "#319b72",
    ctaText: "#051912",
    hamburger: "#ffffff",
  },
};

const DARK_INITIAL_PATHS = new Set<string>(["/"]);

export default function MarketingNav() {
  const pathname = usePathname();
  const initialTheme: Theme = DARK_INITIAL_PATHS.has(pathname)
    ? "dark"
    : "light";
  const [scrolled, setScrolled] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [theme, setTheme] = useState<Theme>(initialTheme);

  useIsoLayoutEffect(() => {
    let raf = 0;
    const probeY = NAV_HEIGHT + 4;

    const detectTheme = (): Theme | null => {
      const x = window.innerWidth / 2;
      const stack = document.elementsFromPoint(x, probeY);
      for (const el of stack) {
        const themed = (el as HTMLElement).closest<HTMLElement>(
          "[data-nav-theme]"
        );
        if (themed) {
          return themed.dataset.navTheme === "dark" ? "dark" : "light";
        }
      }
      const sections = document.querySelectorAll<HTMLElement>("section");
      let best: { theme: Theme; top: number } | null = null;
      for (const section of sections) {
        const rect = section.getBoundingClientRect();
        if (rect.top <= probeY && rect.bottom > probeY) {
          const t: Theme =
            section.dataset.navTheme === "dark" ? "dark" : "light";
          if (!best || rect.top > best.top) {
            best = { theme: t, top: rect.top };
          }
        }
      }
      return best?.theme ?? null;
    };

    const update = () => {
      const y = window.scrollY;
      setScrolled(y > 8);
      if (y <= 8 && DARK_INITIAL_PATHS.has(pathname)) {
        setTheme(initialTheme);
        return;
      }
      const detected = detectTheme();
      if (detected) {
        setTheme(detected);
      } else if (y <= 0) {
        setTheme(initialTheme);
      }
    };

    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        update();
        raf = 0;
      });
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [pathname]);

  const t = THEME_TOKENS[theme];

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <header
        data-theme={theme}
        className="sticky top-0 z-50"
        style={{
          backgroundColor: scrolled ? t.bgScrolled : t.bg,
          borderBottom: `1px solid ${scrolled ? t.borderScrolled : t.border}`,
          boxShadow: scrolled ? t.shadowScrolled : "none",
          backdropFilter: scrolled ? t.blurScrolled : t.blur,
          WebkitBackdropFilter: scrolled ? t.blurScrolled : t.blur,
          transition:
            "background-color 0.35s cubic-bezier(0.22,1,0.36,1), border-color 0.35s cubic-bezier(0.22,1,0.36,1), box-shadow 0.35s cubic-bezier(0.22,1,0.36,1), backdrop-filter 0.35s cubic-bezier(0.22,1,0.36,1), -webkit-backdrop-filter 0.35s cubic-bezier(0.22,1,0.36,1)",
        }}
      >
        <div className="max-w-[1240px] mx-auto px-5 sm:px-6 h-14 flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            aria-label="Xale home"
            data-cursor="link"
            data-cursor-label="Home"
            className="flex items-center gap-2 shrink-0"
          >
            <motion.div
              whileHover={{ rotate: -8, scale: 1.08 }}
              transition={{ type: "spring", stiffness: 400, damping: 18 }}
              className="relative h-7 w-7"
            >
              <Image
                src="/assets/Logo.png"
                alt=""
                fill
                sizes="28px"
                priority
                className="rounded-full object-cover"
              />
            </motion.div>
            <motion.span
              animate={{ color: t.textPrimary }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="text-[15px] font-semibold tracking-tight"
            >
              Xale
            </motion.span>
          </Link>

          {/* Desktop nav */}
          <nav
            aria-label="Primary"
            className="hidden md:flex items-center"
            onMouseLeave={() => setHovered(null)}
          >
            {NAV_ITEMS.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  data-cursor="link"
                  onMouseEnter={() => setHovered(item.href)}
                  className="relative inline-flex items-center h-9 px-3.5 text-[13px] font-medium leading-none transition-colors"
                  style={{
                    color: active ? t.textPrimary : t.textSecondary,
                  }}
                >
                  {hovered === item.href && (
                    <motion.span
                      layoutId="nav-hover-pill"
                      className="absolute inset-0 rounded-full"
                      style={{ backgroundColor: t.hoverPill }}
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 32,
                      }}
                    />
                  )}
                  <span className="relative z-10">{item.label}</span>
                  {active && (
                    <motion.span
                      layoutId="nav-active-dot"
                      className="absolute left-1/2 -translate-x-1/2 bottom-1 h-1 w-1 rounded-full"
                      style={{ backgroundColor: ACCENT }}
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 30,
                      }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* CTAs */}
          <div className="hidden md:flex items-center gap-1">
            <Link
              href="/login"
              data-cursor="link"
              className="inline-flex items-center h-9 px-3.5 text-[13px] font-medium leading-none rounded-full transition-colors"
              style={{ color: t.textPrimary }}
            >
              Log in
            </Link>
            <CtaButton href="/signup" theme={theme}>
              Start free
            </CtaButton>
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
            className="md:hidden relative h-9 w-9 -mr-1 flex items-center justify-center rounded-full transition-colors"
          >
            <span className="sr-only">Menu</span>
            <motion.span
              animate={
                mobileOpen
                  ? { rotate: 45, y: 0, backgroundColor: t.hamburger }
                  : { rotate: 0, y: -4, backgroundColor: t.hamburger }
              }
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="absolute h-[1.5px] w-5 rounded-full"
            />
            <motion.span
              animate={
                mobileOpen
                  ? { rotate: -45, y: 0, backgroundColor: t.hamburger }
                  : { rotate: 0, y: 4, backgroundColor: t.hamburger }
              }
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="absolute h-[1.5px] w-5 rounded-full"
            />
          </button>
        </div>
      </header>

      {/* Mobile sheet */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={`md:hidden fixed inset-0 z-40 backdrop-blur-xl ${
              theme === "dark" ? "bg-[#051912]/90" : "bg-white/85"
            }`}
            style={{ paddingTop: 56 }}
            onClick={() => setMobileOpen(false)}
          >
            <motion.nav
              initial={{ y: -12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -8, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-[1240px] mx-auto px-5 pt-6 pb-8 flex flex-col gap-1"
            >
              {NAV_ITEMS.map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={{ x: -16, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{
                    delay: 0.04 + i * 0.04,
                    duration: 0.35,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <Link
                    href={item.href}
                    className="block py-3 text-2xl font-semibold tracking-tight"
                    style={{
                      color: isActive(item.href) ? ACCENT : t.textPrimary,
                    }}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ y: 12, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  delay: 0.04 + NAV_ITEMS.length * 0.04,
                  duration: 0.35,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="mt-6 flex items-center gap-2"
              >
                <Link
                  href="/login"
                  className="flex-1 inline-flex items-center justify-center h-11 text-[14px] font-medium leading-none rounded-full border"
                  style={{
                    color: t.textPrimary,
                    borderColor: t.border,
                  }}
                >
                  Log in
                </Link>
                <CtaButton
                  href="/signup"
                  theme={theme}
                  className="flex-1 justify-center h-11"
                >
                  Start free
                </CtaButton>
              </motion.div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function CtaButton({
  href,
  children,
  className,
  theme = "light",
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  theme?: Theme;
}) {
  const tokens = THEME_TOKENS[theme];
  return (
    <Link
      href={href}
      data-cursor="link"
      data-cursor-label="Sign up"
      className={`inline-flex items-center gap-1.5 h-9 px-4 text-[13px] font-medium leading-none rounded-full transition-colors [&:hover_.cta-arrow]:translate-x-0.5 ${
        className ?? ""
      }`}
      style={{ backgroundColor: tokens.ctaBg, color: tokens.ctaText }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = tokens.ctaBgHover;
        e.currentTarget.style.color =
          theme === "dark" ? "#ffffff" : tokens.ctaText;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = tokens.ctaBg;
        e.currentTarget.style.color = tokens.ctaText;
      }}
    >
      <span>{children}</span>
      <span
        aria-hidden
        className="cta-arrow inline-block text-[14px] leading-none transition-transform duration-200"
      >
        →
      </span>
    </Link>
  );
}
