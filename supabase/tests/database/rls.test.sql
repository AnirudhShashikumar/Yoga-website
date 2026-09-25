begin;

create extension if not exists pgtap with schema extensions;
set local search_path = public, extensions;

select plan(69);

-- Test-only identities and records. The transaction is always rolled back and
-- these fixtures never enter supabase/seed.sql.
insert into auth.users (
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at
)
values
  (
    '10000000-0000-4000-8000-000000000001',
    'authenticated',
    'authenticated',
    'customer-a@example.test',
    'not-used-for-authentication',
    now(),
    '{}',
    '{}',
    now(),
    now()
  ),
  (
    '20000000-0000-4000-8000-000000000002',
    'authenticated',
    'authenticated',
    'customer-b@example.test',
    'not-used-for-authentication',
    now(),
    '{}',
    '{}',
    now(),
    now()
  ),
  (
    'a0000000-0000-4000-8000-00000000000a',
    'authenticated',
    'authenticated',
    'admin@example.test',
    'not-used-for-authentication',
    now(),
    '{}',
    '{}',
    now(),
    now()
  );

update public.user_roles
set role = 'admin', assigned_by = user_id
where user_id = 'a0000000-0000-4000-8000-00000000000a';

update public.profiles
set full_name = case id
  when '10000000-0000-4000-8000-000000000001' then 'Customer A'
  when '20000000-0000-4000-8000-000000000002' then 'Customer B'
  else 'Test Admin'
end;

insert into public.classes (
  id,
  slug,
  name,
  short_description,
  description,
  category,
  published
)
values
  (
    'c0000000-0000-4000-8000-000000000001',
    'rls-public-practice',
    'RLS Public Practice',
    'Published content used only by the rollback-only RLS test.',
    'Published content used only by the rollback-only RLS test suite.',
    'foundational',
    true
  ),
  (
    'c0000000-0000-4000-8000-000000000002',
    'rls-private-practice',
    'RLS Private Practice',
    'Unpublished content used only by the rollback-only RLS test.',
    'Unpublished content used only by the rollback-only RLS test suite.',
    'foundational',
    false
  );

insert into public.class_sessions (
  id,
  class_id,
  starts_at,
  ends_at,
  format,
  capacity,
  status
)
values
  (
    '51000000-0000-4000-8000-000000000001',
    'c0000000-0000-4000-8000-000000000001',
    now() + interval '7 days',
    now() + interval '7 days 1 hour',
    'online',
    20,
    'published'
  ),
  (
    '51000000-0000-4000-8000-000000000002',
    'c0000000-0000-4000-8000-000000000001',
    now() + interval '8 days',
    now() + interval '8 days 1 hour',
    'offline',
    1,
    'published'
  ),
  (
    '51000000-0000-4000-8000-000000000003',
    'c0000000-0000-4000-8000-000000000002',
    now() + interval '9 days',
    now() + interval '9 days 1 hour',
    'online',
    null,
    'draft'
  ),
  (
    '51000000-0000-4000-8000-000000000004',
    'c0000000-0000-4000-8000-000000000002',
    now() - interval '7 days',
    now() - interval '7 days' + interval '1 hour',
    'online',
    null,
    'completed'
  );

insert into public.bookings (id, customer_id, session_id, status)
values
  (
    'b0000000-0000-4000-8000-000000000001',
    '10000000-0000-4000-8000-000000000001',
    '51000000-0000-4000-8000-000000000001',
    'pending'
  ),
  (
    'b0000000-0000-4000-8000-000000000002',
    '20000000-0000-4000-8000-000000000002',
    '51000000-0000-4000-8000-000000000001',
    'pending'
  ),
  (
    'b0000000-0000-4000-8000-000000000003',
    '10000000-0000-4000-8000-000000000001',
    '51000000-0000-4000-8000-000000000004',
    'completed'
  );

insert into public.trial_enquiries (
  id,
  user_id,
  name,
  email,
  phone,
  age,
  experience_level,
  interested_practice,
  preferred_format,
  preferred_time_window,
  status,
  consent_given,
  consented_at,
  consent_source
)
values
  (
    'e0000000-0000-4000-8000-000000000001',
    '10000000-0000-4000-8000-000000000001',
    'Customer A',
    'customer-a@example.test',
    '9999999991',
    30,
    'beginner',
    'Hatha Yoga',
    'online',
    'morning',
    'new',
    true,
    now(),
    'rls-test'
  ),
  (
    'e0000000-0000-4000-8000-000000000002',
    '20000000-0000-4000-8000-000000000002',
    'Customer B',
    'customer-b@example.test',
    '9999999992',
    35,
    'intermediate',
    'Meditation',
    'offline',
    'evening',
    'new',
    true,
    now(),
    'rls-test'
  );

