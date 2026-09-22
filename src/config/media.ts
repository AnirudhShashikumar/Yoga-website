export type PlaceholderMedia = Readonly<{
  src: string;
  alt: "";
  replacementRequired: true;
}>;

export const homeMedia = {
  hero: {
    src: "/images/placeholders/hero-practice.svg",
    alt: "",
    replacementRequired: true,
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
  hero: PlaceholderMedia;
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
