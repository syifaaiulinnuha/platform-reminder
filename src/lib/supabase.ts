import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

export type Task = {
  id: string;
  title: string;
  description: string | null;
  deadline: string;
  priority: string;
  progress: number;
  status: string;
  category: string | null;
  created_at: string;
  updated_at: string;
};

export type NoteFolder = {
  id: string;
  name: string;
  color: string;
  created_at: string;
};

export type Note = {
  id: string;
  title: string;
  content: string;
  folder_id: string | null;
  tags: string[];
  created_at: string;
  updated_at: string;
};

export type FocusSession = {
  id: string;
  task_id: string | null;
  duration_minutes: number;
  started_at: string;
  ended_at: string | null;
  completed: boolean;
};

export type LifeGoal = {
  id: string;
  title: string;
  category: string;
  target_value: number;
  current_value: number;
  unit: string | null;
  color: string;
  created_at: string;
  updated_at: string;
};

export type AcademicItem = {
  id: string;
  title: string;
  type: string;
  course_name: string | null;
  deadline: string | null;
  status: string;
  priority: string;
  progress: number;
  created_at: string;
  updated_at: string;
};

export type CalendarEvent = {
  id: string;
  title: string;
  description: string | null;
  start_time: string;
  end_time: string | null;
  color: string;
  all_day: boolean;
  created_at: string;
};
