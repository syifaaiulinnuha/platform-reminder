/*
# LifeClock Seed Data

Menambahkan data awal untuk demo aplikasi LifeClock:
- Sample tasks dengan deadline
- Sample note folders dan notes
- Sample life goals
- Sample academic items
- Sample events
*/

INSERT INTO note_folders (name, color) VALUES
  ('Kuliah', '#1e40af'),
  ('Penelitian', '#0f766e'),
  ('Ide Bisnis', '#b45309'),
  ('Filosofi', '#7c3aed'),
  ('Dakwah', '#047857'),
  ('Personal', '#475569')
ON CONFLICT DO NOTHING;

INSERT INTO tasks (title, description, deadline, priority, progress, status, category) VALUES
  ('Proposal Penelitian', 'Menyusun proposal penelitian untuk seminar hasil', '2026-06-28T23:59:00+07:00', 'high', 65, 'active', 'Penelitian'),
  ('Presentasi Jurnal', 'Presentasi review jurnal internasional', '2026-06-27T08:00:00+07:00', 'high', 90, 'active', 'Kuliah'),
  ('Laporan Praktikum', 'Laporan praktikum algoritma dan struktur data', '2026-06-30T17:00:00+07:00', 'medium', 40, 'active', 'Kuliah'),
  ('Draft Artikel', 'Draft artikel untuk publikasi jurnal Sinta 2', '2026-07-05T23:59:00+07:00', 'high', 20, 'active', 'Penelitian'),
  ('Desain UI Startup', 'Desain UI untuk aplikasi startup lomba', '2026-07-02T12:00:00+07:00', 'medium', 50, 'active', 'Ide Bisnis'),
  ('Kajian Tafsir', 'Menyiapkan materi kajian tafsir Surah Al-Kahfi', '2026-07-01T19:00:00+07:00', 'low', 30, 'active', 'Dakwah')
ON CONFLICT DO NOTHING;

INSERT INTO life_goals (title, category, target_value, current_value, unit, color) VALUES
  ('Skripsi', 'Akademik', 100, 65, '%', '#1e40af'),
  ('Hafalan Al-Quran', 'Spiritual', 30, 12, 'juz', '#047857'),
  ('Buku Dibaca', 'Personal', 50, 23, 'buku', '#b45309'),
  ('Skill Programming', 'Karier', 100, 72, '%', '#0f766e'),
  ('Target IPK', 'Akademik', 4, 3, 'IPK', '#7c3aed')
ON CONFLICT DO NOTHING;

INSERT INTO academic_items (title, type, course_name, deadline, status, priority, progress) VALUES
  ('Tugas Algoritma', 'tugas', 'Algoritma dan Struktur Data', '2026-06-30T17:00:00+07:00', 'active', 'high', 40),
  ('Presentasi Jurnal', 'presentasi', 'Metodologi Penelitian', '2026-06-27T08:00:00+07:00', 'active', 'high', 90),
  ('Quiz Statistik', 'ujian', 'Statistika Terapan', '2026-06-29T10:00:00+07:00', 'active', 'medium', 0),
  ('Proposal Penelitian', 'penelitian', 'Skripsi', '2026-06-28T23:59:00+07:00', 'active', 'high', 65),
  ('Target Membaca 5 Jurnal', 'target', 'Penelitian', NULL, 'active', 'medium', 40)
ON CONFLICT DO NOTHING;

INSERT INTO events (title, description, start_time, end_time, color, all_day) VALUES
  ('Presentasi Jurnal', 'Presentasi review jurnal di kelas', '2026-06-27T08:00:00+07:00', '2026-06-27T10:00:00+07:00', '#dc2626', false),
  ('Kajian Malam', 'Kajian tafsir Surah Al-Kahfi', '2026-06-27T19:00:00+07:00', '2026-06-27T21:00:00+07:00', '#047857', false),
  ('Deadline Proposal', 'Deadline pengumpulan proposal penelitian', '2026-06-28T23:59:00+07:00', '2026-06-28T23:59:00+07:00', '#dc2626', false),
  ('Quiz Statistik', 'Quiz online statistika terapan', '2026-06-29T10:00:00+07:00', '2026-06-29T11:30:00+07:00', '#f59e0b', false),
  ('Lomba Startup', 'Presentasi final lomba startup', '2026-07-03T09:00:00+07:00', '2026-07-03T12:00:00+07:00', '#7c3aed', false)
ON CONFLICT DO NOTHING;

INSERT INTO notes (title, content, folder_id, tags) VALUES
  ('Ide Startup LifeClock', '# LifeClock\n\nAplikasi produktivitas untuk mahasiswa.\n\n## Fitur\n- Deadline tracker\n- Pomodoro timer\n- Catatan\n\n## Target Market\nMahasiswa aktif', (SELECT id FROM note_folders WHERE name = 'Ide Bisnis'), ARRAY['startup', 'productivity']),
  ('Review Jurnal AI', '# Review Jurnal: Deep Learning untuk NLP\n\n## Ringkasan\nPaper ini membahas...\n\n## Metode\n- Transformer\n- Attention mechanism\n\n## Insight\nSangat relevan untuk penelitian skripsi.', (SELECT id FROM note_folders WHERE name = 'Penelitian'), ARRAY['ai', 'review']),
  ('Filosofi Stoik', '# Prinsip Stoikisme\n\n> "Kita tidak bisa mengontrol apa yang terjadi, tapi bisa mengontrol respons kita."\n\n## Praktik Harian\n1. Morning reflection\n2. Negative visualization\n3. Evening journaling', (SELECT id FROM note_folders WHERE name = 'Filosofi'), ARRAY['stoicism', 'self-improvement'])
ON CONFLICT DO NOTHING;