-- Anonymous boundary.
set local role anon;
select set_config('request.jwt.claim.sub', '', true);
select set_config('request.jwt.claim.role', 'anon', true);

select is(
  (select count(*) from public.classes where id = 'c0000000-0000-4000-8000-000000000001'),
  1::bigint,
  'anonymous can read a published class'
);
select is(
  (select count(*) from public.classes where id = 'c0000000-0000-4000-8000-000000000002'),
  0::bigint,
  'anonymous cannot read an unpublished class'
);
select is(
  (select count(*) from public.class_sessions where id = '51000000-0000-4000-8000-000000000001'),
  1::bigint,
  'anonymous can read a published future session for a published class'
);
select is(
  (select count(*) from public.class_sessions where id = '51000000-0000-4000-8000-000000000003'),
  0::bigint,
  'anonymous cannot read a draft session'
);
select is(
  (select count(*) from public.class_sessions where id = '51000000-0000-4000-8000-000000000004'),
  0::bigint,
  'anonymous cannot read a customer booking-history session'
);
select throws_ok(
  $$select count(*) from public.profiles$$,
  '42501',
  null,
  'anonymous cannot read profiles'
);
select throws_ok(
  $$select count(*) from public.bookings$$,
  '42501',
  null,
  'anonymous cannot read bookings'
);
select throws_ok(
  $$insert into public.bookings (customer_id, session_id) values ('10000000-0000-4000-8000-000000000001', '51000000-0000-4000-8000-000000000001')$$,
  '42501',
  null,
  'anonymous cannot create a booking'
);
select throws_ok(
  $$select count(*) from public.trial_enquiries$$,
  '42501',
  null,
  'anonymous cannot enumerate trial enquiries'
);
select throws_ok(
  $$update public.classes set name = 'Compromised' where id = 'c0000000-0000-4000-8000-000000000001'$$,
  '42501',
  null,
  'anonymous cannot perform class administration'
);
select lives_ok(
  $$
    insert into public.trial_enquiries (
      id, user_id, name, email, phone, age, experience_level,
      interested_practice, preferred_format, preferred_time_window, status,
      consent_given, consented_at, consent_source
    ) values (
      'ffffffff-ffff-4fff-8fff-ffffffffffff',
      '20000000-0000-4000-8000-000000000002',
      'Anonymous Test', 'anonymous@example.test', '9999999993', 25, 'beginner',
      'Pranayama', 'online', 'morning', 'converted', true, now(), 'rls-test'
    )
  $$,
  'anonymous can create a valid trial enquiry'
);
select throws_ok(
  $$
    insert into public.trial_enquiries (
      name, email, phone, age, experience_level, interested_practice,
      preferred_format, preferred_time_window, consent_given, consented_at, consent_source
    ) values (
      'Invalid Age', 'invalid@example.test', '9999999994', 9, 'beginner',
      'Pranayama', 'online', 'morning', true, now(), 'rls-test'
    )
  $$,
  '23514',
  null,
  'anonymous input remains subject to database constraints'
);
select throws_ok(
  $$
    insert into public.trial_enquiries (
      name, email, phone, age, experience_level, interested_practice,
      preferred_format, preferred_time_window, consent_given
    ) values (
      'No Consent', 'no-consent@example.test', '9999999994', 25, 'beginner',
      'Pranayama', 'online', 'morning', false
    )
  $$,
  '42501',
  null,
  'anonymous enquiry insertion requires affirmative consent'
);

reset role;
select is(
  (
    select
      user_id is null
      and status = 'new'
      and consented_at is not null
      and consent_source = 'data-api'
    from public.trial_enquiries
    where name = 'Anonymous Test'
  ),
  true,
  'anonymous cannot inject ownership or administrative enquiry status'
);

-- Customer A boundary.
set local role authenticated;
select set_config('request.jwt.claim.sub', '10000000-0000-4000-8000-000000000001', true);
select set_config('request.jwt.claim.role', 'authenticated', true);

