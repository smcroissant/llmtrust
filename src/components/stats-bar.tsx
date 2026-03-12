/**
 * StatsBar — LLM Trust's signature stats display.
 *
 * Shows key metrics with gradient numbers and
 * subtle divider lines between each stat.
 */

interface Stat {
  value: string;
  label: string;
  /** Optional accent color override */
  accent?: "primary" | "amber" | "teal";
}

interface StatsBarProps {
  stats?: Stat[];
}

const defaultStats: Stat[] = [
  { value: "200+", label: "Open-Source Models" },
  { value: "500K+", label: "Downloads" },
  { value: "15+", label: "Architectures" },
  { value: "100%", label: "Free & Open" },
];

export function StatsBar({ stats = defaultStats }: StatsBarProps) {
  return (
    <section className="border-y border-border/60 bg-surface py-10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-4">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className={`text-center ${
                index < stats.length - 1
                  ? "md:border-r md:border-border/40"
                  : ""
              }`}
            >
              <p className="stat-number">{stat.value}</p>
              <p className="mt-1.5 text-sm text-muted-foreground">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
