import { useEffect, useState, useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  Plus,
  Clock,
  X,
} from "lucide-react";
import { supabase, type CalendarEvent } from "../lib/supabase";

export default function CalendarPage() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showAddModal, setShowAddModal] = useState(false);
  const [, setSelectedDate] = useState<Date | null>(null);
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    start_time: "",
    end_time: "",
    color: "#1e3a5f",
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  async function fetchEvents() {
    const { data } = await supabase
      .from("events")
      .select("*")
      .order("start_time", { ascending: true });
    if (data) setEvents(data);
  }

  async function addEvent(e: React.FormEvent) {
    e.preventDefault();
    if (!newEvent.title || !newEvent.start_time) return;
    await supabase.from("events").insert({
      title: newEvent.title,
      description: newEvent.description,
      start_time: newEvent.start_time,
      end_time: newEvent.end_time || null,
      color: newEvent.color,
    });
    setNewEvent({
      title: "",
      description: "",
      start_time: "",
      end_time: "",
      color: "#1e3a5f",
    });
    setShowAddModal(false);
    setSelectedDate(null);
    fetchEvents();
  }

  async function deleteEvent(id: string) {
    await supabase.from("events").delete().eq("id", id);
    fetchEvents();
  }

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const calendarDays = useMemo(() => {
    const days: {
      date: Date;
      isCurrentMonth: boolean;
      events: CalendarEvent[];
    }[] = [];

    // Previous month padding
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, daysInPrevMonth - i),
        isCurrentMonth: false,
        events: [],
      });
    }

    // Current month
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      const dayEvents = events.filter((ev) => {
        const evDate = new Date(ev.start_time);
        return (
          evDate.getDate() === i &&
          evDate.getMonth() === month &&
          evDate.getFullYear() === year
        );
      });
      days.push({ date, isCurrentMonth: true, events: dayEvents });
    }

    // Next month padding
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false,
        events: [],
      });
    }

    return days;
  }, [year, month, events, firstDayOfMonth, daysInMonth, daysInPrevMonth]);

  const today = new Date();
  const isToday = (date: Date) =>
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();

  const upcomingEvents = events
    .filter((e) => new Date(e.start_time) >= new Date())
    .sort(
      (a, b) =>
        new Date(a.start_time).getTime() - new Date(b.start_time).getTime(),
    )
    .slice(0, 10);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] flex items-center gap-2">
            <CalendarDays className="w-6 h-6 text-[#d4af37]" />
            Calendar
          </h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            Plan your schedule and never miss an event
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary flex items-center gap-2 self-start"
        >
          <Plus className="w-4 h-4" />
          Add Event
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2 card p-5">
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => setCurrentDate(new Date(year, month - 1, 1))}
              className="p-2 rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-[var(--text-primary)]" />
            </button>
            <h2 className="text-xl font-bold text-[var(--text-primary)]">
              {monthNames[month]} {year}
            </h2>
            <button
              onClick={() => setCurrentDate(new Date(year, month + 1, 1))}
              className="p-2 rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-[var(--text-primary)]" />
            </button>
          </div>

          {/* Weekday Headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekDays.map((day) => (
              <div
                key={day}
                className="text-center text-xs font-medium text-[var(--text-muted)] py-2"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, idx) => (
              <button
                key={idx}
                onClick={() => {
                  if (day.isCurrentMonth) {
                    setSelectedDate(day.date);
                    const dateStr = day.date.toISOString().slice(0, 16);
                    setNewEvent((prev) => ({ ...prev, start_time: dateStr }));
                    setShowAddModal(true);
                  }
                }}
                className={`relative aspect-square rounded-xl p-1 flex flex-col items-center justify-start transition-all ${
                  day.isCurrentMonth
                    ? "hover:bg-[var(--bg-tertiary)] cursor-pointer"
                    : "opacity-30 cursor-default"
                } ${isToday(day.date) ? "ring-2 ring-[#d4af37]" : ""}`}
              >
                <span
                  className={`text-sm font-medium ${
                    isToday(day.date)
                      ? "text-[#d4af37]"
                      : day.isCurrentMonth
                        ? "text-[var(--text-primary)]"
                        : "text-[var(--text-muted)]"
                  }`}
                >
                  {day.date.getDate()}
                </span>
                {day.events.length > 0 && (
                  <div className="flex flex-wrap gap-0.5 mt-1 justify-center">
                    {day.events.slice(0, 3).map((ev, i) => (
                      <div
                        key={i}
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: ev.color }}
                      />
                    ))}
                    {day.events.length > 3 && (
                      <span className="text-[8px] text-[var(--text-muted)]">
                        +
                      </span>
                    )}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Upcoming Events Sidebar */}
        <div className="card p-5">
          <h2 className="text-lg font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#d4af37]" />
            Upcoming Events
          </h2>
          <div className="space-y-3 max-h-[500px] overflow-y-auto">
            {upcomingEvents.length === 0 ? (
              <p className="text-sm text-[var(--text-muted)] text-center py-8">
                No upcoming events
              </p>
            ) : (
              upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className="group flex items-start gap-3 p-3 rounded-xl bg-[var(--bg-tertiary)] hover:bg-[var(--border-color)] transition-colors"
                >
                  <div
                    className="w-3 h-3 rounded-full mt-1 flex-shrink-0"
                    style={{ backgroundColor: event.color }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[var(--text-primary)] truncate">
                      {event.title}
                    </p>
                    <p className="text-xs text-[var(--text-muted)]">
                      {new Date(event.start_time).toLocaleDateString("id-ID", {
                        weekday: "short",
                        day: "numeric",
                        month: "short",
                      })}
                      {" · "}
                      {new Date(event.start_time).toLocaleTimeString("id-ID", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <button
                    onClick={() => deleteEvent(event.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-500/10 text-red-500 transition-all"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Add Event Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-[var(--bg-secondary)] rounded-2xl p-6 w-full max-w-md border border-[var(--border-color)] shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-[var(--text-primary)]">
                Add Event
              </h2>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setSelectedDate(null);
                }}
                className="p-1 rounded-lg hover:bg-[var(--bg-tertiary)]"
              >
                <X className="w-5 h-5 text-[var(--text-muted)]" />
              </button>
            </div>
            <form onSubmit={addEvent} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                  Title
                </label>
                <input
                  type="text"
                  required
                  value={newEvent.title}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, title: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[#d4af37]/30 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                  Description
                </label>
                <textarea
                  value={newEvent.description}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, description: e.target.value })
                  }
                  rows={2}
                  className="w-full px-3 py-2 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[#d4af37]/30 text-sm resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                    Start
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={newEvent.start_time}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, start_time: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[#d4af37]/30 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                    End (optional)
                  </label>
                  <input
                    type="datetime-local"
                    value={newEvent.end_time}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, end_time: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[#d4af37]/30 text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                  Color
                </label>
                <div className="flex gap-2">
                  {[
                    "#1e3a5f",
                    "#dc2626",
                    "#10b981",
                    "#f59e0b",
                    "#8b5cf6",
                    "#3b82f6",
                  ].map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setNewEvent({ ...newEvent, color: c })}
                      className={`w-8 h-8 rounded-lg transition-all ${newEvent.color === c ? "ring-2 ring-offset-2 ring-[var(--text-primary)]" : ""}`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setSelectedDate(null);
                  }}
                  className="flex-1 py-2.5 rounded-xl border border-[var(--border-color)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
                <button type="submit" className="flex-1 btn-primary text-sm">
                  Add Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
