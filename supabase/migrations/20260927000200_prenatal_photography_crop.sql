-- Move Prenatal Yoga to the reviewed landscape crop. The original immutable
-- object remains available for rollback while the class record changes to the
-- versioned replacement path.

update public.classes
set media_path = 'stock/prenatal-yoga-v2.jpg'
where slug = 'prenatal-yoga'
  and media_path = 'stock/prenatal-yoga.jpg';
