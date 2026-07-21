-- DANGER: development only. This deletes Nexora application data.
-- It does not delete auth.users.
drop table if exists public.ielts_attempts cascade;
drop table if exists public.ielts_items cascade;
drop table if exists public.ielts_sections cascade;
drop table if exists public.ielts_papers cascade;
drop table if exists public.ielts_test_suites cascade;
drop table if exists public.placement_attempts cascade;
drop table if exists public.placement_blueprints cascade;
drop table if exists public.questions cascade;
drop table if exists public.question_banks cascade;
drop table if exists public.game_sessions cascade;
drop table if exists public.user_progress cascade;
drop table if exists public.lesson_blocks cascade;
drop table if exists public.lessons cascade;
drop table if exists public.courses cascade;
-- Keep profiles because it references auth users and stores roles.
