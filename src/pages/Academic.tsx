import { useEffect, useState } from "react";
import {
  GraduationCap,
  BookOpen,
  Presentation,
  FileText,
  Target,
  Clock,
  Plus,
  Trash2,
  X,
  TrendingUp,
  Award,
} from "lucide-react";
import { supabase, type AcademicItem } from "../lib/supabase";
import ProgressBar from "../components/ProgressBar";
import { useCountdown } from "../hooks/useCountdown";

function AcademicCountdown({ deadline }: { deadline: string }) {
  const countdown = useCountdown(deadline);
  if (countdown.isExpired)
    return <span className="text-red-500 text-xs">Expired</span>;
  return (
    <span
      className={`text-xs font-mono ${countdown.isUrgent ? "text-red-500" : "text-[var(--text-muted)]"}`}
    >
      {countdown.days > 0 ? `${countdown.days}d ` : ""}
      {String(countdown.hours).padStart(2, "0")}:
      {String(countdown.minutes).padStart(2, "0")}
    </span>
  );
}

export default function Academic() {
  const [items, setItems] = useState<AcademicItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItem, setNewItem] = useState({
    title: "",
    type: "tugas" as const,
    course_name: "",
    deadline: "",
    priority: "medium" as const,
  });

  useEffect(() => {
    fetchItems();
  }, []);

  async function fetchItems() {
    const { data } = await supabase
      .from("academic_items")
      .select("*")
      .order("deadline", { ascending: true });
    if (data) setItems(data);
    setLoading(false);
  }

  async function addItem(e: React.FormEvent) {
    e.preventDefault();
    if (!newItem.title) return;
    await supabase.from("academic_items").insert({
      title: newItem.title,
      type: newItem.type,
      course_name: newItem.course_name,
      deadline: newItem.deadline || null,
      priority: newItem.priority,
      progress: 0,
      status: "active",
    });
    setNewItem({
      title: "",
      type: "tugas",
      course_name: "",
      deadline: "",
      priority: "medium",
    });
    setShowAddModal(false);
    fetchItems();
  }

  async function deleteItem(id: string) {
    await supabase.from("academic_items").delete().eq("id", id);
    fetchItems();
  }

  async function updateProgress(id: string, progress: number) {
    await supabase.from("academic_items").update({ progress }).eq("id", id);
    fetchItems();
  }

  const typeIcons = {
    tugas: BookOpen,
    presentasi: Presentation,
    ujian: FileText,
    penelitian: Target,
    target: Award,
  };

  const typeColors = {
    tugas: "#3b82f6",
    presentasi: "#8b5cf6",
    ujian: "#f59e0b",
    penelitian: "#10b981",
    target: "#d4af37",
  };

  const stats = {
    total: items.length,
    completed: items.filter((i) => i.progress === 100).length,
    urgent: items.filter(
      (i) =>
        i.deadline &&
        new Date(i.deadline).getTime() - new Date().getTime() <
          1000 * 60 * 60 * 48,
    ).length,
    avgProgress:
      items.length > 0
        ? Math.round(items.reduce((a, b) => a + b.progress, 0) / items.length)
        : 0,
  };

  const groupedByType = items.reduce(
    (acc, item) => {
      if (!acc[item.type]) acc[item.type] = [];
      acc[item.type].push(item);
      return acc;
    },
    {} as Record<string, AcademicItem[]>,
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-8 h-8 border-2 border-[#d4af37] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-[#d4af37]" />
            Academic Command Center
          </h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            All your academic tasks in one place
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary flex items-center gap-2 self-start"
        >
          <Plus className="w-4 h-4" />
          Add Item
        </button>
      </div>

      {/* Hero Banner */}
      <div className="card p-6 bg-gradient-to-br from-[#1e3a5f] to-[#2d5a87] text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-[#d4af37]" />
            <span className="text-sm text-white/70">Academic Progress</span>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
            <div>
              <p className="text-3xl font-bold">{stats.total}</p>
              <p className="text-xs text-white/60">Total Items</p>
            </div>
            <div>
              <p className="text-3xl font-bold">{stats.completed}</p>
              <p className="text-xs text-white/60">Completed</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-[#d4af37]">
                {stats.urgent}
              </p>
              <p className="text-xs text-white/60">Urgent</p>
            </div>
            <div>
              <p className="text-3xl font-bold">{stats.avgProgress}%</p>
              <p className="text-xs text-white/60">Avg Progress</p>
            </div>
          </div>
        </div>
      </div>

      {/* Items by Type */}
      <div className="space-y-6">
        {Object.entries(groupedByType).map(([type, typeItems]) => {
          const Icon = typeIcons[type as keyof typeof typeIcons] || BookOpen;
          const color =
            typeColors[type as keyof typeof typeColors] || "#3b82f6";
          return (
            <div key={type}>
              <div className="flex items-center gap-2 mb-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${color}15` }}
                >
                  <Icon className="w-4 h-4" style={{ color }} />
                </div>
                <h2 className="text-lg font-bold text-[var(--text-primary)] capitalize">
                  {type}
                </h2>
                <span className="text-xs text-[var(--text-muted)] bg-[var(--bg-tertiary)] px-2 py-0.5 rounded-full">
                  {typeItems.length}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {typeItems.map((item) => (
                  <div key={item.id} className="card p-4 group relative">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            item.priority === "high"
                              ? "bg-red-500/10 text-red-500"
                              : item.priority === "medium"
                                ? "bg-amber-500/10 text-amber-500"
                                : "bg-emerald-500/10 text-emerald-500"
                          }`}
                        >
                          {item.priority}
                        </span>
                        {item.deadline && (
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-[var(--text-muted)]" />
                            <AcademicCountdown deadline={item.deadline} />
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => deleteItem(item.id)}
                        className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-500/10 text-red-500 transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <h3 className="font-semibold text-[var(--text-primary)] mb-1">
                      {item.title}
                    </h3>
                    {item.course_name && (
                      <p className="text-xs text-[var(--text-muted)] mb-2">
                        {item.course_name}
                      </p>
                    )}
                    <ProgressBar
                      progress={item.progress}
                      color={color}
                      height={6}
                      label={item.title}
                      showPercentage={false}
                    />
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={item.progress}
                      onChange={(e) =>
                        updateProgress(item.id, parseInt(e.target.value))
                      }
                      className="w-full mt-2 h-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    />
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {items.length === 0 && (
        <div className="text-center py-16">
          <GraduationCap className="w-12 h-12 text-[var(--text-muted)] mx-auto mb-4" />
          <p className="text-[var(--text-muted)]">No academic items yet</p>
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-[var(--bg-secondary)] rounded-2xl p-6 w-full max-w-md border border-[var(--border-color)] shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-[var(--text-primary)]">
                Add Academic Item
              </h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg hover:bg-[var(--bg-tertiary)]"
              >
                <X className="w-5 h-5 text-[var(--text-muted)]" />
              </button>
            </div>
            <form onSubmit={addItem} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                  Title
                </label>
                <input
                  type="text"
                  required
                  value={newItem.title}
                  onChange={(e) =>
                    setNewItem({ ...newItem, title: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[#d4af37]/30 text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                    Type
                  </label>
                  <select
                    value={newItem.type}
                    onChange={(e) =>
                      setNewItem({
                        ...newItem,
                        type: e.target.value as typeof newItem.type,
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[#d4af37]/30 text-sm"
                  >
                    <option value="tugas">Tugas</option>
                    <option value="presentasi">Presentasi</option>
                    <option value="ujian">Ujian</option>
                    <option value="penelitian">Penelitian</option>
                    <option value="target">Target</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                    Priority
                  </label>
                  <select
                    value={newItem.priority}
                    onChange={(e) =>
                      setNewItem({
                        ...newItem,
                        priority: e.target.value as typeof newItem.priority,
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[#d4af37]/30 text-sm"
                  >
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                  Course / Subject
                </label>
                <input
                  type="text"
                  value={newItem.course_name}
                  onChange={(e) =>
                    setNewItem({ ...newItem, course_name: e.target.value })
                  }
                  placeholder="e.g., Algoritma dan Struktur Data"
                  className="w-full px-3 py-2 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[#d4af37]/30 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                  Deadline (optional)
                </label>
                <input
                  type="datetime-local"
                  value={newItem.deadline}
                  onChange={(e) =>
                    setNewItem({ ...newItem, deadline: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[#d4af37]/30 text-sm"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-[var(--border-color)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
                <button type="submit" className="flex-1 btn-primary text-sm">
                  Add Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
