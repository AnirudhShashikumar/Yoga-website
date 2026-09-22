export const practiceCategories = [
  "Foundational",
  "Dynamic",
  "Mind & Breath",
  "Specialized",
  "Personal & Groups",
] as const;

export type PracticeCategory = (typeof practiceCategories)[number];

export type Practice = Readonly<{
  slug: string;
  name: string;
  category: PracticeCategory;
  summary: string;
  overview: string;
  maySuit: readonly string[];
  whatToExpect: readonly string[];
  practiceQualities: readonly string[];
}>;

export const practices = [
  {
    slug: "hatha-yoga",
    name: "Hatha Yoga",
    category: "Foundational",
    summary: "A steady practice centered on postures, breath, and attentive pacing.",
    overview:
      "Hatha Yoga offers a considered way to explore posture and breath without rushing the practice. Individual session details are confirmed during an enquiry.",
    maySuit: ["People beginning yoga", "Practitioners who prefer a measured pace", "Those returning to regular practice"],
    whatToExpect: ["Clear posture guidance", "Time to notice breath and alignment", "A pace matched to the session format"],
    practiceQualities: ["Steadiness", "Attention", "Foundational movement"],
  },
  {
    slug: "ashtanga-yoga",
    name: "Ashtanga Yoga",
    category: "Dynamic",
    summary: "A structured practice for those who prefer a purposeful sequence.",
    overview:
      "Ashtanga Yoga follows a more structured approach to movement and attention. The sequence and pace are discussed according to the practitioner and available session format.",
    maySuit: ["Practitioners who appreciate structure", "People building a consistent routine", "Those comfortable with a more active practice"],
    whatToExpect: ["A purposeful sequence", "Repeated patterns that support familiarity", "Clear pacing and transitions"],
    practiceQualities: ["Structure", "Continuity", "Focused movement"],
  },
  {
    slug: "power-yoga",
    name: "Power Yoga",
    category: "Dynamic",
    summary: "An active yoga format built around continuous, purposeful movement.",
    overview:
      "Power Yoga is presented as an active practice. Suitability, pacing, and the specific session structure are confirmed directly before joining.",
    maySuit: ["People looking for an active format", "Practitioners familiar with yoga movement", "Those who enjoy continuous sequences"],
    whatToExpect: ["A more active pace", "Linked movements", "Options discussed for the session"],
    practiceQualities: ["Energy", "Coordination", "Purposeful pacing"],
  },
  {
    slug: "yin-yoga",
    name: "Yin Yoga",
    category: "Foundational",
    summary: "A quieter practice with unhurried shapes and time for observation.",
    overview:
      "Yin Yoga takes a slower, quieter approach. The practice makes room for stillness and observation while keeping guidance clear and approachable.",
    maySuit: ["People who prefer an unhurried pace", "Practitioners balancing active routines", "Those exploring stillness in movement"],
    whatToExpect: ["Fewer transitions", "Longer moments of stillness", "Attentive, unhurried guidance"],
    practiceQualities: ["Stillness", "Patience", "Observation"],
  },
  {
    slug: "yoga-sports",
    name: "Yoga Sports",
    category: "Dynamic",
    summary: "A skill-oriented practice combining yoga movement with disciplined preparation.",
    overview:
      "Yoga Sports is a verified Prabha Yogashala offering. Its specific structure and suitability are discussed before a session because competitive or event details have not been supplied.",
    maySuit: ["Practitioners interested in skill development", "People comfortable with active practice", "Those seeking disciplined preparation"],
    whatToExpect: ["Technique-focused guidance", "Purposeful practice structure", "Session details confirmed in advance"],
    practiceQualities: ["Discipline", "Technique", "Preparation"],
  },
  {
    slug: "meditation",
    name: "Meditation",
    category: "Mind & Breath",
    summary: "Dedicated time for stillness, observation, and a quieter pace.",
    overview:
      "Meditation sessions create space for attentive stillness. The method, format, and session details are clarified during an enquiry rather than assumed in advance.",
    maySuit: ["Beginners curious about meditation", "People seeking a quieter practice", "Yoga practitioners adding stillness to their routine"],
    whatToExpect: ["Simple, clear guidance", "A calm practice setting", "Time for quiet observation"],
    practiceQualities: ["Stillness", "Attention", "Consistency"],
  },
  {
    slug: "pranayama",
    name: "Pranayama",
    category: "Mind & Breath",
    summary: "Breath-focused practice approached with patience and careful attention.",
    overview:
      "Pranayama places attention on the breath through guided practice. The particular techniques and pace are selected for the session and are not presented as medical treatment.",
    maySuit: ["People exploring breath-focused practice", "Meditation practitioners", "Those who value a measured, attentive format"],
    whatToExpect: ["Guided attention to breathing", "A patient pace", "Clear instructions for the selected practice"],
    practiceQualities: ["Breath awareness", "Patience", "Concentration"],
  },
  {
    slug: "personal-yoga",
    name: "Personal Yoga",
    category: "Personal & Groups",
    summary: "An individual format shaped through a direct conversation about your practice.",
    overview:
      "Personal Yoga provides an individual session format. Goals, appropriate practice, delivery format, and timing are discussed directly before anything is confirmed.",
    maySuit: ["People who prefer individual guidance", "Beginners seeking a clear starting point", "Practitioners with specific scheduling needs"],
    whatToExpect: ["A direct introductory conversation", "A format discussed around your needs", "No preset package or outcome claims"],
    practiceQualities: ["Individual attention", "Clarity", "Adaptable planning"],
  },
  {
    slug: "corporate-yoga",
    name: "Corporate Yoga",
    category: "Personal & Groups",
    summary: "Yoga sessions for workplace groups, arranged through direct enquiry.",
    overview:
      "Corporate Yoga is available as a group offering. Group size, format, location, timing, and session structure remain subject to direct discussion.",
    maySuit: ["Workplace groups exploring yoga", "Teams seeking a shared practice format", "Organizations ready to discuss practical arrangements"],
    whatToExpect: ["An initial requirements conversation", "A group-focused format", "Details confirmed before scheduling"],
    practiceQualities: ["Group participation", "Accessible guidance", "Practical planning"],
  },
  {
    slug: "prenatal-yoga",
    name: "Prenatal Yoga",
    category: "Specialized",
    summary: "A specialized offering whose suitability must be confirmed before joining.",
    overview:
      "Prenatal Yoga is a verified offering, but it is not medical care. Individual suitability and any necessary professional guidance should be discussed before participating.",
    maySuit: ["People who have discussed participation with an appropriate professional", "Those seeking a specialized yoga format", "Practitioners ready to share relevant considerations privately"],
    whatToExpect: ["A suitability conversation first", "Clear boundaries around the session", "Details confirmed before participation"],
    practiceQualities: ["Considered pacing", "Clear communication", "Individual suitability"],
  },
  {
    slug: "kids-yoga",
    name: "Kids Yoga",
    category: "Specialized",
    summary: "An age-aware yoga offering for younger practitioners aged 10 and above.",
    overview:
      "Kids Yoga is offered within Prabha Yogashala’s confirmed audience of ages 10 and above. Age grouping, format, and session details are confirmed with a parent or guardian.",
    maySuit: ["Younger practitioners aged 10 and above", "Beginners learning the basics", "Families seeking an age-aware format"],
    whatToExpect: ["Clear, approachable instruction", "Age-aware pacing", "Details confirmed with a parent or guardian"],
    practiceQualities: ["Participation", "Attention", "Approachable movement"],
  },
  {
    slug: "therapy-yoga",
    name: "Therapy Yoga",
    category: "Specialized",
    summary: "A named yoga offering discussed individually before participation.",
    overview:
      "Therapy Yoga is the client’s supplied service name. No claim is made that it diagnoses, treats, or cures a condition; suitability and scope must be discussed directly before joining.",
    maySuit: ["People seeking an individual suitability conversation", "Practitioners who need clear scope before joining", "Those able to share relevant considerations privately"],
    whatToExpect: ["A conversation before any session", "Clear limits and expectations", "No medical diagnosis or guaranteed outcome"],
    practiceQualities: ["Individual discussion", "Considered pacing", "Clear scope"],
  },
] as const satisfies readonly Practice[];

export type ClassName = (typeof practices)[number]["name"];

export const classNames = practices.map((practice) => practice.name) as readonly ClassName[];

export function getPracticeBySlug(slug: string) {
  return practices.find((practice) => practice.slug === slug);
}

export function getRelatedPractices(practice: Practice, limit = 3) {
  const sameCategory = practices.filter(
    (candidate) => candidate.slug !== practice.slug && candidate.category === practice.category,
  );
  const others = practices.filter(
    (candidate) => candidate.slug !== practice.slug && candidate.category !== practice.category,
  );

  return [...sameCategory, ...others].slice(0, limit);
}
