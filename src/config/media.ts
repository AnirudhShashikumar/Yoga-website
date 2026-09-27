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
  ],
} as const satisfies {
  hero: ProductionMedia;
  gallery: readonly PlaceholderMedia[];
};

export const publicMedia = {
  founder: {
    src: "/images/placeholders/founder-neutral.svg",
    alt: "",
    replacementRequired: true,
  },
  gallery: [
    ...homeMedia.gallery,
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
  founder: PlaceholderMedia;
  gallery: readonly PlaceholderMedia[];
};
