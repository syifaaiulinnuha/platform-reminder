import { useEffect, useState } from "react";
import {
  Clock,
  Plus,
  Filter,
  Search,
  CheckCircle2,
  Trash2,
  X,
} from "lucide-react";
import { supabase, type Task } from "../lib/supabase";
import CountdownCard from "../components/CountdownCard";
import ProgressBar from "../components/ProgressBar";

export default function Deadlines() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "high" | "medium" | "low">(
    "all",
  );
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    deadline: "",
    priority: "medium" as "high" | "medium" | "low",
    category: "",
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  async function fetchTasks() {
    const { data } = await supabase
      .from("tasks")
      .select("*")
      .order("deadline", { ascending: true });
    if (data) setTasks(data);
    setLoading(false);
  }

  async function addTask(e: React.FormEvent) {
    e.preventDefault();
    if (!newTask.title || !newTask.deadline) return;
    await supabase.from("tasks").insert({
      title: newTask.title,
      description: newTask.description,
      deadline: newTask.deadline,
      priority: newTask.priority,
      category: newTask.category || "General",
      progress: 0,
      status: "active",
    });
    setNewTask({
      title: "",
      description: "",
      deadline: "",
      priority: "medium",
      category: "",
    });
    setShowAddModal(false);
    fetchTasks();
  }

  async function deleteTask(id: string) {
    await supabase.from("tasks").delete().eq("id", id);
    fetchTasks();
  }

  async function updateProgress(id: string, progress: number) {
    await supabase.from("tasks").update({ progress }).eq("id", id);
    fetchTasks();
  }

  const filteredTasks = tasks.filter((t) => {
    if (filter !== "all" && t.priority !== filter) return false;
    if (search && !t.title.toLowerCase().includes(search.toLowerCase()))
      return false;
    return true;
  });

  const stats = {
    total: tasks.length,
    urgent: tasks.filter((t) => {
      const diff = new Date(t.deadline).getTime() - new Date().getTime();
      return diff > 0 && diff < 1000 * 60 * 60 * 48;
    }).length,
    completed: tasks.filter((t) => t.progress === 100).length,
    high: tasks.filter((t) => t.priority === "high").length,
  };

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
            <Clock className="w-6 h-6 text-[#d4af37]" />
            Deadline Center
          </h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            Manage all your deadlines in one place
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary flex items-center gap-2 self-start"
        >
          <Plus className="w-4 h-4" />
          Add Deadline
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-4">
          <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider">
            Total
          </p>
          <p className="text-2xl font-bold text-[var(--text-primary)]">
            {stats.total}
          </p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider">
            Urgent
          </p>
          <p className="text-2xl font-bold text-red-500">{stats.urgent}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider">
            Completed
          </p>
          <p className="text-2xl font-bold text-emerald-500">
            {stats.completed}
          </p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider">
            High Priority
          </p>
          <p className="text-2xl font-bold text-[#d4af37]">{stats.high}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
          <input
            type="text"
            placeholder="Search deadlines..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[#d4af37]/30 text-sm"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[var(--text-muted)]" />
          {(["all", "high", "medium", "low"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${
                filter === f
                  ? "bg-[#1e3a5f] text-white"
                  : "bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:bg-[var(--border-color)]"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Tasks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredTasks.map((task) => (
          <div key={task.id} className="relative group">
            <CountdownCard task={task} />
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
              <button
                onClick={() =>
                  updateProgress(task.id, task.progress >= 100 ? 0 : 100)
                }
                className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500"
                title="Toggle complete"
              >
                <CheckCircle2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => deleteTask(task.id)}
                className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div className="px-5 pb-4 -mt-2">
              <ProgressBar
                progress={task.progress}
                color={
                  task.priority === "high"
                    ? "#dc2626"
                    : task.priority === "medium"
                      ? "#f59e0b"
                      : "#10b981"
                }
                height={6}
              />
              <input
                type="range"
                min={0}
                max={100}
                value={task.progress}
                onChange={(e) =>
                  updateProgress(task.id, parseInt(e.target.value))
                }
                className="w-full mt-2 h-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              />
            </div>
          </div>
        ))}
      </div>

      {filteredTasks.length === 0 && (
        <div className="text-center py-16">
          <Clock className="w-12 h-12 text-[var(--text-muted)] mx-auto mb-4" />
          <p className="text-[var(--text-muted)]">No deadlines found</p>
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-[var(--bg-secondary)] rounded-2xl p-6 w-full max-w-md border border-[var(--border-color)] shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-[var(--text-primary)]">
                Add New Deadline
              </h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg hover:bg-[var(--bg-tertiary)]"
              >
                <X className="w-5 h-5 text-[var(--text-muted)]" />
              </button>
            </div>
            <form onSubmit={addTask} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                  Title
                </label>
                <input
                  type="text"
                  required
                  value={newTask.title}
                  onChange={(e) =>
                    setNewTask({ ...newTask, title: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[#d4af37]/30 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                  Description
                </label>
                <textarea
                  value={newTask.description}
                  onChange={(e) =>
                    setNewTask({ ...newTask, description: e.target.value })
                  }
                  rows={2}
                  className="w-full px-3 py-2 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[#d4af37]/30 text-sm resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                    Deadline
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={newTask.deadline}
                    onChange={(e) =>
                      setNewTask({ ...newTask, deadline: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[#d4af37]/30 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                    Priority
                  </label>
                  <select
                    value={newTask.priority}
                    onChange={(e) =>
                      setNewTask({
                        ...newTask,
                        priority: e.target.value as "high" | "medium" | "low",
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
                  Category
                </label>
                <input
                  type="text"
                  value={newTask.category}
                  onChange={(e) =>
                    setNewTask({ ...newTask, category: e.target.value })
                  }
                  placeholder="e.g., Kuliah, Penelitian"
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
                  Add Deadline
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
