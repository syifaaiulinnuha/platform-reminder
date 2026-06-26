import { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  subtext?: string;
  trend?: "up" | "down" | "neutral";
  color?: string;
}

export default function StatCard({
  icon: Icon,
  label,
  value,
  subtext,
  trend = "neutral",
  color = "#1e3a5f",
}: StatCardProps) {
  const trendColors = {
    up: "text-emerald-500",
    down: "text-red-500",
    neutral: "text-[var(--text-muted)]",
  };

  return (
    <div className="card p-5 flex items-start gap-4">
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: `${color}15` }}
      >
        <Icon className="w-6 h-6" style={{ color }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider mb-1">
          {label}
        </p>
        <p className="text-2xl font-bold text-[var(--text-primary)]">{value}</p>
        {subtext && (
          <p className={`text-xs mt-1 ${trendColors[trend]}`}>{subtext}</p>
        )}
      </div>
    </div>
  );
}
