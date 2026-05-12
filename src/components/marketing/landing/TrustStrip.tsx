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
      className="py-20 relative"
      style={{
        backgroundColor: "#020c08",
        backgroundImage:
          "radial-gradient(80% 100% at 50% 50%, rgba(16,47,35,0.6) 0%, transparent 75%)",
      }}
    >
      <div className="max-w-[1200px] mx-auto px-6 relative">
        <Reveal>
          <p
            className="text-center text-sm mb-10"
            style={{ color: "rgba(255,255,255,0.55)" }}
          >
            Trusted by sales teams across studios, academies, and consultancies
            — globally.
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
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
      </div>
    </section>
  );
}
