-- Optional bilingual metadata fields for CMS editing.
alter table public.lessons add column if not exists title_vi text;
alter table public.lessons add column if not exists subtitle_vi text;
alter table public.lesson_sections add column if not exists title_vi text;
alter table public.lesson_sections add column if not exists instructions_vi text;
notify pgrst, 'reload schema';
