-- Production-safe development seed.
-- These are the 12 verified public practice definitions already maintained in
-- src/config/classes.ts. No people, schedules, bookings, prices, workshops, or
-- gallery records belong in this seed.

insert into public.classes (
  slug,
  name,
  short_description,
  description,
  category,
  levels,
  available_formats,
  sort_order,
  featured,
  published
)
values
  (
    'hatha-yoga',
    'Hatha Yoga',
    'A steady practice centered on postures, breath, and attentive pacing.',
    'Hatha Yoga offers a considered way to explore posture and breath without rushing the practice. Individual session details are confirmed during an enquiry.',
    'foundational',
    '{}',
    '{}',
    10,
    false,
    true
  ),
  (
    'ashtanga-yoga',
    'Ashtanga Yoga',
    'A structured practice for those who prefer a purposeful sequence.',
    'Ashtanga Yoga follows a more structured approach to movement and attention. The sequence and pace are discussed according to the practitioner and available session format.',
    'dynamic',
    '{}',
    '{}',
    20,
    false,
    true
  ),
  (
    'power-yoga',
    'Power Yoga',
    'An active yoga format built around continuous, purposeful movement.',
    'Power Yoga is presented as an active practice. Suitability, pacing, and the specific session structure are confirmed directly before joining.',
    'dynamic',
    '{}',
    '{}',
    30,
    false,
    true
  ),
  (
    'yin-yoga',
    'Yin Yoga',
    'A quieter practice with unhurried shapes and time for observation.',
    'Yin Yoga takes a slower, quieter approach. The practice makes room for stillness and observation while keeping guidance clear and approachable.',
    'foundational',
    '{}',
    '{}',
    40,
    false,
    true
  ),
  (
    'yoga-sports',
    'Yoga Sports',
    'A skill-oriented practice combining yoga movement with disciplined preparation.',
    'Yoga Sports is a verified Prabha Yogashala offering. Its specific structure and suitability are discussed before a session because competitive or event details have not been supplied.',
    'dynamic',
    '{}',
    '{}',
    50,
    false,
    true
  ),
  (
    'meditation',
    'Meditation',
    'Dedicated time for stillness, observation, and a quieter pace.',
    'Meditation sessions create space for attentive stillness. The method, format, and session details are clarified during an enquiry rather than assumed in advance.',
    'mind_breath',
    '{}',
    '{}',
    60,
    false,
    true
  ),
  (
    'pranayama',
    'Pranayama',
    'Breath-focused practice approached with patience and careful attention.',
    'Pranayama places attention on the breath through guided practice. The particular techniques and pace are selected for the session and are not presented as medical treatment.',
    'mind_breath',
    '{}',
    '{}',
    70,
    false,
    true
  ),
  (
    'personal-yoga',
    'Personal Yoga',
    'An individual format shaped through a direct conversation about your practice.',
    'Personal Yoga provides an individual session format. Goals, appropriate practice, delivery format, and timing are discussed directly before anything is confirmed.',
    'personal_groups',
    '{}',
    '{}',
    80,
    false,
    true
  ),
  (
    'corporate-yoga',
    'Corporate Yoga',
    'Yoga sessions for workplace groups, arranged through direct enquiry.',
    'Corporate Yoga is available as a group offering. Group size, format, location, timing, and session structure remain subject to direct discussion.',
    'personal_groups',
    '{}',
    '{}',
    90,
    false,
    true
  ),
  (
    'prenatal-yoga',
    'Prenatal Yoga',
    'A specialized offering whose suitability must be confirmed before joining.',
    'Prenatal Yoga is a verified offering, but it is not medical care. Individual suitability and any necessary professional guidance should be discussed before participating.',
    'specialized',
    '{}',
    '{}',
    100,
    false,
    true
  ),
  (
    'kids-yoga',
    'Kids Yoga',
    'An age-aware yoga offering for younger practitioners aged 10 and above.',
    'Kids Yoga is offered within Prabha Yogashala''s confirmed audience of ages 10 and above. Age grouping, format, and session details are confirmed with a parent or guardian.',
    'specialized',
    '{}',
    '{}',
    110,
    false,
    true
  ),
  (
    'therapy-yoga',
    'Therapy Yoga',
    'A named yoga offering discussed individually before participation.',
    'Therapy Yoga is the client''s supplied service name. No claim is made that it diagnoses, treats, or cures a condition; suitability and scope must be discussed directly before joining.',
    'specialized',
    '{}',
    '{}',
    120,
    false,
    true
  )
on conflict (slug) do nothing;