select is((select count(*) from public.profiles), 1::bigint, 'customer A sees only their profile');
select is(
  (select full_name from public.profiles where id = '10000000-0000-4000-8000-000000000001'),
  'Customer A',
  'customer A can read permitted own profile data'
);
select lives_ok(
  $$update public.profiles set phone = '8888888881' where id = '10000000-0000-4000-8000-000000000001'$$,
  'customer A can update a permitted own profile field'
);
with changed as (
  update public.profiles
  set phone = 'compromised'
  where id = '20000000-0000-4000-8000-000000000002'
  returning 1
)
select is(
  (select count(*) from changed),
  0::bigint,
  'customer A cannot update customer B profile'
);
select throws_ok(
  $$update public.user_roles set role = 'admin' where user_id = '10000000-0000-4000-8000-000000000001'$$,
  '42501',
  null,
  'customer A cannot promote themselves to admin'
);
select throws_ok(
  $$select * from public.admin_customer_directory()$$,
  '42501',
  'Administrator access is required',
  'customer A cannot read the admin customer directory'
);
select is((select count(*) from public.bookings), 2::bigint, 'customer A sees only their bookings');
select is(
  (select count(*) from public.classes where id = 'c0000000-0000-4000-8000-000000000001'),
  1::bigint,
  'customer A can read a published class'
);
select is(
  (select count(*) from public.class_sessions where id = '51000000-0000-4000-8000-000000000001'),
  1::bigint,
  'customer A can read a published session'
);
select is(
  (select count(*) from public.class_sessions where id = '51000000-0000-4000-8000-000000000004'),
  1::bigint,
  'customer A can read the completed session in their booking history'
);
select is(
  (select count(*) from public.classes where id = 'c0000000-0000-4000-8000-000000000002'),
  1::bigint,
  'customer A can read the unpublished class in their booking history'
);
select is(
  (select count(*) from public.bookings where customer_id = '20000000-0000-4000-8000-000000000002'),
  0::bigint,
  'customer A cannot read customer B bookings'
);
select is((select count(*) from public.trial_enquiries), 0::bigint, 'customer A cannot read enquiry management data');
with changed as (
  update public.classes
  set name = 'Compromised'
  where id = 'c0000000-0000-4000-8000-000000000001'
  returning 1
)
select is(
  (select count(*) from changed),
  0::bigint,
  'customer A cannot mutate managed class content'
);
select lives_ok(
  $$
    insert into public.bookings (id, customer_id, session_id, status)
    values (
      'ffffffff-ffff-4fff-8fff-fffffffffff1',
      '20000000-0000-4000-8000-000000000002',
      '51000000-0000-4000-8000-000000000002',
      'confirmed'
    )
  $$,
  'customer A can create a booking for an eligible session'
);
select throws_ok(
  $$insert into public.bookings (customer_id, session_id) values ('20000000-0000-4000-8000-000000000002', '51000000-0000-4000-8000-000000000001')$$,
  '23505',
  null,
  'duplicate active customer booking is rejected'
);

reset role;
set local role authenticated;
select set_config('request.jwt.claim.sub', '20000000-0000-4000-8000-000000000002', true);
select set_config('request.jwt.claim.role', 'authenticated', true);

select throws_ok(
  $$insert into public.bookings (customer_id, session_id) values ('20000000-0000-4000-8000-000000000002', '51000000-0000-4000-8000-000000000002')$$,
  'P0001',
  'Session capacity has been reached',
  'database rejects a customer booking after session capacity is reached'
);

reset role;
set local role authenticated;
select set_config('request.jwt.claim.sub', '10000000-0000-4000-8000-000000000001', true);
select set_config('request.jwt.claim.role', 'authenticated', true);

