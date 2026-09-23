-- Milestone 4: explicit grants, protected mutations, lifecycle enforcement, and RLS.

create function private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(
    exists (
      select 1
      from public.user_roles
      where user_id = (select auth.uid())
        and role = 'admin'
    ),
    false
  );
$$;

revoke all on function private.is_admin() from public;
grant usage on schema private to anon, authenticated;
grant execute on function private.is_admin() to anon, authenticated;

create function private.protect_booking_insert()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if current_user not in ('postgres', 'service_role', 'supabase_admin')
    and not private.is_admin()
  then
    if (select auth.uid()) is null then
      raise exception 'Authentication is required to create a booking'
        using errcode = '42501';
    end if;

    new.id := gen_random_uuid();
    new.customer_id := (select auth.uid());
    new.status := 'pending';
    new.created_at := now();
    new.updated_at := now();
  end if;

  return new;
end;
$$;

create trigger bookings_protect_insert
before insert on public.bookings
for each row execute function private.protect_booking_insert();

create function private.protect_trial_enquiry_insert()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if current_user not in ('postgres', 'service_role', 'supabase_admin')
    and not private.is_admin()
  then
    new.id := gen_random_uuid();
    new.user_id := (select auth.uid());
    new.status := 'new';
    new.consented_at := case when new.consent_given then now() else null end;
    new.consent_source := case when new.consent_given then 'data-api' else null end;
    new.created_at := now();
    new.updated_at := now();
  end if;

  return new;
end;
$$;

create trigger trial_enquiries_protect_insert
before insert on public.trial_enquiries
for each row execute function private.protect_trial_enquiry_insert();

create function private.enforce_booking_status_transition()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if old.status = new.status then
    return new;
  end if;

  if not (
    (old.status = 'pending' and new.status in ('confirmed', 'cancelled'))
    or (old.status = 'confirmed' and new.status in ('completed', 'cancelled'))
  ) then
    raise exception 'Invalid booking status transition: % -> %', old.status, new.status
      using errcode = '23514';
  end if;

  return new;
end;
$$;

create trigger bookings_enforce_status_transition
before update of status on public.bookings
for each row execute function private.enforce_booking_status_transition();

create function private.enforce_session_status_transition()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if old.status = new.status then
    return new;
  end if;

  if not (
    (old.status = 'draft' and new.status in ('published', 'cancelled'))
    or (old.status = 'published' and new.status in ('completed', 'cancelled'))
  ) then
    raise exception 'Invalid session status transition: % -> %', old.status, new.status
      using errcode = '23514';
  end if;

  return new;
end;
$$;

create trigger class_sessions_enforce_status_transition
before update of status on public.class_sessions
for each row execute function private.enforce_session_status_transition();

create function private.enforce_enquiry_status_transition()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if old.status = new.status then
    return new;
  end if;

  if not (
    (old.status = 'new' and new.status in ('contacted', 'closed'))
    or (old.status = 'contacted' and new.status in ('converted', 'closed'))
  ) then
    raise exception 'Invalid enquiry status transition: % -> %', old.status, new.status
      using errcode = '23514';
  end if;

  return new;
end;
$$;

create trigger trial_enquiries_enforce_status_transition
before update of status on public.trial_enquiries
for each row execute function private.enforce_enquiry_status_transition();

revoke all on all functions in schema private from public;
grant execute on function private.is_admin() to anon, authenticated;

alter table public.profiles enable row level security;
alter table public.user_roles enable row level security;
alter table public.classes enable row level security;
alter table public.class_sessions enable row level security;
alter table public.bookings enable row level security;
alter table public.trial_enquiries enable row level security;
alter table public.workshops enable row level security;
alter table public.gallery_items enable row level security;

revoke all on table public.profiles from anon, authenticated;
revoke all on table public.user_roles from anon, authenticated;
revoke all on table public.classes from anon, authenticated;
revoke all on table public.class_sessions from anon, authenticated;
revoke all on table public.bookings from anon, authenticated;
revoke all on table public.trial_enquiries from anon, authenticated;
revoke all on table public.workshops from anon, authenticated;
revoke all on table public.gallery_items from anon, authenticated;

grant select on table public.profiles to authenticated;
grant update (full_name, phone, age, experience_level, preferred_format)
  on table public.profiles to authenticated;

grant select on table public.user_roles to authenticated;

grant select on table public.classes to anon, authenticated;
grant insert, update on table public.classes to authenticated;

