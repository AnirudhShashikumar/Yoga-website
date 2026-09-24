-- Milestone 6: customer booking capacity enforcement and conservative cancellation.

create function private.validate_customer_booking()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  session_record record;
  active_booking_count integer;
begin
  -- Trusted administrative operations retain the existing management behavior.
  -- Customer identity still comes from auth.uid() and the insert-protection trigger.
  if (select auth.uid()) is null or private.is_admin() then
    return new;
  end if;

  select
    class_sessions.starts_at,
    class_sessions.status,
    class_sessions.archived_at,
    class_sessions.capacity,
    classes.published as class_published,
    classes.archived_at as class_archived_at
  into session_record
  from public.class_sessions
  join public.classes on classes.id = class_sessions.class_id
  where class_sessions.id = new.session_id
  for update of class_sessions;

  if not found
    or session_record.status <> 'published'
    or session_record.archived_at is not null
    or session_record.starts_at <= now()
    or not session_record.class_published
    or session_record.class_archived_at is not null
  then
    raise exception 'Session is not available for customer booking'
      using errcode = '23514';
  end if;

  if session_record.capacity is not null then
    select count(*)
    into active_booking_count
    from public.bookings
    where session_id = new.session_id
      and status in ('pending', 'confirmed');

    if active_booking_count >= session_record.capacity then
      raise exception 'Session capacity has been reached'
        using errcode = 'P0001';
    end if;
  end if;

  return new;
end;
$$;

create trigger bookings_validate_customer_insert
before insert on public.bookings
for each row execute function private.validate_customer_booking();

revoke all on function private.validate_customer_booking() from public;

create policy bookings_customer_cancel_own_future
on public.bookings
for update
to authenticated
using (
  customer_id = (select auth.uid())
  and status in ('pending', 'confirmed')
  and exists (
    select 1
    from public.class_sessions
    where class_sessions.id = bookings.session_id
      and class_sessions.status = 'published'
      and class_sessions.archived_at is null
      and class_sessions.starts_at > now()
  )
)
with check (
  customer_id = (select auth.uid())
  and status = 'cancelled'
);
