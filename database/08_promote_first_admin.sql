-- Replace the email below with the account that should manage Nexora.
-- The user must already have signed up through Supabase Auth.

update public.profiles
set role='admin', updated_at=now()
where id=(
  select id
  from auth.users
  where lower(email)=lower('engteractive@gmail.com')
  limit 1
);

select
  u.email,
  p.full_name,
  p.role
from auth.users u
join public.profiles p on p.id=u.id
where lower(u.email)=lower('engteractive@gmail.com');
