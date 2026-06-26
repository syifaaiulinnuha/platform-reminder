import { useState, useEffect, useRef, useCallback } from "react";
import {
  Focus,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Volume2,
  VolumeX,
  Coffee,
  Brain,
} from "lucide-react";

const QUOTES = [
  {
    text: "The secret of getting ahead is getting started.",
    author: "Mark Twain",
  },
  {
    text: "It always seems impossible until it is done.",
    author: "Nelson Mandela",
  },
  {
    text: "Don't watch the clock; do what it does. Keep going.",
    author: "Sam Levenson",
  },
  {
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs",
  },
  {
    text: "Success is the sum of small efforts, repeated day in and day out.",
    author: "Robert Collier",
  },
  {
    text: "Your future is created by what you do today, not tomorrow.",
    author: "Robert Kiyosaki",
  },
  {
    text: "The expert in anything was once a beginner.",
    author: "Helen Hayes",
  },
  { text: "Small steps every day lead to big results.", author: "Unknown" },
];

export default function FocusPage() {
  const [mode, setMode] = useState<"pomodoro" | "short" | "long">("pomodoro");
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [quote, setQuote] = useState(QUOTES[0]);
  const [showComplete, setShowComplete] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const durations = {
    pomodoro: 25 * 60,
    short: 5 * 60,
    long: 15 * 60,
  };

  const resetTimer = useCallback(() => {
    setIsRunning(false);
    setTimeLeft(durations[mode]);
    setShowComplete(false);
  }, [mode]);

  useEffect(() => {
    resetTimer();
  }, [mode, resetTimer]);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
      setShowComplete(true);
      if (mode === "pomodoro") {
        setCompletedSessions((prev) => prev + 1);
      }
      if (soundEnabled && audioRef.current) {
        audioRef.current.play().catch(() => {});
      }
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, timeLeft, mode, soundEnabled]);

  useEffect(() => {
    setQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
  }, []);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progress = ((durations[mode] - timeLeft) / durations[mode]) * 100;

  const modeLabels = {
    pomodoro: { label: "Pomodoro", icon: Brain, color: "#1e3a5f" },
    short: { label: "Short Break", icon: Coffee, color: "#10b981" },
    long: { label: "Long Break", icon: Coffee, color: "#3b82f6" },
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)] flex items-center gap-2">
          <Focus className="w-6 h-6 text-[#d4af37]" />
          Focus Mode
        </h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">
          Eliminate distractions and deep work
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        {/* Mode Selector */}
        <div className="flex justify-center gap-2 mb-8">
          {(Object.keys(modeLabels) as Array<keyof typeof modeLabels>).map(
            (m) => {
              const ModeIcon = modeLabels[m].icon;
              return (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    mode === m
                      ? "bg-[var(--bg-tertiary)] text-[var(--text-primary)] border border-[var(--border-color)]"
                      : "text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]/50"
                  }`}
                >
                  <ModeIcon className="w-4 h-4" />
                  {modeLabels[m].label}
                </button>
              );
            },
          )}
        </div>

        {/* Timer Circle */}
        <div className="card p-8 flex flex-col items-center">
          {/* Progress Ring */}
          <div className="relative w-64 h-64 mb-8">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
              <circle
                cx="100"
                cy="100"
                r="90"
                fill="none"
                stroke="var(--bg-tertiary)"
                strokeWidth="8"
              />
              <circle
                cx="100"
                cy="100"
                r="90"
                fill="none"
                stroke={modeLabels[mode].color}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 90}
                strokeDashoffset={2 * Math.PI * 90 * (1 - progress / 100)}
                style={{ transition: "stroke-dashoffset 1s linear" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl font-mono font-bold text-[var(--text-primary)] tabular-nums">
                {String(minutes).padStart(2, "0")}:
                {String(seconds).padStart(2, "0")}
              </span>
              <span className="text-sm text-[var(--text-muted)] mt-1">
                {isRunning ? "Focusing..." : "Paused"}
              </span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4">
            <button
              onClick={resetTimer}
              className="p-3 rounded-xl hover:bg-[var(--bg-tertiary)] text-[var(--text-muted)] transition-colors"
              title="Reset"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsRunning(!isRunning)}
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-white transition-all hover:scale-105 active:scale-95"
              style={{ backgroundColor: modeLabels[mode].color }}
            >
              {isRunning ? (
                <Pause className="w-7 h-7" />
              ) : (
                <Play className="w-7 h-7 ml-0.5" />
              )}
            </button>
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-3 rounded-xl hover:bg-[var(--bg-tertiary)] text-[var(--text-muted)] transition-colors"
              title="Toggle sound"
            >
              {soundEnabled ? (
                <Volume2 className="w-5 h-5" />
              ) : (
                <VolumeX className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-6 mt-8">
            <div className="text-center">
              <p className="text-2xl font-bold text-[var(--text-primary)]">
                {completedSessions}
              </p>
              <p className="text-xs text-[var(--text-muted)]">Sessions</p>
            </div>
            <div className="w-px h-10 bg-[var(--border-color)]" />
            <div className="text-center">
              <p className="text-2xl font-bold text-[var(--text-primary)]">
                {Math.round(((completedSessions * 25) / 60) * 10) / 10}h
              </p>
              <p className="text-xs text-[var(--text-muted)]">Focus Time</p>
            </div>
            <div className="w-px h-10 bg-[var(--border-color)]" />
            <div className="text-center">
              <p className="text-2xl font-bold text-[var(--text-primary)]">
                {Math.round(completedSessions * 25)}
              </p>
              <p className="text-xs text-[var(--text-muted)]">Minutes</p>
            </div>
          </div>
        </div>

        {/* Quote */}
        <div className="card p-6 mt-6 text-center">
          <blockquote className="text-lg text-[var(--text-primary)] italic mb-2">
            &ldquo;{quote.text}&rdquo;
          </blockquote>
          <cite className="text-sm text-[var(--text-muted)] not-italic">
            — {quote.author}
          </cite>
        </div>

        {/* Session Complete */}
        {showComplete && (
          <div className="card p-6 mt-6 bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border-emerald-500/20">
            <div className="flex items-center justify-center gap-3 mb-3">
              <CheckCircle2 className="w-8 h-8 text-emerald-500" />
              <h3 className="text-xl font-bold text-emerald-500">
                Session Complete!
              </h3>
            </div>
            <p className="text-center text-[var(--text-secondary)] text-sm">
              Great job! Take a break before your next session.
            </p>
            <button
              onClick={() => {
                setShowComplete(false);
                setMode("short");
              }}
              className="mt-4 mx-auto block btn-primary text-sm"
            >
              Take Short Break
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
