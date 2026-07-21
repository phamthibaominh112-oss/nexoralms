-- NEXORA V2 — ROW LEVEL SECURITY
-- Run after 02_functions.sql.

alter table public.profiles enable row level security;
alter table public.lessons enable row level security;
alter table public.lesson_sections enable row level security;
alter table public.lesson_questions enable row level security;
alter table public.user_progress enable row level security;
alter table public.user_answers enable row level security;
alter table public.vocabulary_items enable row level security;
alter table public.user_vocabulary enable row level security;
alter table public.achievements enable row level security;
alter table public.user_achievements enable row level security;

drop policy if exists "Users can read own profile" on public.profiles;
create policy "Users can read own profile"
on public.profiles for select
using (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
on public.profiles for update
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "Published lessons are readable" on public.lessons;
create policy "Published lessons are readable"
on public.lessons for select
using (is_published = true);

drop policy if exists "Published sections are readable" on public.lesson_sections;
create policy "Published sections are readable"
on public.lesson_sections for select
using (
  is_published = true
  and exists (
    select 1 from public.lessons l
    where l.id = lesson_sections.lesson_id
      and l.is_published = true
  )
);

drop policy if exists "Published questions are readable" on public.lesson_questions;
create policy "Published questions are readable"
on public.lesson_questions for select
using (
  exists (
    select 1 from public.lessons l
    where l.id = lesson_questions.lesson_id
      and l.is_published = true
  )
);

drop policy if exists "Published vocabulary is readable" on public.vocabulary_items;
create policy "Published vocabulary is readable"
on public.vocabulary_items for select
using (
  exists (
    select 1 from public.lessons l
    where l.id = vocabulary_items.lesson_id
      and l.is_published = true
  )
);

drop policy if exists "Achievements are readable" on public.achievements;
create policy "Achievements are readable"
on public.achievements for select
using (true);

drop policy if exists "Users can read own progress" on public.user_progress;
create policy "Users can read own progress"
on public.user_progress for select
using (auth.uid() = user_id);

drop policy if exists "Users can insert own progress" on public.user_progress;
create policy "Users can insert own progress"
on public.user_progress for insert
with check (auth.uid() = user_id);

drop policy if exists "Users can update own progress" on public.user_progress;
create policy "Users can update own progress"
on public.user_progress for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can manage own answers" on public.user_answers;
create policy "Users can manage own answers"
on public.user_answers for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can manage own vocabulary" on public.user_vocabulary;
create policy "Users can manage own vocabulary"
on public.user_vocabulary for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can read own achievements" on public.user_achievements;
create policy "Users can read own achievements"
on public.user_achievements for select
using (auth.uid() = user_id);

grant execute on function public.complete_level(integer, numeric) to authenticated;

notify pgrst, 'reload schema';
