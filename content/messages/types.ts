/** Full site copy for one locale — keep `es` and `en` in sync. */

export type RequirementTypeOption = {
  value: string;
  label: string;
};

export type SiteMessages = {
  /** Locale segment for URLs: `/${locale}/...` */
  locale: "es" | "en";
  siteMeta: {
    name: string;
    tagline: string;
    description: string;
    url: string;
  };
  navLinks: { href: string; label: string }[];
  socialLinks: (
    | { label: "Instagram"; href: string; handle: string }
    | { label: "LinkedIn"; href: string }
  )[];
  siteHeader: {
    ctaPrimary: string;
    navMobileAria: string;
    languageSwitcherAria: string;
    languageEs: string;
    languageEn: string;
    menuOpenAria: string;
    menuCloseAria: string;
  };
  hero: {
    headline: string;
    subline: string;
    ctaPrimary: string;
    ctaSecondary: string;
    photoPrefix: string;
    backgroundImage: {
      src: string;
      alt: string;
      credit: string;
      creditUrl: string;
    };
  };
  about: {
    id: string;
    title: string;
    mission: string;
    vision: string;
    stats: { prefix: string; value: string; label: string }[];
  };
  services: {
    id: string;
    title: string;
    items: { title: string; description: string }[];
  };
  products: {
    id: string;
    title: string;
    items: { title: string; description: string }[];
  };
  techStack: {
    id: string;
    title: string;
    items: { id: string; label: string }[];
  };
  portfolio: {
    id: string;
    title: string;
    description: string;
    hint: string;
    cardLine: string;
    ctaLabel: string;
    url: string;
  };
  contact: {
    id: string;
    title: string;
    description: string;
    requirementTypes: RequirementTypeOption[];
  };
  contactForm: {
    labels: {
      name: string;
      email: string;
      company: string;
      phone: string;
      requirementType: string;
      message: string;
      required: string;
    };
    placeholders: {
      name: string;
      email: string;
      company: string;
      phone: string;
      message: string;
    };
    optional: string;
    sending: string;
    submit: string;
    success: string;
    errorFirebase: string;
    errorPermission: string;
    errorGeneric: string;
  };
  footer: {
    navAria: string;
    /** Placeholders: {name}, {tagline} */
    homeLinkAria: string;
    /** Placeholder: {handle} */
    socialAriaInstagram: string;
    /** Placeholder: {brand} */
    socialAriaLinkedIn: string;
  };
  blog: {
    navLabel: string;
    sectionTitle: string;
    sectionSubtitle: string;
    viewAll: string;
    pageTitle: string;
    pageDescription: string;
    readingTime: string;
    /** Placeholder: {minutes} */
    readingTimeMinutes: string;
    authorByline: string;
    publishedLabel: string;
    imageCreditPrefix: string;
    auroraTakeHeading: string;
    referencesHeading: string;
    emptyList: string;
    readArticle: string;
  };
};
