import { useState } from "react";
import { Outlet, useLocation, Link } from "react-router-dom";
import {
  LayoutDashboard,
  Clock,
  CalendarDays,
  NotebookPen,
  Focus,
  BarChart3,
  GraduationCap,
  Settings,
  Menu,
  // X removed - unused
  Moon,
  Sun,
  Search,
} from "lucide-react";
import { useTheme } from "../hooks/useTheme";

const navItems = [
  { path: "/", label: "Dashboard", icon: LayoutDashboard },
  { path: "/deadlines", label: "Deadlines", icon: Clock },
  { path: "/calendar", label: "Calendar", icon: CalendarDays },
  { path: "/notes", label: "Notes", icon: NotebookPen },
  { path: "/focus", label: "Focus", icon: Focus },
  { path: "/academic", label: "Academic", icon: GraduationCap },
  { path: "/analytics", label: "Analytics", icon: BarChart3 },
  { path: "/settings", label: "Settings", icon: Settings },
];

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isDark, toggle } = useTheme();
  const location = useLocation();

  return (
    <div className="flex min-h-screen bg-[var(--bg-primary)] transition-colors duration-300">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-64 flex flex-col border-r border-[var(--border-color)] bg-[var(--bg-secondary)] transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-[var(--border-color)]">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#1e3a5f] to-[#d4af37] flex items-center justify-center">
            <Clock className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-[var(--text-primary)] leading-tight">
              LifeClock
            </h1>
            <p className="text-[10px] text-[var(--text-muted)] tracking-wider uppercase">
              Productivity
            </p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-[#1e3a5f]/10 to-transparent text-[#1e3a5f] dark:text-[#60a5fa]"
                    : "text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]"
                }`}
              >
                <Icon
                  className={`w-4.5 h-4.5 ${isActive ? "text-[#d4af37]" : ""}`}
                />
                <span>{item.label}</span>
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#d4af37]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="px-4 py-4 border-t border-[var(--border-color)]">
          <button
            onClick={toggle}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] transition-all"
          >
            {isDark ? (
              <Sun className="w-4.5 h-4.5" />
            ) : (
              <Moon className="w-4.5 h-4.5" />
            )}
            <span>{isDark ? "Light Mode" : "Dark Mode"}</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-30 glass border-b border-[var(--border-color)]">
          <div className="flex items-center justify-between px-4 lg:px-8 py-3">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors"
              >
                <Menu className="w-5 h-5 text-[var(--text-primary)]" />
              </button>
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)]">
                <Search className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                <span className="text-xs text-[var(--text-muted)]">
                  Search...
                </span>
                <kbd className="hidden lg:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono bg-[var(--bg-secondary)] text-[var(--text-muted)] border border-[var(--border-color)]">
                  ⌘K
                </kbd>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 text-xs text-[var(--text-muted)]">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Online</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#1e3a5f] to-[#d4af37] flex items-center justify-center text-white text-xs font-bold">
                LC
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