grant select on table public.class_sessions to anon, authenticated;
grant insert, update on table public.class_sessions to authenticated;

grant select, insert on table public.bookings to authenticated;
grant update (status) on table public.bookings to authenticated;

grant insert on table public.trial_enquiries to anon, authenticated;
grant select on table public.trial_enquiries to authenticated;
grant update (status) on table public.trial_enquiries to authenticated;

grant select on table public.workshops to anon, authenticated;
grant insert, update on table public.workshops to authenticated;

grant select on table public.gallery_items to anon, authenticated;
grant insert, update on table public.gallery_items to authenticated;

create policy profiles_read_self_or_admin
on public.profiles
for select
to authenticated
using (
  id = (select auth.uid())
  or (select private.is_admin())
);

create policy profiles_update_self_or_admin
on public.profiles
for update
to authenticated
using (
  id = (select auth.uid())
  or (select private.is_admin())
)
with check (
  id = (select auth.uid())
  or (select private.is_admin())
);

create policy user_roles_read_self_or_admin
on public.user_roles
for select
to authenticated
using (
  user_id = (select auth.uid())
  or (select private.is_admin())
);

create policy classes_read_published
on public.classes
for select
to anon, authenticated
using (published and archived_at is null);

create policy classes_admin_read_all
on public.classes
for select
to authenticated
using ((select private.is_admin()));

create policy classes_admin_insert
on public.classes
for insert
to authenticated
with check ((select private.is_admin()));

create policy classes_admin_update
on public.classes
for update
to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));

create policy class_sessions_read_published
on public.class_sessions
for select
to anon, authenticated
using (
  status = 'published'
  and archived_at is null
  and exists (
    select 1
    from public.classes
    where classes.id = class_sessions.class_id
      and classes.published
      and classes.archived_at is null
  )
);

create policy class_sessions_admin_read_all
on public.class_sessions
for select
to authenticated
using ((select private.is_admin()));

create policy class_sessions_admin_insert
on public.class_sessions
for insert
to authenticated
with check ((select private.is_admin()));

create policy class_sessions_admin_update
on public.class_sessions
for update
to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));

create policy bookings_read_own
on public.bookings
for select
to authenticated
using (customer_id = (select auth.uid()));

create policy bookings_admin_read_all
on public.bookings
for select
to authenticated
using ((select private.is_admin()));

create policy bookings_customer_insert_pending_published_session
on public.bookings
for insert
to authenticated
with check (
  customer_id = (select auth.uid())
  and status = 'pending'
  and exists (
    select 1
    from public.class_sessions
    join public.classes on classes.id = class_sessions.class_id
    where class_sessions.id = bookings.session_id
      and class_sessions.status = 'published'
      and class_sessions.archived_at is null
      and class_sessions.starts_at > now()
      and classes.published
      and classes.archived_at is null
  )
);

create policy bookings_admin_insert
on public.bookings
for insert
to authenticated
with check ((select private.is_admin()));

create policy bookings_admin_update
on public.bookings
for update
to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));

create policy trial_enquiries_anon_insert
on public.trial_enquiries
for insert
to anon
with check (
  user_id is null
  and status = 'new'
  and consent_given
);

create policy trial_enquiries_authenticated_insert
on public.trial_enquiries
for insert
to authenticated
with check (
  (
    user_id = (select auth.uid())
    and status = 'new'
    and consent_given
  )
  or (select private.is_admin())
);

create policy trial_enquiries_admin_read
on public.trial_enquiries
for select
to authenticated
using ((select private.is_admin()));

create policy trial_enquiries_admin_update
on public.trial_enquiries
for update
to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));

create policy workshops_read_published
on public.workshops
for select
to anon, authenticated
using (published and archived_at is null);

create policy workshops_admin_read_all
on public.workshops
for select
to authenticated
using ((select private.is_admin()));

create policy workshops_admin_insert
on public.workshops
for insert
to authenticated
with check ((select private.is_admin()));

create policy workshops_admin_update
on public.workshops
for update
to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));

create policy gallery_items_read_published
on public.gallery_items
for select
to anon, authenticated
using (published and archived_at is null);

create policy gallery_items_admin_read_all
on public.gallery_items
for select
to authenticated
using ((select private.is_admin()));

create policy gallery_items_admin_insert
on public.gallery_items
for insert
to authenticated
with check ((select private.is_admin()));

create policy gallery_items_admin_update
on public.gallery_items
for update
to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));
