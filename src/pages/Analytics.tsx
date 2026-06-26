import { useEffect, useState } from "react";
import {
  BarChart3,
  Target,
  BookOpen,
  Code,
  GraduationCap,
  Moon,
  Plus,
  X,
  Trash2,
  Edit3,
} from "lucide-react";
import { supabase, type LifeGoal } from "../lib/supabase";
import ProgressRing from "../components/ProgressRing";
import ProgressBar from "../components/ProgressBar";

export default function Analytics() {
  const [goals, setGoals] = useState<LifeGoal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState<LifeGoal | null>(null);
  const [newGoal, setNewGoal] = useState({
    title: "",
    category: "Akademik",
    target_value: 100,
    current_value: 0,
    unit: "%",
    color: "#1e3a5f",
  });

  useEffect(() => {
    fetchGoals();
  }, []);

  async function fetchGoals() {
    const { data } = await supabase
      .from("life_goals")
      .select("*")
      .order("created_at", { ascending: true });
    if (data) setGoals(data);
    setLoading(false);
  }

  async function addGoal(e: React.FormEvent) {
    e.preventDefault();
    if (!newGoal.title) return;
    await supabase.from("life_goals").insert({
      title: newGoal.title,
      category: newGoal.category,
      target_value: newGoal.target_value,
      current_value: newGoal.current_value,
      unit: newGoal.unit,
      color: newGoal.color,
    });
    setNewGoal({
      title: "",
      category: "Akademik",
      target_value: 100,
      current_value: 0,
      unit: "%",
      color: "#1e3a5f",
    });
    setShowAddModal(false);
    fetchGoals();
  }

  async function updateGoal(e: React.FormEvent) {
    e.preventDefault();
    if (!editingGoal) return;
    await supabase
      .from("life_goals")
      .update({
        title: editingGoal.title,
        category: editingGoal.category,
        target_value: editingGoal.target_value,
        current_value: editingGoal.current_value,
        unit: editingGoal.unit,
        color: editingGoal.color,
      })
      .eq("id", editingGoal.id);
    setEditingGoal(null);
    fetchGoals();
  }

  async function deleteGoal(id: string) {
    await supabase.from("life_goals").delete().eq("id", id);
    fetchGoals();
  }

  const categoryIcons: Record<string, typeof Target> = {
    Akademik: GraduationCap,
    Spiritual: Moon,
    Personal: BookOpen,
    Karier: Code,
  };

  const overallProgress =
    goals.length > 0
      ? Math.round(
          goals.reduce(
            (a, g) => a + (g.current_value / g.target_value) * 100,
            0,
          ) / goals.length,
        )
      : 0;

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
            <BarChart3 className="w-6 h-6 text-[#d4af37]" />
            Life Progress
          </h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            Track your journey and celebrate milestones
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary flex items-center gap-2 self-start"
        >
          <Plus className="w-4 h-4" />
          Add Goal
        </button>
      </div>

      {/* Overall Progress */}
      <div className="card p-6">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <ProgressRing
            progress={overallProgress}
            size={140}
            strokeWidth={10}
            color="#d4af37"
            label="Overall"
          />
          <div className="flex-1">
            <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2">
              Overall Progress
            </h2>
            <p className="text-sm text-[var(--text-secondary)] mb-4">
              You are {overallProgress}% on track with your life goals. Keep
              pushing forward!
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {goals.slice(0, 4).map((goal) => {
                const pct = Math.round(
                  (goal.current_value / goal.target_value) * 100,
                );
                return (
                  <div key={goal.id} className="text-center">
                    <p
                      className="text-lg font-bold"
                      style={{ color: goal.color }}
                    >
                      {pct}%
                    </p>
                    <p className="text-xs text-[var(--text-muted)] truncate">
                      {goal.title}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {goals.map((goal) => {
          const pct = Math.round(
            (goal.current_value / goal.target_value) * 100,
          );
          const Icon = categoryIcons[goal.category] || Target;
          return (
            <div key={goal.id} className="card p-5 group">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${goal.color}15` }}
                  >
                    <Icon className="w-5 h-5" style={{ color: goal.color }} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[var(--text-primary)]">
                      {goal.title}
                    </h3>
                    <span className="text-xs text-[var(--text-muted)]">
                      {goal.category}
                    </span>
                  </div>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => setEditingGoal(goal)}
                    className="p-1.5 rounded-lg hover:bg-[var(--bg-tertiary)] text-[var(--text-muted)]"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => deleteGoal(goal.id)}
                    className="p-1.5 rounded-lg hover:bg-red-500/10 text-red-500"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-4 mb-4">
                <ProgressRing
                  progress={pct}
                  size={72}
                  strokeWidth={6}
                  color={goal.color}
                  value={`${goal.current_value}`}
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-[var(--text-secondary)]">
                      Progress
                    </span>
                    <span
                      className="text-sm font-bold"
                      style={{ color: goal.color }}
                    >
                      {pct}%
                    </span>
                  </div>
                  <ProgressBar
                    progress={pct}
                    color={goal.color}
                    height={6}
                    showPercentage={false}
                  />
                  <p className="text-xs text-[var(--text-muted)] mt-2">
                    {goal.current_value} / {goal.target_value} {goal.unit}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
                <span>
                  Target: {goal.target_value} {goal.unit}
                </span>
                <span>
                  Remaining:{" "}
                  {Math.max(0, goal.target_value - goal.current_value)}{" "}
                  {goal.unit}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {goals.length === 0 && (
        <div className="text-center py-16">
          <Target className="w-12 h-12 text-[var(--text-muted)] mx-auto mb-4" />
          <p className="text-[var(--text-muted)]">
            No goals yet. Start tracking your progress!
          </p>
        </div>
      )}

      {/* Add Goal Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-[var(--bg-secondary)] rounded-2xl p-6 w-full max-w-md border border-[var(--border-color)] shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-[var(--text-primary)]">
                Add Life Goal
              </h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg hover:bg-[var(--bg-tertiary)]"
              >
                <X className="w-5 h-5 text-[var(--text-muted)]" />
              </button>
            </div>
            <form onSubmit={addGoal} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                  Title
                </label>
                <input
                  type="text"
                  required
                  value={newGoal.title}
                  onChange={(e) =>
                    setNewGoal({ ...newGoal, title: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[#d4af37]/30 text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                    Category
                  </label>
                  <select
                    value={newGoal.category}
                    onChange={(e) =>
                      setNewGoal({ ...newGoal, category: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[#d4af37]/30 text-sm"
                  >
                    <option value="Akademik">Akademik</option>
                    <option value="Spiritual">Spiritual</option>
                    <option value="Personal">Personal</option>
                    <option value="Karier">Karier</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                    Unit
                  </label>
                  <input
                    type="text"
                    value={newGoal.unit}
                    onChange={(e) =>
                      setNewGoal({ ...newGoal, unit: e.target.value })
                    }
                    placeholder="e.g., %, juz, buku"
                    className="w-full px-3 py-2 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[#d4af37]/30 text-sm"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                    Target Value
                  </label>
                  <input
                    type="number"
                    required
                    value={newGoal.target_value}
                    onChange={(e) =>
                      setNewGoal({
                        ...newGoal,
                        target_value: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[#d4af37]/30 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                    Current Value
                  </label>
                  <input
                    type="number"
                    value={newGoal.current_value}
                    onChange={(e) =>
                      setNewGoal({
                        ...newGoal,
                        current_value: parseInt(e.target.value) || 0,
                      })
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
                    "#0f766e",
                    "#b45309",
                  ].map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setNewGoal({ ...newGoal, color: c })}
                      className={`w-8 h-8 rounded-lg transition-all ${newGoal.color === c ? "ring-2 ring-offset-2 ring-[var(--text-primary)]" : ""}`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
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
                  Add Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Goal Modal */}
      {editingGoal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-[var(--bg-secondary)] rounded-2xl p-6 w-full max-w-md border border-[var(--border-color)] shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-[var(--text-primary)]">
                Edit Goal
              </h2>
              <button
                onClick={() => setEditingGoal(null)}
                className="p-1 rounded-lg hover:bg-[var(--bg-tertiary)]"
              >
                <X className="w-5 h-5 text-[var(--text-muted)]" />
              </button>
            </div>
            <form onSubmit={updateGoal} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                  Title
                </label>
                <input
                  type="text"
                  required
                  value={editingGoal.title}
                  onChange={(e) =>
                    setEditingGoal({ ...editingGoal, title: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[#d4af37]/30 text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                    Target
                  </label>
                  <input
                    type="number"
                    required
                    value={editingGoal.target_value}
                    onChange={(e) =>
                      setEditingGoal({
                        ...editingGoal,
                        target_value: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[#d4af37]/30 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                    Current
                  </label>
                  <input
                    type="number"
                    value={editingGoal.current_value}
                    onChange={(e) =>
                      setEditingGoal({
                        ...editingGoal,
                        current_value: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[#d4af37]/30 text-sm"
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingGoal(null)}
                  className="flex-1 py-2.5 rounded-xl border border-[var(--border-color)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
                <button type="submit" className="flex-1 btn-primary text-sm">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
