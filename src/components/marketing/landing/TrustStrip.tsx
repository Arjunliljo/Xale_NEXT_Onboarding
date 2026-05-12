import Reveal from "../motion/Reveal";

const LOGOS = [
  "Nila Academy",
  "Kayal Studio",
  "Kerala Wings",
  "Munnar Trails",
  "Vembanad Films",
  "Periyar Edu",
];

export default function TrustStrip() {
  return (
    <section
      className="py-20 max-md:py-12 relative"
      style={{
        backgroundColor: "#020c08",
        backgroundImage:
          "radial-gradient(80% 100% at 50% 50%, rgba(16,47,35,0.6) 0%, transparent 75%)",
      }}
    >
      <div className="max-w-[1200px] mx-auto px-6 max-sm:px-4 relative">
        <Reveal>
          <p
            className="text-center text-sm mb-10 max-md:mb-6"
            style={{ color: "rgba(255,255,255,0.55)" }}
          >
            Trusted by sales teams across studios, academies, and consultancies
            — globally.
          </p>
        </Reveal>

        {/* Desktop / tablet — wrap (unchanged) */}
        <Reveal delay={0.1}>
          <div className="hidden md:flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
            {LOGOS.map((name) => (
              <div
                key={name}
                className="text-lg font-medium opacity-60 hover:opacity-100 transition-opacity"
                style={{
                  color: "rgba(255,255,255,0.85)",
                  letterSpacing: "-0.01em",
                }}
              >
                {name}
              </div>
            ))}
          </div>
        </Reveal>

        {/* Mobile — single-line infinite marquee */}
        <div
          className="md:hidden relative overflow-hidden"
          style={{
            maskImage:
              "linear-gradient(90deg, transparent, black 8%, black 92%, transparent)",
            WebkitMaskImage:
              "linear-gradient(90deg, transparent, black 8%, black 92%, transparent)",
          }}
        >
          <div className="flex gap-10 animate-trust-marquee whitespace-nowrap py-1">
            {[...LOGOS, ...LOGOS].map((name, i) => (
              <div
                key={i}
                className="text-base font-medium opacity-60 shrink-0"
                style={{
                  color: "rgba(255,255,255,0.85)",
                  letterSpacing: "-0.01em",
                }}
              >
                {name}
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes trust-marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-trust-marquee {
          animation: trust-marquee 22s linear infinite;
          width: max-content;
        }
      `}</style>
    </section>
  );
}
