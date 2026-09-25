-- Milestone 7: least-privilege admin directory access and mutation safety.

create function public.admin_customer_directory()
returns table (
  user_id uuid,
  email text,
  email_confirmed_at timestamptz,
  last_sign_in_at timestamptz,
  created_at timestamptz
)
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  if not private.is_admin() then
    raise exception 'Administrator access is required'
      using errcode = '42501';
  end if;

  return query
  select
    users.id,
    users.email::text,
    users.email_confirmed_at,
    users.last_sign_in_at,
    users.created_at
  from auth.users as users
  join public.user_roles as roles on roles.user_id = users.id
  where roles.role = 'customer'
  order by users.created_at desc;
end;
$$;

revoke all on function public.admin_customer_directory() from public;
grant execute on function public.admin_customer_directory() to authenticated;

create function private.protect_class_catalogue_history()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if old.slug is distinct from new.slug then
    raise exception 'Class slugs are immutable after creation'
      using errcode = '23514';
  end if;

  if (
    (old.published and not new.published)
    or (old.archived_at is null and new.archived_at is not null)
  ) and exists (
    select 1
    from public.class_sessions
    where class_sessions.class_id = old.id
      and class_sessions.status = 'published'
      and class_sessions.archived_at is null
      and class_sessions.starts_at > now()
  ) then
    raise exception 'Cancel or complete future published sessions before hiding this class'
      using errcode = '23514';
  end if;

  return new;
end;
$$;

create trigger classes_protect_catalogue_history
before update on public.classes
for each row execute function private.protect_class_catalogue_history();

create function private.protect_booked_session_history()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  booking_count integer;
  active_booking_count integer;
begin
  select
    count(*),
    count(*) filter (where status in ('pending', 'confirmed'))
  into booking_count, active_booking_count
  from public.bookings
  where session_id = old.id;

  if booking_count > 0 and (
    old.class_id is distinct from new.class_id
    or old.starts_at is distinct from new.starts_at
    or old.ends_at is distinct from new.ends_at
    or old.format is distinct from new.format
  ) then
    raise exception 'Booked session identity, timing, and format are immutable'
      using errcode = '23514';
  end if;

  if new.capacity is not null and new.capacity < active_booking_count then
    raise exception 'Session capacity cannot be below active bookings'
      using errcode = '23514';
  end if;

  if active_booking_count > 0
    and old.archived_at is null
    and new.archived_at is not null
  then
    raise exception 'Cancel active bookings before archiving this session'
      using errcode = '23514';
  end if;

  return new;
end;
$$;

create trigger class_sessions_protect_booked_history
before update on public.class_sessions
for each row execute function private.protect_booked_session_history();

revoke all on function private.protect_class_catalogue_history() from public;
revoke all on function private.protect_booked_session_history() from public;