select lives_ok(
  $$update public.bookings set status = 'cancelled' where customer_id = '10000000-0000-4000-8000-000000000001' and session_id = '51000000-0000-4000-8000-000000000002'$$,
  'customer A can cancel their own future active booking'
);
with changed as (
  update public.bookings
  set status = 'cancelled'
  where id = 'b0000000-0000-4000-8000-000000000002'
  returning 1
)
select is(
  (select count(*) from changed),
  0::bigint,
  'customer A cannot cancel customer B booking'
);
select throws_ok(
  $$update public.bookings set status = 'confirmed' where id = 'b0000000-0000-4000-8000-000000000001'$$,
  '42501',
  null,
  'customer A cannot promote their own pending booking to confirmed'
);
select throws_ok(
  $$update public.bookings set customer_id = '20000000-0000-4000-8000-000000000002' where customer_id = '10000000-0000-4000-8000-000000000001'$$,
  '42501',
  null,
  'customer A has no column privilege to change booking ownership'
);
select lives_ok(
  $$
    insert into public.trial_enquiries (
      user_id, name, email, phone, age, experience_level, interested_practice,
      preferred_format, preferred_time_window, status,
      consent_given, consented_at, consent_source
    ) values (
      '20000000-0000-4000-8000-000000000002',
      'Authenticated Test', 'auth-test@example.test', '9999999995', 28, 'beginner',
      'Meditation', 'offline', 'evening', 'closed', true, now(), 'rls-test'
    )
  $$,
  'customer A can create an authenticated trial enquiry'
);

reset role;
select is(
  (
    select status
    from public.bookings
    where customer_id = '10000000-0000-4000-8000-000000000001'
      and session_id = '51000000-0000-4000-8000-000000000002'
  ),
  'cancelled'::public.booking_status,
  'customer cancellation persists without changing booking ownership'
);
select is(
  (
    select customer_id = '10000000-0000-4000-8000-000000000001' and status = 'cancelled'
    from public.bookings
    where session_id = '51000000-0000-4000-8000-000000000002'
  ),
  true,
  'booking trigger prevents customer A from injecting booking ownership'
);
select is(
  (
    select
      user_id = '10000000-0000-4000-8000-000000000001'
      and status = 'new'
      and consented_at is not null
      and consent_source = 'data-api'
    from public.trial_enquiries
    where name = 'Authenticated Test'
  ),
  true,
  'enquiry trigger prevents customer A from injecting owner or status'
);

-- Customer B reciprocal isolation.
set local role authenticated;
select set_config('request.jwt.claim.sub', '20000000-0000-4000-8000-000000000002', true);
select set_config('request.jwt.claim.role', 'authenticated', true);

select is((select count(*) from public.profiles), 1::bigint, 'customer B sees only their profile');
select is(
  (select count(*) from public.profiles where id = '10000000-0000-4000-8000-000000000001'),
  0::bigint,
  'customer B cannot read customer A profile'
);
select is((select count(*) from public.bookings), 1::bigint, 'customer B sees only their booking');
select is(
  (select count(*) from public.bookings where customer_id = '10000000-0000-4000-8000-000000000001'),
  0::bigint,
  'customer B cannot read customer A bookings'
);
select is(
  (select count(*) from public.class_sessions where id = '51000000-0000-4000-8000-000000000004'),
  0::bigint,
  'customer B cannot read customer A booking-history session'
);
select is(
  (select count(*) from public.classes where id = 'c0000000-0000-4000-8000-000000000002'),
  0::bigint,
  'customer B cannot read an unpublished class through customer A history'
);
with changed as (
  update public.profiles
  set phone = 'compromised'
  where id = '10000000-0000-4000-8000-000000000001'
  returning 1
)
select is(
  (select count(*) from changed),
  0::bigint,
  'customer B cannot update customer A profile'
);
select throws_ok(
  $$update public.user_roles set role = 'admin' where user_id = '20000000-0000-4000-8000-000000000002'$$,
  '42501',
  null,
  'customer B cannot promote themselves to admin'
);
with changed as (
  update public.workshops set published = true returning 1
)
select is(
  (select count(*) from changed),
  0::bigint,
  'customer B cannot perform workshop administration'
);

-- Admin boundary and lifecycle enforcement.
reset role;
set local role authenticated;
select set_config('request.jwt.claim.sub', 'a0000000-0000-4000-8000-00000000000a', true);
select set_config('request.jwt.claim.role', 'authenticated', true);

