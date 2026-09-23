-- Milestone 4: public-read, admin-write Storage buckets.
-- Object bytes must be managed through the Storage API, never by mutating storage.objects directly.

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values
  (
    'class-media',
    'class-media',
    true,
    8388608,
    array['image/jpeg', 'image/png', 'image/webp', 'image/avif']
  ),
  (
    'workshop-media',
    'workshop-media',
    true,
    8388608,
    array['image/jpeg', 'image/png', 'image/webp', 'image/avif']
  ),
  (
    'gallery-media',
    'gallery-media',
    true,
    26214400,
    array[
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/avif',
      'video/mp4',
      'video/webm'
    ]
  ),
  (
    'founder-media',
    'founder-media',
    true,
    8388608,
    array['image/jpeg', 'image/png', 'image/webp', 'image/avif']
  )
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy storage_media_admin_read
on storage.objects
for select
to authenticated
using (
  bucket_id in ('class-media', 'workshop-media', 'gallery-media', 'founder-media')
  and (select private.is_admin())
);

create policy storage_media_admin_insert
on storage.objects
for insert
to authenticated
with check (
  (select private.is_admin())
  and (
    (
      bucket_id in ('class-media', 'workshop-media', 'gallery-media')
      and (storage.foldername(name))[1] ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
    )
    or (
      bucket_id = 'founder-media'
      and (storage.foldername(name))[1] = 'founder'
    )
  )
);

create policy storage_media_admin_update
on storage.objects
for update
to authenticated
using (
  bucket_id in ('class-media', 'workshop-media', 'gallery-media', 'founder-media')
  and (select private.is_admin())
)
with check (
  (select private.is_admin())
  and (
    (
      bucket_id in ('class-media', 'workshop-media', 'gallery-media')
      and (storage.foldername(name))[1] ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
    )
    or (
      bucket_id = 'founder-media'
      and (storage.foldername(name))[1] = 'founder'
    )
  )
);

create policy storage_media_admin_delete
on storage.objects
for delete
to authenticated
using (
  bucket_id in ('class-media', 'workshop-media', 'gallery-media', 'founder-media')
  and (select private.is_admin())
);
