-- Assign approved, licensed stock photography through the existing class-media
-- Storage boundary. Preserve any media a content administrator may already have
-- assigned rather than overwriting it during deployment.

update public.classes as class
set media_path = media.path
from (
  values
    ('hatha-yoga', 'stock/hatha-yoga.jpg'),
    ('ashtanga-yoga', 'stock/ashtanga-yoga.jpg'),
    ('power-yoga', 'stock/power-yoga.jpg'),
    ('yin-yoga', 'stock/yin-yoga.jpg'),
    ('yoga-sports', 'stock/yoga-sports.jpg'),
    ('meditation', 'stock/meditation.jpg'),
    ('pranayama', 'stock/pranayama.jpg'),
    ('personal-yoga', 'stock/personal-yoga.jpg'),
    ('corporate-yoga', 'stock/corporate-yoga.jpg'),
    ('prenatal-yoga', 'stock/prenatal-yoga.jpg'),
    ('kids-yoga', 'stock/kids-yoga.jpg'),
    ('therapy-yoga', 'stock/therapy-yoga.jpg')
) as media(slug, path)
where class.slug = media.slug
  and class.media_path is null;
