-- NEXORA V2 — SEED 100 LESSON RECORDS
-- Run after 03_rls.sql.

insert into public.lessons (
  level_number,
  slug,
  title,
  subtitle,
  stage_number,
  stage_name,
  cefr_level,
  estimated_minutes,
  xp_reward,
  is_checkpoint,
  is_published
)
select
  n,
  'level-' || n,
  case
    when n % 10 = 0 then 'Stage ' || ceil(n / 10.0)::int || ' Checkpoint'
    else case ((n - 1) % 10) + 1
      when 1 then 'Introducing Yourself'
      when 2 then 'Personal Information'
      when 3 then 'Family and Relationships'
      when 4 then 'Daily Routines'
      when 5 then 'Food and Lifestyle'
      when 6 then 'Home and Community'
      when 7 then 'Study and Work'
      when 8 then 'Travel and Experiences'
      when 9 then 'Communication Skills'
    end
  end,
  case
    when n % 10 = 0 then 'Review the stage and complete the assessment.'
    else 'Build practical English through guided activities.'
  end,
  ceil(n / 10.0)::int,
  case
    when n <= 10 then 'Starter Foundations'
    when n <= 20 then 'Essential English'
    when n <= 30 then 'Everyday Communication'
    when n <= 40 then 'Independent English'
    when n <= 50 then 'IELTS Core Skills'
    when n <= 60 then 'Academic Development'
    when n <= 70 then 'Confident IELTS User'
    when n <= 80 then 'Advanced IELTS Skills'
    when n <= 90 then 'Band 7.5 Performance'
    else 'Road to IELTS 8.0'
  end,
  case
    when n <= 10 then 'Pre-A1'
    when n <= 20 then 'A1'
    when n <= 30 then 'A2'
    when n <= 40 then 'B1'
    when n <= 50 then 'B1+'
    when n <= 60 then 'B2'
    when n <= 70 then 'B2+'
    when n <= 80 then 'C1'
    when n <= 90 then 'C1+'
    else 'IELTS 8.0'
  end,
  case when n % 10 = 0 then 40 else 25 end,
  case when n % 10 = 0 then 150 else 80 + (((n - 1) % 5) * 10) end,
  n % 10 = 0,
  true
from generate_series(1, 100) as n
on conflict (level_number)
do update set
  slug = excluded.slug,
  title = excluded.title,
  subtitle = excluded.subtitle,
  stage_number = excluded.stage_number,
  stage_name = excluded.stage_name,
  cefr_level = excluded.cefr_level,
  estimated_minutes = excluded.estimated_minutes,
  xp_reward = excluded.xp_reward,
  is_checkpoint = excluded.is_checkpoint,
  is_published = excluded.is_published,
  updated_at = now();
