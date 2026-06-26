interface ProgressBarProps {
  progress: number;
  color?: string;
  height?: number;
  label?: string;
  showPercentage?: boolean;
}

export default function ProgressBar({
  progress,
  color = "#1e3a5f",
  height = 8,
  label,
  showPercentage = true,
}: ProgressBarProps) {
  return (
    <div className="w-full">
      {label && (
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-sm font-medium text-[var(--text-primary)]">
            {label}
          </span>
          {showPercentage && (
            <span className="text-sm font-bold text-[var(--text-secondary)]">
              {progress}%
            </span>
          )}
        </div>
      )}
      <div
        className="w-full rounded-full overflow-hidden bg-[var(--bg-tertiary)]"
        style={{ height }}
      >
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{
            width: `${Math.min(progress, 100)}%`,
            backgroundColor: color,
          }}
        />
      </div>
    </div>
  );
}
