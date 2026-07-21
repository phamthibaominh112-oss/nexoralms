create or replace function public.import_lesson_json(payload jsonb)
returns bigint language plpgsql security definer set search_path=public as $$
declare
 course_pk bigint; lesson_pk bigint; b jsonb; pos int:=0;
begin
 insert into public.courses(slug,title,title_vi,description,description_vi)
 values(
  payload->'course'->>'slug',
  payload->'course'->>'title',
  payload->'course'->>'title_vi',
  payload->'course'->>'description',
  payload->'course'->>'description_vi'
 )
 on conflict(slug) do update set title=excluded.title,title_vi=excluded.title_vi
 returning id into course_pk;

 insert into public.lessons(
  course_id,level_number,slug,title,title_vi,subtitle,subtitle_vi,stage_number,stage_name,
  cefr_level,xp_reward,coin_reward,estimated_minutes,is_checkpoint,is_published
 ) values(
  course_pk,(payload->'lesson'->>'level_number')::int,payload->'lesson'->>'slug',
  payload->'lesson'->>'title',payload->'lesson'->>'title_vi',
  payload->'lesson'->>'subtitle',payload->'lesson'->>'subtitle_vi',
  (payload->'lesson'->>'stage_number')::int,payload->'lesson'->>'stage_name',
  payload->'lesson'->>'cefr_level',
  coalesce((payload->'lesson'->>'xp_reward')::int,100),
  coalesce((payload->'lesson'->>'coin_reward')::int,20),
  coalesce((payload->'lesson'->>'estimated_minutes')::int,40),
  coalesce((payload->'lesson'->>'is_checkpoint')::boolean,false),true
 )
 on conflict(level_number) do update set
  title=excluded.title,title_vi=excluded.title_vi,subtitle=excluded.subtitle,subtitle_vi=excluded.subtitle_vi,
  stage_number=excluded.stage_number,stage_name=excluded.stage_name,cefr_level=excluded.cefr_level,
  xp_reward=excluded.xp_reward,coin_reward=excluded.coin_reward,estimated_minutes=excluded.estimated_minutes
 returning id into lesson_pk;

 delete from public.lesson_blocks where lesson_id=lesson_pk;
 for b in select * from jsonb_array_elements(payload->'blocks')
 loop
  pos:=pos+1;
  insert into public.lesson_blocks(lesson_id,block_type,title,title_vi,instructions,instructions_vi,content,position,is_required,is_published)
  values(
   lesson_pk,b->>'type',b->>'title',b->>'title_vi',b->>'instructions',b->>'instructions_vi',
   coalesce(b->'content','{}'::jsonb),pos,coalesce((b->>'required')::boolean,true),true
  );
 end loop;
 return lesson_pk;
end $$;

create or replace function public.import_ielts_paper_json(payload jsonb)
returns bigint language plpgsql security definer set search_path=public as $$
declare paper_pk bigint; section_pk bigint; s jsonb; q jsonb; sn int; qn int;
begin
 insert into public.ielts_papers(slug,title,module,test_type,duration_minutes,instructions,metadata,is_published)
 values(payload->>'slug',payload->>'title',payload->>'module',coalesce(payload->>'test_type','academic'),
 (payload->>'duration_minutes')::int,payload->>'instructions',coalesce(payload->'metadata','{}'::jsonb),true)
 on conflict(slug) do update set title=excluded.title,module=excluded.module,duration_minutes=excluded.duration_minutes,instructions=excluded.instructions,metadata=excluded.metadata
 returning id into paper_pk;

 delete from public.ielts_sections where paper_id=paper_pk;
 sn:=0;
 for s in select * from jsonb_array_elements(payload->'sections')
 loop
  sn:=sn+1;
  insert into public.ielts_sections(paper_id,section_number,title,passage,audio_url,transcript,instructions,metadata)
  values(paper_pk,sn,s->>'title',s->>'passage',s->>'audio_url',s->>'transcript',s->>'instructions',coalesce(s->'metadata','{}'::jsonb))
  returning id into section_pk;
  qn:=0;
  for q in select * from jsonb_array_elements(coalesce(s->'questions','[]'::jsonb))
  loop
   qn:=qn+1;
   insert into public.ielts_items(section_id,item_number,question_type,prompt,options,correct_answer,explanation,metadata)
   values(section_pk,qn,q->>'type',q->>'prompt',coalesce(q->'options','[]'::jsonb),q->'answer',q->>'explanation',coalesce(q->'metadata','{}'::jsonb));
  end loop;
 end loop;
 return paper_pk;
end $$;

revoke execute on function public.import_lesson_json(jsonb) from public,anon,authenticated;
revoke execute on function public.import_ielts_paper_json(jsonb) from public,anon,authenticated;
notify pgrst,'reload schema';
