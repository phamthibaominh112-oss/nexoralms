-- NEXORA V2 — ACHIEVEMENTS

insert into public.achievements (
  code, name, description, icon, xp_reward, condition_type, condition_value
) values
('first_lesson','First Lesson','Complete your first Nexora level.','01',25,'completed_levels',1),
('xp_100','100 XP','Earn your first 100 XP.','XP',25,'total_xp',100),
('stage_1','Stage 1','Complete the first 10 levels.','S1',100,'completed_levels',10),
('streak_7','7-day streak','Study for seven consecutive days.','7D',100,'streak_days',7)
on conflict (code)
do update set
  name = excluded.name,
  description = excluded.description,
  icon = excluded.icon,
  xp_reward = excluded.xp_reward,
  condition_type = excluded.condition_type,
  condition_value = excluded.condition_value;
