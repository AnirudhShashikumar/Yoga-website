-- Milestone 6: retain truthful class/session details for a customer's own
-- booking history without widening public catalogue access.

create function private.customer_has_booking_for_session(target_session_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(
    exists (
      select 1
      from public.bookings
      where bookings.session_id = target_session_id
        and bookings.customer_id = (select auth.uid())
    ),
    false
  );
$$;

create function private.customer_has_booking_for_class(target_class_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(
    exists (
      select 1
      from public.bookings
      join public.class_sessions
        on class_sessions.id = bookings.session_id
      where class_sessions.class_id = target_class_id
        and bookings.customer_id = (select auth.uid())
    ),
    false
  );
$$;

revoke all on function private.customer_has_booking_for_session(uuid) from public;
revoke all on function private.customer_has_booking_for_class(uuid) from public;
grant execute on function private.customer_has_booking_for_session(uuid) to authenticated;
grant execute on function private.customer_has_booking_for_class(uuid) to authenticated;

create policy class_sessions_customer_read_booked_history
on public.class_sessions
for select
to authenticated
using ((select private.customer_has_booking_for_session(id)));

create policy classes_customer_read_booked_history
on public.classes
for select
to authenticated
using ((select private.customer_has_booking_for_class(id)));
