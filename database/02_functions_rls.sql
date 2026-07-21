create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path=public as $$
begin
 insert into public.profiles(id,full_name) values(new.id,coalesce(new.raw_user_meta_data->>'full_name',split_part(new.email,'@',1))) on conflict(id) do nothing;
 return new;
end $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

create or replace function public.complete_lesson(p_level_number int,p_score numeric default 100)
returns jsonb language plpgsql security definer set search_path=public as $$
declare uid uuid:=auth.uid(); reward int; coin int; was_done boolean;
begin
 if uid is null then raise exception 'Not authenticated'; end if;
 select xp_reward,coin_reward into reward,coin from public.lessons where level_number=p_level_number and is_published=true;
 if reward is null then raise exception 'Lesson not found'; end if;
 select completed into was_done from public.user_progress where user_id=uid and level_id=p_level_number;
 was_done:=coalesce(was_done,false);
 insert into public.user_progress(user_id,level_id,completed,score,earned_xp,earned_coins,completed_at,updated_at)
 values(uid,p_level_number,true,p_score,case when was_done then 0 else reward end,case when was_done then 0 else coin end,now(),now())
 on conflict(user_id,level_id) do update set completed=true,score=excluded.score,updated_at=now();
 update public.profiles set current_lesson=greatest(current_lesson,least(p_level_number+1,100)),
 total_xp=total_xp+case when was_done then 0 else reward end,
 coins=coins+case when was_done then 0 else coin end,updated_at=now() where id=uid;
 return jsonb_build_object('success',true,'xp_awarded',case when was_done then 0 else reward end,'coins_awarded',case when was_done then 0 else coin end);
end $$;

alter table public.profiles enable row level security;
alter table public.lessons enable row level security;
alter table public.lesson_blocks enable row level security;
alter table public.question_banks enable row level security;
alter table public.questions enable row level security;
alter table public.placement_attempts enable row level security;
alter table public.user_progress enable row level security;
alter table public.game_sessions enable row level security;
alter table public.ielts_papers enable row level security;
alter table public.ielts_sections enable row level security;
alter table public.ielts_items enable row level security;
alter table public.ielts_attempts enable row level security;

create policy "own profile" on public.profiles for all using(auth.uid()=id) with check(auth.uid()=id);
create policy "published lessons" on public.lessons for select using(is_published=true);
create policy "published blocks" on public.lesson_blocks for select using(is_published=true);
create policy "read banks" on public.question_banks for select using(true);
create policy "read questions" on public.questions for select using(true);
create policy "own placement" on public.placement_attempts for all using(auth.uid()=user_id) with check(auth.uid()=user_id);
create policy "own progress" on public.user_progress for all using(auth.uid()=user_id) with check(auth.uid()=user_id);
create policy "own games" on public.game_sessions for all using(auth.uid()=user_id) with check(auth.uid()=user_id);
create policy "published papers" on public.ielts_papers for select using(is_published=true);
create policy "read sections" on public.ielts_sections for select using(true);
create policy "read items" on public.ielts_items for select using(true);
create policy "own attempts" on public.ielts_attempts for all using(auth.uid()=user_id) with check(auth.uid()=user_id);

grant execute on function public.complete_lesson(int,numeric) to authenticated;
notify pgrst,'reload schema';
