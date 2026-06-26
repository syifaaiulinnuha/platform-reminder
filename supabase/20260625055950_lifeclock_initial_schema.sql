/*
# LifeClock Initial Schema

Aplikasi produktivitas pribadi untuk mahasiswa yang menggabungkan:
- Deadline tracking dengan countdown
- Catatan (Second Brain) dengan folder dan tag
- Focus sessions / Pomodoro timer
- Life progress tracker (skripsi, hafalan, buku, skill)
- Academic command center (tugas, jadwal, target)

1. New Tables
- `tasks` — tugas/deadline dengan prioritas, progress, dan deadline
- `notes` — catatan pribadi dengan markdown support
- `note_folders` — folder untuk mengelompokkan catatan
- `focus_sessions` — sesi fokus/pomodoro
- `life_goals` — target hidup dan akademik dengan progress
- `academic_items` — item akademik (tugas, presentasi, jadwal, target)
- `events` — acara/kalender

2. Security
- Enable RLS on all tables.
- Single-tenant (no auth required): allow anon + authenticated CRUD.
*/

CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  deadline timestamptz NOT NULL,
  priority text NOT NULL DEFAULT 'medium',
  progress integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'active',
  category text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS note_folders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  color text DEFAULT '#1e293b',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL DEFAULT '',
  folder_id uuid REFERENCES note_folders(id) ON DELETE SET NULL,
  tags text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS focus_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id uuid REFERENCES tasks(id) ON DELETE SET NULL,
  duration_minutes integer NOT NULL DEFAULT 25,
  started_at timestamptz DEFAULT now(),
  ended_at timestamptz,
  completed boolean NOT NULL DEFAULT false
);

CREATE TABLE IF NOT EXISTS life_goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  category text NOT NULL,
  target_value integer NOT NULL,
  current_value integer NOT NULL DEFAULT 0,
  unit text,
  color text DEFAULT '#1e293b',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS academic_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  type text NOT NULL,
  course_name text,
  deadline timestamptz,
  status text NOT NULL DEFAULT 'active',
  priority text NOT NULL DEFAULT 'medium',
  progress integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  start_time timestamptz NOT NULL,
  end_time timestamptz,
  color text DEFAULT '#1e293b',
  all_day boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE note_folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE focus_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE life_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE academic_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Tasks policies
DROP POLICY IF EXISTS "anon_select_tasks" ON tasks;
CREATE POLICY "anon_select_tasks" ON tasks FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_tasks" ON tasks;
CREATE POLICY "anon_insert_tasks" ON tasks FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_tasks" ON tasks;
CREATE POLICY "anon_update_tasks" ON tasks FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_tasks" ON tasks;
CREATE POLICY "anon_delete_tasks" ON tasks FOR DELETE TO anon, authenticated USING (true);

-- Note folders policies
DROP POLICY IF EXISTS "anon_select_note_folders" ON note_folders;
CREATE POLICY "anon_select_note_folders" ON note_folders FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_note_folders" ON note_folders;
CREATE POLICY "anon_insert_note_folders" ON note_folders FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_note_folders" ON note_folders;
CREATE POLICY "anon_update_note_folders" ON note_folders FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_note_folders" ON note_folders;
CREATE POLICY "anon_delete_note_folders" ON note_folders FOR DELETE TO anon, authenticated USING (true);

-- Notes policies
DROP POLICY IF EXISTS "anon_select_notes" ON notes;
CREATE POLICY "anon_select_notes" ON notes FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_notes" ON notes;
CREATE POLICY "anon_insert_notes" ON notes FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_notes" ON notes;
CREATE POLICY "anon_update_notes" ON notes FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_notes" ON notes;
CREATE POLICY "anon_delete_notes" ON notes FOR DELETE TO anon, authenticated USING (true);

-- Focus sessions policies
DROP POLICY IF EXISTS "anon_select_focus_sessions" ON focus_sessions;
CREATE POLICY "anon_select_focus_sessions" ON focus_sessions FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_focus_sessions" ON focus_sessions;
CREATE POLICY "anon_insert_focus_sessions" ON focus_sessions FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_focus_sessions" ON focus_sessions;
CREATE POLICY "anon_update_focus_sessions" ON focus_sessions FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_focus_sessions" ON focus_sessions;
CREATE POLICY "anon_delete_focus_sessions" ON focus_sessions FOR DELETE TO anon, authenticated USING (true);

-- Life goals policies
DROP POLICY IF EXISTS "anon_select_life_goals" ON life_goals;
CREATE POLICY "anon_select_life_goals" ON life_goals FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_life_goals" ON life_goals;
CREATE POLICY "anon_insert_life_goals" ON life_goals FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_life_goals" ON life_goals;
CREATE POLICY "anon_update_life_goals" ON life_goals FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_life_goals" ON life_goals;
CREATE POLICY "anon_delete_life_goals" ON life_goals FOR DELETE TO anon, authenticated USING (true);

-- Academic items policies
DROP POLICY IF EXISTS "anon_select_academic_items" ON academic_items;
CREATE POLICY "anon_select_academic_items" ON academic_items FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_academic_items" ON academic_items;
CREATE POLICY "anon_insert_academic_items" ON academic_items FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_academic_items" ON academic_items;
CREATE POLICY "anon_update_academic_items" ON academic_items FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_academic_items" ON academic_items;
CREATE POLICY "anon_delete_academic_items" ON academic_items FOR DELETE TO anon, authenticated USING (true);

-- Events policies
DROP POLICY IF EXISTS "anon_select_events" ON events;
CREATE POLICY "anon_select_events" ON events FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_events" ON events;
CREATE POLICY "anon_insert_events" ON events FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_events" ON events;
CREATE POLICY "anon_update_events" ON events FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_events" ON events;
CREATE POLICY "anon_delete_events" ON events FOR DELETE TO anon, authenticated USING (true);
