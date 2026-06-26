import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Clock,
  CalendarDays,
  NotebookPen,
  Focus,
  ChevronRight,
  Flame,
  Target,
  Zap,
  AlertTriangle,
} from "lucide-react";
import {
  supabase,
  type Task,
  type LifeGoal,
  type CalendarEvent,
} from "../lib/supabase";
import CountdownCard from "../components/CountdownCard";
import ProgressRing from "../components/ProgressRing";
import StatCard from "../components/StatCard";

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [goals, setGoals] = useState<LifeGoal[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    async function fetchData() {
      const [tasksRes, goalsRes, eventsRes] = await Promise.all([
        supabase
          .from("tasks")
          .select("*")
          .order("deadline", { ascending: true })
          .limit(6),
        supabase
          .from("life_goals")
          .select("*")
          .order("created_at", { ascending: true }),
        supabase
          .from("events")
          .select("*")
          .gte("start_time", new Date().toISOString())
          .order("start_time", { ascending: true })
          .limit(3),
      ]);

      if (tasksRes.data) setTasks(tasksRes.data);
      if (goalsRes.data) setGoals(goalsRes.data);
      if (eventsRes.data) setEvents(eventsRes.data);
      setLoading(false);
    }
    fetchData();
  }, []);

  const urgentTasks = tasks.filter((t) => {
    const diff = new Date(t.deadline).getTime() - new Date().getTime();
    return diff > 0 && diff < 1000 * 60 * 60 * 48;
  });

  const hoursLeftToday = Math.max(0, 24 - currentTime.getHours());

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-8 h-8 border-2 border-[#d4af37] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Hero Section */}
      <div className="card p-6 lg:p-8 bg-gradient-to-br from-[#1e3a5f] to-[#2d5a87] text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Flame className="w-5 h-5 text-[#d4af37]" />
            <span className="text-sm text-white/70">Welcome back</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold mb-2">
            Hari ini tersisa{" "}
            <span className="text-[#d4af37]">{hoursLeftToday} jam</span>
          </h1>
          {urgentTasks.length > 0 && (
            <div className="flex items-center gap-2 text-white/90">
              <AlertTriangle className="w-4 h-4 text-[#d4af37]" />
              <span className="text-sm">
                Deadline terdekat: <strong>{urgentTasks[0].title}</strong>
              </span>
            </div>
          )}
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              to="/focus"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors text-sm font-medium"
            >
              <Focus className="w-4 h-4" />
              Start Focus
            </Link>
            <Link
              to="/deadlines"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors text-sm font-medium"
            >
              <Clock className="w-4 h-4" />
              View Deadlines
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Clock}
          label="Active Deadlines"
          value={String(tasks.filter((t) => t.status === "active").length)}
          subtext={`${urgentTasks.length} urgent`}
          trend="up"
          color="#dc2626"
        />
        <StatCard
          icon={CalendarDays}
          label="Upcoming Events"
          value={String(events.length)}
          subtext="This week"
          color="#3b82f6"
        />
        <StatCard
          icon={NotebookPen}
          label="Notes"
          value="3"
          subtext="2 folders"
          color="#8b5cf6"
        />
        <StatCard
          icon={Zap}
          label="Focus Hours"
          value="12.5"
          subtext="This week"
          trend="up"
          color="#d4af37"
        />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Deadlines Column */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[var(--text-primary)] flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#d4af37]" />
              Upcoming Deadlines
            </h2>
            <Link
              to="/deadlines"
              className="text-sm text-[#d4af37] hover:underline flex items-center gap-1"
            >
              View all <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {tasks.slice(0, 4).map((task) => (
              <CountdownCard key={task.id} task={task} compact />
            ))}
          </div>
        </div>

        {/* Side Column */}
        <div className="space-y-6">
          {/* Life Progress */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-[var(--text-primary)] flex items-center gap-2">
                <Target className="w-5 h-5 text-[#d4af37]" />
                Life Progress
              </h2>
              <Link
                to="/analytics"
                className="text-sm text-[#d4af37] hover:underline"
              >
                Details
              </Link>
            </div>
            <div className="space-y-4">
              {goals.slice(0, 3).map((goal) => (
                <div key={goal.id} className="flex items-center gap-3">
                  <ProgressRing
                    progress={Math.round(
                      (goal.current_value / goal.target_value) * 100,
                    )}
                    size={56}
                    strokeWidth={5}
                    color={goal.color}
                    value={`${goal.current_value}`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[var(--text-primary)] truncate">
                      {goal.title}
                    </p>
                    <p className="text-xs text-[var(--text-muted)]">
                      {goal.current_value} / {goal.target_value} {goal.unit}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Today's Events */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-[var(--text-primary)] flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-[#3b82f6]" />
                Today&apos;s Events
              </h2>
            </div>
            <div className="space-y-3">
              {events.length === 0 ? (
                <p className="text-sm text-[var(--text-muted)] text-center py-4">
                  No events today
                </p>
              ) : (
                events.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-start gap-3 p-3 rounded-xl bg-[var(--bg-tertiary)]"
                  >
                    <div
                      className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                      style={{ backgroundColor: event.color }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[var(--text-primary)] truncate">
                        {event.title}
                      </p>
                      <p className="text-xs text-[var(--text-muted)]">
                        {new Date(event.start_time).toLocaleTimeString(
                          "id-ID",
                          { hour: "2-digit", minute: "2-digit" },
                        )}
                        {event.end_time &&
                          ` - ${new Date(event.end_time).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}`}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
