-- NEXORA V2 — VERIFICATION QUERIES

select count(*) as lesson_count from public.lessons;

select
  level_number,
  title,
  stage_name,
  cefr_level,
  xp_reward,
  is_published
from public.lessons
order by level_number;

select
  l.level_number,
  s.section_type,
  s.title,
  s.position
from public.lesson_sections s
join public.lessons l on l.id = s.lesson_id
where l.level_number = 1
order by s.position;

select
  l.level_number,
  count(v.id) as vocabulary_count
from public.lessons l
left join public.vocabulary_items v on v.lesson_id = l.id
where l.level_number = 1
group by l.level_number;

select
  l.level_number,
  count(q.id) as question_count
from public.lessons l
left join public.lesson_questions q on q.lesson_id = l.id
where l.level_number = 1
group by l.level_number;

notify pgrst, 'reload schema';
