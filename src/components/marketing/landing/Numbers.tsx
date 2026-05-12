import Reveal from "../motion/Reveal";
import CountUp from "../motion/CountUp";

export default function Numbers() {
  return (
    <section
      className="py-32 max-md:py-12 max-sm:py-8"
      style={{
        background:
          "radial-gradient(120% 80% at 50% 100%, #eef3f1 0%, #ffffff 60%)",
      }}
    >
      <div className="max-w-[1200px] mx-auto px-6 max-sm:px-4">
        <Reveal>
          <p
            className="text-center text-sm uppercase tracking-[0.2em] mb-16"
            style={{ color: "var(--color-success,#156548)" }}
          >
            By the numbers
          </p>
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-4 max-md:gap-8">
          {[
            { value: 4.2, suffix: "M", label: "Leads managed monthly across Xale teams" },
            { value: 12, suffix: "M", label: "WhatsApp messages sent through Xale every month" },
            { value: 3.2, suffix: "×", label: "Faster average lead-response time vs industry baseline" },
          ].map((stat, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <div className="text-center">
                <div
                  className="text-7xl max-sm:text-5xl md:text-8xl font-thin mb-3"
                  style={{
                    color: "var(--color-text-primary,#1e302a)",
                    letterSpacing: "-0.04em",
                    fontWeight: 200,
                  }}
                >
                  <CountUp
                    to={stat.value}
                    suffix={stat.suffix}
                    decimals={stat.value % 1 !== 0 ? 1 : 0}
                    duration={1.5}
                  />
                </div>
                <p
                  className="text-base mx-auto max-w-[240px]"
                  style={{ color: "var(--color-text-gray,#6f6f6f)" }}
                >
                  {stat.label}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
