-- NEXORA V2 — FUNCTIONS AND TRIGGERS
-- Run after 01_schema.sql.

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'profiles',
    'lessons',
    'lesson_sections',
    'lesson_questions',
    'user_progress',
    'user_vocabulary'
  ]
  loop
    execute format('drop trigger if exists %I_set_updated_at on public.%I', table_name, table_name);
    execute format(
      'create trigger %I_set_updated_at before update on public.%I
       for each row execute function public.set_updated_at()',
      table_name,
      table_name
    );
  end loop;
end $$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1))
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create or replace function public.complete_level(
  p_level_number integer,
  p_score numeric default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_reward integer;
  v_was_completed boolean;
  v_next_level integer;
begin
  if v_user_id is null then
    raise exception 'Not authenticated';
  end if;

  select xp_reward
  into v_reward
  from public.lessons
  where level_number = p_level_number
    and is_published = true;

  if v_reward is null then
    raise exception 'Lesson not found or unpublished';
  end if;

  select completed
  into v_was_completed
  from public.user_progress
  where user_id = v_user_id
    and level_id = p_level_number;

  v_was_completed := coalesce(v_was_completed, false);

  insert into public.user_progress (
    user_id,
    level_id,
    completed,
    earned_xp,
    score,
    started_at,
    completed_at,
    updated_at
  )
  values (
    v_user_id,
    p_level_number,
    true,
    case when v_was_completed then 0 else v_reward end,
    p_score,
    now(),
    now(),
    now()
  )
  on conflict (user_id, level_id)
  do update set
    completed = true,
    score = excluded.score,
    completed_at = coalesce(public.user_progress.completed_at, excluded.completed_at),
    updated_at = now();

  v_next_level := least(p_level_number + 1, 100);

  update public.profiles
  set
    current_lesson = greatest(current_lesson, v_next_level),
    total_xp = total_xp + case when v_was_completed then 0 else v_reward end,
    updated_at = now()
  where id = v_user_id;

  return jsonb_build_object(
    'success', true,
    'level', p_level_number,
    'xp_awarded', case when v_was_completed then 0 else v_reward end,
    'next_level', v_next_level,
    'already_completed', v_was_completed
  );
end;
$$;
