import { Reveal, StaggerGroup, StaggerItem } from "@/components/demos/shared/reveal";

const ACCENT = "#b6ff3c";

const classes = [
  { name: "HIIT Blitz", time: "6:00 AM", duration: "45 min", intensity: "High" },
  { name: "Power Yoga", time: "7:30 AM", duration: "60 min", intensity: "Medium" },
  { name: "CrossFit WOD", time: "12:00 PM", duration: "50 min", intensity: "Extreme" },
  { name: "Spin & Burn", time: "5:30 PM", duration: "40 min", intensity: "High" },
  { name: "Boxing Fundamentals", time: "7:00 PM", duration: "60 min", intensity: "High" },
  { name: "Recovery & Stretch", time: "8:30 PM", duration: "30 min", intensity: "Low" },
];

export function Offerings() {
  return (
    <section id="classes" className="py-28 md:py-36">
      <div className="mx-auto max-w-5xl px-6">
        <div className="text-center mb-16">
          <Reveal>
            <p className="eyebrow-demo">This Week</p>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="mt-3 font-display text-4xl md:text-6xl uppercase">Class Schedule</h2>
          </Reveal>
        </div>
        <StaggerGroup className="grid grid-cols-1 md:grid-cols-2 gap-4" stagger={0.06}>
          {classes.map((item) => (
            <StaggerItem key={item.name}>
              <div className="flex items-center justify-between p-6 border border-white/10 rounded-sm group transition-colors hover:border-white/25">
                <div>
                  <h3 className="font-display text-xl uppercase tracking-wide transition-colors group-hover:text-white">
                    {item.name}
                  </h3>
                  <p className="text-sm text-white/40 mt-1">{item.time} &middot; {item.duration}</p>
                </div>
                <span
                  className="text-[0.65rem] uppercase tracking-wider px-3 py-1 rounded-full border shrink-0 ml-4"
                  style={{ color: ACCENT, borderColor: `${ACCENT}50` }}
                >
                  {item.intensity}
                </span>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
