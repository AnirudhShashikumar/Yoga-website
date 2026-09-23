-- Milestone 4: core relational model.
-- All application timestamps and scheduled occurrences use timestamptz (UTC at rest).

create schema if not exists private;
revoke all on schema private from public;

create type public.app_role as enum ('customer', 'admin');
create type public.experience_level as enum ('beginner', 'intermediate', 'advanced');
create type public.delivery_format as enum ('online', 'offline');
create type public.practice_category as enum (
  'foundational',
  'dynamic',
  'mind_breath',
  'specialized',
  'personal_groups'
);
create type public.session_status as enum ('draft', 'published', 'cancelled', 'completed');
create type public.booking_status as enum ('pending', 'confirmed', 'completed', 'cancelled');
create type public.enquiry_status as enum ('new', 'contacted', 'converted', 'closed');
create type public.enquiry_time_window as enum ('morning', 'evening');
create type public.gallery_media_type as enum ('image', 'video');

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  phone text,
  age smallint,
  experience_level public.experience_level,
  preferred_format public.delivery_format,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_full_name_length check (
    full_name is null or char_length(btrim(full_name)) between 1 and 120
  ),
  constraint profiles_phone_length check (
    phone is null or char_length(btrim(phone)) between 7 and 30
  ),
  constraint profiles_age_range check (age is null or age between 10 and 120)
);

comment on table public.profiles is
  'Editable application profile data. Authentication identity and email remain in auth.users.';

create table public.user_roles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  role public.app_role not null,
  assigned_at timestamptz not null default now(),
  assigned_by uuid references auth.users (id) on delete set null
);

comment on table public.user_roles is
  'Protected application authorization. Data API clients have no insert, update, or delete privilege.';

create table public.classes (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  short_description text not null,
  description text not null,
  category public.practice_category not null,
  levels public.experience_level[] not null default '{}'::public.experience_level[],
  available_formats public.delivery_format[] not null default '{}'::public.delivery_format[],
  media_path text,
  sort_order integer not null default 0,
  featured boolean not null default false,
  published boolean not null default false,
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint classes_slug_format check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  constraint classes_name_length check (char_length(btrim(name)) between 1 and 120),
  constraint classes_short_description_length check (
    char_length(btrim(short_description)) between 1 and 300
  ),
  constraint classes_description_length check (
    char_length(btrim(description)) between 1 and 5000
  ),
  constraint classes_levels_no_nulls check (array_position(levels, null) is null),
  constraint classes_formats_no_nulls check (array_position(available_formats, null) is null),
  constraint classes_media_path check (
    media_path is null
    or (
      media_path !~ '^(https?://|/)'
      and char_length(media_path) between 1 and 500
    )
  ),
  constraint classes_sort_order_nonnegative check (sort_order >= 0),
  constraint classes_published_not_archived check (not published or archived_at is null)
);

create table public.class_sessions (
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null references public.classes (id) on delete restrict,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  format public.delivery_format not null,
  capacity integer,
  status public.session_status not null default 'draft',
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint class_sessions_time_order check (ends_at > starts_at),
  constraint class_sessions_capacity_positive check (capacity is null or capacity > 0),
  constraint class_sessions_published_not_archived check (
    status <> 'published' or archived_at is null
  )
);

comment on column public.class_sessions.starts_at is
  'Timezone-aware instant stored in UTC; render in the visitor or business timezone explicitly.';

create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references auth.users (id) on delete restrict,
  session_id uuid not null references public.class_sessions (id) on delete restrict,
  status public.booking_status not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.bookings is
  'Historical booking records are retained. No direct delete privilege is granted through the Data API.';

create table public.trial_enquiries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete set null,
  name text not null,
  email text not null,
  phone text not null,
  age smallint not null,
  experience_level public.experience_level not null,
  interested_class_id uuid references public.classes (id) on delete set null,
  interested_practice text not null,
  preferred_format public.delivery_format not null,
  preferred_time_window public.enquiry_time_window not null,
  message text not null default '',
  status public.enquiry_status not null default 'new',
  consent_given boolean not null default false,
  consented_at timestamptz,
  consent_source text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint trial_enquiries_name_length check (
    char_length(btrim(name)) between 1 and 120
  ),
  constraint trial_enquiries_email_length check (
    char_length(btrim(email)) between 3 and 254 and position('@' in email) > 1
  ),
  constraint trial_enquiries_phone_length check (
    char_length(btrim(phone)) between 7 and 30
  ),
  constraint trial_enquiries_age_range check (age between 10 and 120),
  constraint trial_enquiries_practice_length check (
    char_length(btrim(interested_practice)) between 1 and 120
  ),
  constraint trial_enquiries_message_length check (char_length(message) <= 2000),
  constraint trial_enquiries_consent_consistent check (
    (
      consent_given
      and consented_at is not null
      and consent_source is not null
      and char_length(btrim(consent_source)) between 1 and 80
    )
    or (
      not consent_given
      and consented_at is null
      and consent_source is null
    )
  )
);

