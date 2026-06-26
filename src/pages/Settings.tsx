import { useState } from "react";
import {
  Settings,
  Moon,
  Sun,
  Bell,
  Clock,
  Shield,
  Download,
  Trash2,
  AlertTriangle,
  Check,
} from "lucide-react";
import { useTheme } from "../hooks/useTheme";

export default function SettingsPage() {
  const { isDark, toggle } = useTheme();
  const [notifications, setNotifications] = useState(true);
  const [pomodoroDuration, setPomodoroDuration] = useState(25);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleSave = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)] flex items-center gap-2">
          <Settings className="w-6 h-6 text-[#d4af37]" />
          Settings
        </h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">
          Customize your LifeClock experience
        </p>
      </div>

      <div className="max-w-2xl space-y-4">
        {/* Appearance */}
        <div className="card p-5">
          <h2 className="text-lg font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
            <Moon className="w-5 h-5 text-[var(--text-muted)]" />
            Appearance
          </h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[var(--text-primary)]">
                Dark Mode
              </p>
              <p className="text-xs text-[var(--text-muted)]">
                Switch between light and dark themes
              </p>
            </div>
            <button
              onClick={toggle}
              className={`relative w-12 h-7 rounded-full transition-colors ${isDark ? "bg-[#1e3a5f]" : "bg-[var(--bg-tertiary)] border border-[var(--border-color)]"}`}
            >
              <div
                className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-md transition-transform ${isDark ? "translate-x-5" : "translate-x-0.5"}`}
              >
                {isDark ? (
                  <Moon className="w-3.5 h-3.5 text-[#1e3a5f] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                ) : (
                  <Sun className="w-3.5 h-3.5 text-amber-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                )}
              </div>
            </button>
          </div>
        </div>

        {/* Notifications */}
        <div className="card p-5">
          <h2 className="text-lg font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
            <Bell className="w-5 h-5 text-[var(--text-muted)]" />
            Notifications
          </h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[var(--text-primary)]">
                Deadline Reminders
              </p>
              <p className="text-xs text-[var(--text-muted)]">
                Get notified when deadlines are approaching
              </p>
            </div>
            <button
              onClick={() => setNotifications(!notifications)}
              className={`relative w-12 h-7 rounded-full transition-colors ${notifications ? "bg-emerald-500" : "bg-[var(--bg-tertiary)] border border-[var(--border-color)]"}`}
            >
              <div
                className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-md transition-transform ${notifications ? "translate-x-5" : "translate-x-0.5"}`}
              />
            </button>
          </div>
        </div>

        {/* Focus Settings */}
        <div className="card p-5">
          <h2 className="text-lg font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-[var(--text-muted)]" />
            Focus Mode
          </h2>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-[var(--text-primary)]">
                  Pomodoro Duration
                </p>
                <span className="text-sm font-bold text-[#d4af37]">
                  {pomodoroDuration} min
                </span>
              </div>
              <input
                type="range"
                min={10}
                max={60}
                step={5}
                value={pomodoroDuration}
                onChange={(e) => setPomodoroDuration(parseInt(e.target.value))}
                className="w-full h-2 bg-[var(--bg-tertiary)] rounded-full appearance-none cursor-pointer accent-[#d4af37]"
              />
              <div className="flex justify-between text-xs text-[var(--text-muted)] mt-1">
                <span>10 min</span>
                <span>60 min</span>
              </div>
            </div>
          </div>
        </div>

        {/* Data Management */}
        <div className="card p-5">
          <h2 className="text-lg font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-[var(--text-muted)]" />
            Data Management
          </h2>
          <div className="space-y-3">
            <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-[var(--bg-tertiary)] transition-colors text-left">
              <Download className="w-5 h-5 text-[var(--text-muted)]" />
              <div>
                <p className="text-sm font-medium text-[var(--text-primary)]">
                  Export Data
                </p>
                <p className="text-xs text-[var(--text-muted)]">
                  Download all your data as JSON
                </p>
              </div>
            </button>
            <button
              onClick={() => setShowResetConfirm(true)}
              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-red-500/5 transition-colors text-left"
            >
              <Trash2 className="w-5 h-5 text-red-500" />
              <div>
                <p className="text-sm font-medium text-red-500">
                  Reset All Data
                </p>
                <p className="text-xs text-[var(--text-muted)]">
                  Clear all tasks, notes, and goals
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* About */}
        <div className="card p-5">
          <h2 className="text-lg font-bold text-[var(--text-primary)] mb-2">
            About LifeClock
          </h2>
          <p className="text-sm text-[var(--text-secondary)] mb-3">
            LifeClock is a personal productivity app designed for students. It
            combines deadline tracking, note-taking, focus sessions, and life
            progress tracking in one elegant interface.
          </p>
          <div className="flex items-center gap-4 text-xs text-[var(--text-muted)]">
            <span>Version 1.0.0</span>
            <span>Built with React + Supabase</span>
          </div>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-[var(--bg-secondary)] rounded-2xl p-6 w-full max-w-sm border border-[var(--border-color)] shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[var(--text-primary)]">
                  Reset All Data?
                </h2>
                <p className="text-xs text-[var(--text-muted)]">
                  This action cannot be undone
                </p>
              </div>
            </div>
            <p className="text-sm text-[var(--text-secondary)] mb-4">
              All your tasks, notes, events, goals, and focus sessions will be
              permanently deleted.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 py-2.5 rounded-xl border border-[var(--border-color)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] text-sm font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowResetConfirm(false);
                  handleSave();
                }}
                className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 animate-slide-up">
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-500 text-white shadow-lg">
            <Check className="w-4 h-4" />
            <span className="text-sm font-medium">Settings saved</span>
          </div>
        </div>
      )}
    </div>
  );
}
