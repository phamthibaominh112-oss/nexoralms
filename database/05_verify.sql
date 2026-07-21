select count(*) as lessons from public.lessons;
select routine_name from information_schema.routines where routine_schema='public' and routine_name in('complete_lesson','import_lesson_json','import_ielts_paper_json');
notify pgrst,'reload schema';
