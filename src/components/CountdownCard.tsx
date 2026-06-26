import { Clock, AlertTriangle } from "lucide-react";
import { useCountdown } from "../hooks/useCountdown";
import type { Task } from "../lib/supabase";

interface CountdownCardProps {
  task: Task;
  compact?: boolean;
}

export default function CountdownCard({
  task,
  compact = false,
}: CountdownCardProps) {
  const countdown = useCountdown(task.deadline);

  const priorityColors = {
    high: "from-red-500 to-red-600",
    medium: "from-amber-500 to-amber-600",
    low: "from-emerald-500 to-emerald-600",
  };

  const priorityLabel = {
    high: "High Priority",
    medium: "Medium Priority",
    low: "Low Priority",
  };

  const priorityBg = {
    high: "bg-red-50 dark:bg-red-900/20",
    medium: "bg-amber-50 dark:bg-amber-900/20",
    low: "bg-emerald-50 dark:bg-emerald-900/20",
  };

  if (compact) {
    return (
      <div className="card p-4 hover:scale-[1.02] transition-transform cursor-pointer">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full bg-gradient-to-r ${priorityColors[task.priority as keyof typeof priorityColors] || priorityColors.medium}`}
            />
            <span className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
              {task.category || "General"}
            </span>
          </div>
          {countdown.isUrgent && (
            <AlertTriangle className="w-4 h-4 text-red-500 animate-pulse" />
          )}
        </div>
        <h3 className="font-semibold text-[var(--text-primary)] mb-1 truncate">
          {task.title}
        </h3>
        <div className="flex items-center gap-1.5 text-sm">
          <Clock className="w-3.5 h-3.5 text-[var(--text-muted)]" />
          <span
            className={`font-mono font-bold ${countdown.isUrgent ? "text-red-500" : "text-[var(--text-secondary)]"}`}
          >
            {countdown.isExpired
              ? "Expired"
              : countdown.days > 0
                ? `${countdown.days}d ${countdown.hours}h`
                : `${countdown.hours}h ${countdown.minutes}m`}
          </span>
        </div>
        <div className="mt-2 w-full h-1.5 bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full bg-gradient-to-r ${priorityColors[task.priority as keyof typeof priorityColors] || priorityColors.medium} transition-all duration-500`}
            style={{ width: `${task.progress}%` }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="card p-5">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span
            className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider text-white bg-gradient-to-r ${priorityColors[task.priority as keyof typeof priorityColors] || priorityColors.medium}`}
          >
            {task.priority}
          </span>
          <span className="text-xs text-[var(--text-muted)]">
            {task.category}
          </span>
        </div>
        {countdown.isUrgent && (
          <div className="flex items-center gap-1 text-red-500">
            <AlertTriangle className="w-4 h-4 animate-pulse" />
            <span className="text-xs font-medium">Urgent</span>
          </div>
        )}
      </div>

      <h3 className="text-lg font-bold text-[var(--text-primary)] mb-1">
        {task.title}
      </h3>
      {task.description && (
        <p className="text-sm text-[var(--text-secondary)] mb-3 line-clamp-2">
          {task.description}
        </p>
      )}

      <div
        className={`flex items-center gap-4 p-3 rounded-xl ${priorityBg[task.priority as keyof typeof priorityBg] || priorityBg.medium} mb-3`}
      >
        <Clock
          className={`w-5 h-5 ${countdown.isUrgent ? "text-red-500" : "text-[var(--text-muted)]"}`}
        />
        <div>
          <div
            className={`font-mono text-xl font-bold ${countdown.isUrgent ? "text-red-500" : "text-[var(--text-primary)]"}`}
          >
            {countdown.isExpired ? (
              "Expired"
            ) : (
              <>
                {countdown.days > 0 && (
                  <span>
                    {countdown.days}
                    <span className="text-sm font-normal text-[var(--text-muted)]">
                      d
                    </span>{" "}
                  </span>
                )}
                <span>{String(countdown.hours).padStart(2, "0")}</span>
                <span className="text-sm font-normal text-[var(--text-muted)]">
                  :
                </span>
                <span>{String(countdown.minutes).padStart(2, "0")}</span>
                <span className="text-sm font-normal text-[var(--text-muted)]">
                  :
                </span>
                <span>{String(countdown.seconds).padStart(2, "0")}</span>
              </>
            )}
          </div>
          <p className="text-xs text-[var(--text-muted)]">
            {priorityLabel[task.priority as keyof typeof priorityLabel]}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex-1 mr-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-[var(--text-muted)]">Progress</span>
            <span className="text-xs font-medium text-[var(--text-primary)]">
              {task.progress}%
            </span>
          </div>
          <div className="w-full h-2 bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full bg-gradient-to-r ${priorityColors[task.priority as keyof typeof priorityColors] || priorityColors.medium} transition-all duration-700`}
              style={{ width: `${task.progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
