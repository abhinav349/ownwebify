import { StaggerGroup, StaggerItem } from "@/components/demos/shared/reveal";
import { CountUp } from "@/components/demos/shared/count-up";

export function StatsRow({
  stats,
  accent,
}: {
  stats: { value: number; suffix?: string; label: string }[];
  accent: string;
}) {
  return (
    <StaggerGroup className="grid grid-cols-3 gap-6 md:gap-8">
      {stats.map((stat) => (
        <StaggerItem key={stat.label}>
          <p className="font-display text-3xl md:text-4xl" style={{ color: accent }}>
            <CountUp to={stat.value} suffix={stat.suffix ?? ""} />
          </p>
          <p className="mt-1 text-xs text-white/50 uppercase tracking-wider">{stat.label}</p>
        </StaggerItem>
      ))}
    </StaggerGroup>
  );
}