select is(
  (
    select count(*)
    from public.profiles
    where id in (
      '10000000-0000-4000-8000-000000000001',
      '20000000-0000-4000-8000-000000000002',
      'a0000000-0000-4000-8000-00000000000a'
    )
  ),
  3::bigint,
  'admin can read all fixture profiles'
);
select is((select count(*) from public.bookings), 4::bigint, 'admin can read all bookings');
select is((select count(*) from public.trial_enquiries), 4::bigint, 'admin can read all trial enquiries');
select is(
  (select count(*) from public.admin_customer_directory()),
  2::bigint,
  'admin can read the bounded customer auth directory'
);
select is(
  (select count(*) from public.classes where id = 'c0000000-0000-4000-8000-000000000002'),
  1::bigint,
  'admin can read unpublished class content'
);
select lives_ok(
  $$
    insert into public.classes (
      id, slug, name, short_description, description, category
    ) values (
      'c0000000-0000-4000-8000-000000000003',
      'rls-admin-practice', 'RLS Admin Practice',
      'Admin-managed test class.', 'Admin-managed rollback-only test class.',
      'specialized'
    )
  $$,
  'admin can create managed class content'
);
select lives_ok(
  $$update public.class_sessions set capacity = 24 where id = '51000000-0000-4000-8000-000000000001'$$,
  'admin can manage sessions'
);
select throws_ok(
  $$update public.classes set slug = 'changed-public-practice' where id = 'c0000000-0000-4000-8000-000000000001'$$,
  '23514',
  'Class slugs are immutable after creation',
  'class slugs cannot be rewritten after creation'
);
select throws_ok(
  $$update public.classes set published = false where id = 'c0000000-0000-4000-8000-000000000001'$$,
  '23514',
  'Cancel or complete future published sessions before hiding this class',
  'a class with future published sessions cannot be hidden'
);
select throws_ok(
  $$update public.class_sessions set starts_at = starts_at + interval '1 hour' where id = '51000000-0000-4000-8000-000000000001'$$,
  '23514',
  'Booked session identity, timing, and format are immutable',
  'booked session timing cannot be rewritten'
);
select throws_ok(
  $$update public.class_sessions set capacity = 1 where id = '51000000-0000-4000-8000-000000000001'$$,
  '23514',
  'Session capacity cannot be below active bookings',
  'session capacity cannot be reduced below active bookings'
);
select throws_ok(
  $$update public.class_sessions set archived_at = now() where id = '51000000-0000-4000-8000-000000000001'$$,
  '23514',
  'Cancel active bookings before archiving this session',
  'a session with active bookings cannot be archived'
);
select lives_ok(
  $$update public.class_sessions set status = 'cancelled' where id = '51000000-0000-4000-8000-000000000001'$$,
  'a booked session can be cancelled without rewriting its history'
);
select lives_ok(
  $$
    insert into public.workshops (
      slug, title, summary, description, starts_at, ends_at, format, published
    ) values (
      'rls-admin-workshop', 'RLS Admin Workshop', 'Rollback-only workshop.',
      'Rollback-only workshop for the RLS test.', now() + interval '10 days',
      now() + interval '10 days 1 hour', 'online', true
    )
  $$,
  'admin can create workshop content'
);
select lives_ok(
  $$
    insert into public.gallery_items (
      storage_path, media_type, alt_text, published
    ) values (
      '00000000-0000-4000-8000-000000000001/test.webp',
      'image', 'Rollback-only RLS test image', true
    )
  $$,
  'admin can create gallery metadata'
);
select lives_ok(
  $$update public.bookings set status = 'confirmed' where id = 'b0000000-0000-4000-8000-000000000001'$$,
  'admin can perform a valid booking transition'
);
select throws_ok(
  $$update public.bookings set status = 'pending' where id = 'b0000000-0000-4000-8000-000000000001'$$,
  '23514',
  null,
  'database rejects an invalid booking transition even for admin'
);
select lives_ok(
  $$update public.trial_enquiries set status = 'contacted' where id = 'e0000000-0000-4000-8000-000000000001'$$,
  'admin can perform a valid enquiry transition'
);
select throws_ok(
  $$update public.user_roles set role = 'admin' where user_id = '10000000-0000-4000-8000-000000000001'$$,
  '42501',
  null,
  'Data API admin cannot mutate protected role assignments'
);

reset role;
select is(
  (
    select count(*)
    from storage.buckets
    where id in ('class-media', 'workshop-media', 'gallery-media', 'founder-media')
  ),
  4::bigint,
  'all four bounded media buckets exist'
);
select is(
  (
    select count(*)
    from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname like 'storage_media_admin_%'
  ),
  4::bigint,
  'storage has the four expected admin policies'
);

select * from finish(true);
rollback;
