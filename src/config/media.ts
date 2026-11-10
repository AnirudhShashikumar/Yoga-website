export type PlaceholderMedia = Readonly<{
  src: string;
  alt: "";
  replacementRequired: true;
}>;

export type ProductionMedia = Readonly<{
  src: string;
  alt: string;
  replacementRequired: false;
}>;

export const homeMedia = {
  hero: {
    src: "/images/editorial/home-hero-yoga.jpg",
    alt: "A practitioner holding a side-plank yoga pose in a plant-filled room.",
    replacementRequired: false,
  },
  gallery: [
    {
      src: "/images/editorial/home-gallery-movement.jpg",
      alt: "A woman holding a warrior yoga pose in a bright indoor practice space.",
      replacementRequired: false,
    },
    {
      src: "/images/editorial/home-gallery-breath.jpg",
      alt: "A woman practicing alternate-nostril breathing with her eyes closed.",
      replacementRequired: false,
    },
    {
      src: "/images/editorial/home-gallery-stillness.jpg",
      alt: "A woman seated in meditation with warm patterned sunlight across her face.",
      replacementRequired: false,
    },
  ],
} as const satisfies {
  hero: ProductionMedia;
  gallery: readonly ProductionMedia[];
};

export const publicMedia = {
  founder: {
    src: "/images/instructor/karthika-b.jpg",
    alt: "Portrait of yoga instructor Karthika B",
    replacementRequired: false,
  },
  gallery: [
    {
      src: "/images/placeholders/gallery-movement.svg",
      alt: "",
      replacementRequired: true,
    },
    {
      src: "/images/placeholders/gallery-breath.svg",
      alt: "",
      replacementRequired: true,
    },
    {
      src: "/images/placeholders/gallery-stillness.svg",
      alt: "",
      replacementRequired: true,
    },
    {
      src: "/images/placeholders/gallery-balance.svg",
      alt: "",
      replacementRequired: true,
    },
    {
      src: "/images/placeholders/gallery-flow.svg",
      alt: "",
      replacementRequired: true,
    },
    {
      src: "/images/placeholders/gallery-rest.svg",
      alt: "",
      replacementRequired: true,
    },
  ],
} as const satisfies {
  founder: ProductionMedia;
  gallery: readonly PlaceholderMedia[];
};
