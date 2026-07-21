-- Replace the email, then run after the user has signed up.
do $$
declare
  target_email text := 'ADMIN_EMAIL@example.com';
  target_id uuid;
begin
  select id into target_id
  from auth.users
  where lower(email)=lower(target_email)
  limit 1;

  if target_id is null then
    raise exception 'User not found: %', target_email;
  end if;

  insert into public.profiles(id,full_name,role,created_at,updated_at)
  values(
    target_id,
    coalesce(
      (select raw_user_meta_data->>'full_name' from auth.users where id=target_id),
      split_part(target_email,'@',1)
    ),
    'admin',
    now(),
    now()
  )
  on conflict(id) do update set role='admin',updated_at=now();
end $$;

select u.email,p.full_name,p.role
from auth.users u
join public.profiles p on p.id=u.id
where p.role in ('admin','founder')
order by u.email;
