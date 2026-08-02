import { CountUp } from "@/components/shared/count-up";

const stats = [
  { prefix: "", value: 10, suffix: "+", label: "Projects Delivered" },
  { prefix: "", value: 3, suffix: "x", label: "Avg. Performance Boost" },
  { prefix: "<", value: 48, suffix: "h", label: "Response Time" },
  { prefix: "", value: 100, suffix: "%", label: "Code Ownership" },
];

export function StatsSection() {
  return (
    <section className="py-20 relative">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-4xl md:text-5xl font-bold gradient-text tabular-nums">
                <CountUp value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
              </div>
              <p className="mt-2 text-sm text-muted-foreground font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
