insert into public.courses(slug,title,title_vi,description,description_vi)
values('road-to-ielts-8','Road to IELTS 8.0','Lộ trình IELTS 8.0','100-level gamified English programme','Chương trình tiếng Anh game hóa 100 level')
on conflict(slug) do nothing;

insert into public.lessons(course_id,level_number,slug,title,title_vi,subtitle,subtitle_vi,stage_number,stage_name,cefr_level,xp_reward,coin_reward,estimated_minutes,is_checkpoint,is_published)
select
 (select id from public.courses where slug='road-to-ielts-8'),n,'level-'||n,
 case when n%10=0 then 'Stage '||ceil(n/10.0)::int||' Boss Battle' else 'Mission '||n end,
 case when n%10=0 then 'Trận Boss Chặng '||ceil(n/10.0)::int else 'Nhiệm vụ '||n end,
 'Interactive mission with learning, practice, game and review.',
 'Nhiệm vụ tương tác gồm học, luyện tập, trò chơi và ôn tập.',
 ceil(n/10.0)::int,
 case when n<=10 then 'Starter Foundations' when n<=20 then 'Essential English' when n<=30 then 'Everyday Communication' when n<=40 then 'Independent English' when n<=50 then 'IELTS Core' when n<=60 then 'Academic Development' when n<=70 then 'Confident IELTS' when n<=80 then 'Advanced IELTS' when n<=90 then 'Band 7.5' else 'Road to Band 8' end,
 case when n<=10 then 'Pre-A1' when n<=20 then 'A1' when n<=30 then 'A2' when n<=40 then 'B1' when n<=50 then 'B1+' when n<=60 then 'B2' when n<=70 then 'B2+' when n<=80 then 'C1' when n<=90 then 'C1+' else 'IELTS 8.0' end,
 case when n%10=0 then 200 else 100 end,
 case when n%10=0 then 50 else 20 end,
 case when n%10=0 then 60 else 40 end,
 n%10=0,true
from generate_series(1,100)n
on conflict(level_number) do nothing;