create table public.workshops (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  summary text not null,
  description text not null,
  starts_at timestamptz,
  ends_at timestamptz,
  format public.delivery_format,
  media_path text,
  published boolean not null default false,
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint workshops_slug_format check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  constraint workshops_title_length check (char_length(btrim(title)) between 1 and 160),
  constraint workshops_summary_length check (char_length(btrim(summary)) between 1 and 400),
  constraint workshops_description_length check (char_length(btrim(description)) between 1 and 8000),
  constraint workshops_time_order check (
    ends_at is null or (starts_at is not null and ends_at > starts_at)
  ),
  constraint workshops_published_complete check (
    not published or (archived_at is null and starts_at is not null)
  ),
  constraint workshops_media_path check (
    media_path is null
    or (
      media_path !~ '^(https?://|/)'
      and char_length(media_path) between 1 and 500
    )
  )
);

create table public.gallery_items (
  id uuid primary key default gen_random_uuid(),
  storage_path text not null unique,
  media_type public.gallery_media_type not null,
  alt_text text not null default '',
  caption text,
  sort_order integer not null default 0,
  published boolean not null default false,
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint gallery_items_storage_path check (
    storage_path !~ '^(https?://|/)'
    and char_length(storage_path) between 1 and 500
  ),
  constraint gallery_items_alt_text_length check (char_length(alt_text) <= 500),
  constraint gallery_items_caption_length check (
    caption is null or char_length(caption) <= 1000
  ),
  constraint gallery_items_sort_order_nonnegative check (sort_order >= 0),
  constraint gallery_items_published_not_archived check (
    not published or archived_at is null
  )
);

create index classes_public_listing_idx
  on public.classes (sort_order, name)
  where published and archived_at is null;

create index class_sessions_class_time_idx
  on public.class_sessions (class_id, starts_at);

create index class_sessions_public_time_idx
  on public.class_sessions (starts_at)
  where status = 'published' and archived_at is null;

create index class_sessions_status_time_idx
  on public.class_sessions (status, starts_at);

create index bookings_customer_created_idx
  on public.bookings (customer_id, created_at desc);

create index bookings_session_status_idx
  on public.bookings (session_id, status);

create index bookings_status_created_idx
  on public.bookings (status, created_at desc);

create unique index bookings_one_active_per_customer_session_idx
  on public.bookings (customer_id, session_id)
  where status in ('pending', 'confirmed');

create index trial_enquiries_status_created_idx
  on public.trial_enquiries (status, created_at desc);

create index trial_enquiries_user_created_idx
  on public.trial_enquiries (user_id, created_at desc)
  where user_id is not null;

create index workshops_public_time_idx
  on public.workshops (starts_at)
  where published and archived_at is null;

create index gallery_items_public_order_idx
  on public.gallery_items (sort_order, created_at)
  where published and archived_at is null;

create function private.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function private.set_updated_at();

create trigger classes_set_updated_at
before update on public.classes
for each row execute function private.set_updated_at();

create trigger class_sessions_set_updated_at
before update on public.class_sessions
for each row execute function private.set_updated_at();

create trigger bookings_set_updated_at
before update on public.bookings
for each row execute function private.set_updated_at();

create trigger trial_enquiries_set_updated_at
before update on public.trial_enquiries
for each row execute function private.set_updated_at();

create trigger workshops_set_updated_at
before update on public.workshops
for each row execute function private.set_updated_at();

create trigger gallery_items_set_updated_at
before update on public.gallery_items
for each row execute function private.set_updated_at();

create function private.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id) values (new.id);
  insert into public.user_roles (user_id, role) values (new.id, 'customer');
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function private.handle_new_auth_user();

revoke all on all functions in schema private from public;
