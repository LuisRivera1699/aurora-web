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
    backgroundImage: {
      src: string;
      alt: string;
    };
  };
  about: {
    id: string;
    title: string;
    subtitle: string;
    seoDescription: string;
    image: {
      src: string;
      alt: string;
    };
    principles: {
      title: string;
      subtitle: string;
      items: {
        title: string;
        description: string;
      }[];
    };
    differentiators: {
      title: string;
      subtitle: string;
      items: {
        title: string;
        description: string;
      }[];
      closingLine: string;
    };
    experienceTitle: string;
    stats: { prefix: string; value: string; label: string; description: string }[];
    closing: {
      title: string;
      description: string;
      servicesCta: string;
      contactCta: string;
    };
  };
  services: {
    id: string;
    eyebrow: string;
    title: string;
    subtitle: string;
    ctaText: string;
    ctaLabel: string;
    items: {
      slug: string;
      title: string;
      description: string;
      detailsCtaLabel: string;
      contactCtaLabel: string;
      focus: string[];
    }[];
  };
  products: {
    id: string;
    title: string;
    items: { title: string; description: string }[];
  };
  portfolio: {
    id: string;
    eyebrow: string;
    title: string;
    description: string;
    hint: string;
    cardLine: string;
    highlights: string[];
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
  notFound: {
    title: string;
    description: string;
    homeCta: string;
    contactCta: string;
    panelEyebrow: string;
    panelTitle: string;
    panelDescription: string;
    diagnosticLink: string;
    blogLink: string;
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
  diagnosticPromo: {
    title: string;
    description: string;
    cta: string;
  };
  /** Post-booking Calendly redirect; locale resolved via middleware from `/diagnostic/thanks`. */
  diagnosticThanks: {
    pageTitle: string;
    headline: string;
    bodyMeeting: string;
    bodyEmail: string;
    /** Shown before the formatted date/time when Calendly passes `event_start_time`. */
    meetingIntro: string;
    homeCta: string;
  };
  diagnostic: {
    navLabel: string;
    pageTitle: string;
    pageSubtitle: string;
    progress: string;
    back: string;
    next: string;
    submit: string;
    submitting: string;
    errorGeneric: string;
    errorNotConfigured: string;
    stepProfileTitle: string;
    stepProfileSubtitle: string;
    optionCompany: string;
    optionStartup: string;
    optionFreelancer: string;
    stepCompanyGoalTitle: string;
    optionAutomation: string;
    optionNewProduct: string;
    optionUnsure: string;
    optionUrgent: string;
    optionSoon: string;
    optionExploring: string;
    /** Texto pequeño bajo cada pregunta abierta del flujo (animación a dar más detalle). */
    flowStepDetailHint: string;
    stepContactTitle: string;
    labels: {
      name: string;
      email: string;
      company: string;
      phone: string;
      webUrlCompany: string;
      webUrlFreelancer: string;
    };
    placeholders: {
      name: string;
      email: string;
      company: string;
      phone: string;
      webUrlCompany: string;
      webUrlFreelancer: string;
    };
    /** Texto opcional bajo el campo URL en contacto. */
    webUrlOptionalHint: string;
    flows: {
      companyAutomation: { title: string; description: string; placeholder: string }[];
      companyNewProduct: { title: string; description: string; placeholder: string }[];
      companyUnsure: { title: string; description: string; placeholder: string }[];
      startup: { title: string; description: string; placeholder: string }[];
      freelancer: { title: string; description: string; placeholder: string }[];
    };
  };
  report: {
    pageTitle: string;
    /** Prefijo antes del nombre (empresa/freelancer); el nombre viene del payload. */
    clientLinePrefix: string;
    loading: string;
    notFound: string;
    errorState: string;
    downloadPdf: string;
    scheduleCta: string;
    scheduleButton: string;
    scheduleCta15m: string;
    /** Label for the clickable CTA button in the downloadable PDF. */
    pdfCtaLinkLabel: string;
    opportunityBadge: string;
    insightsTitle: string;
    impactTitle: string;
    impactTime: string;
    impactOps: string;
    impactBusiness: string;
    /** Subtítulo bajo las tarjetas de impacto para el párrafo cualitativo (`estimated_impact`). */
    impactNarrativeSubtitle: string;
    /** Botón CTA compacto (p. ej. tras el hero). */
    scheduleButtonCompact: string;
    /** Título de la tarjeta sticky en desktop. */
    reportAsideCtaTitle: string;
    /** Accesibilidad: botón flecha “hay más contenido abajo”. */
    reportScrollHintAria: string;
    primaryRecLabel: string;
    primaryRec: {
      automate: string;
      validate_first: string;
      build_mvp: string;
      do_not_invest_yet: string;
    };
    scheduleUrl?: string;
    sections: {
      summary: string;
      problem: string;
      opportunity: string;
      risks: string;
      recommendation: string;
      impact: string;
      nextSteps: string;
    };
  };
  adminDiagnostics: {
    title: string;
    navBack: string;
    empty: string;
    cols: { name: string; company: string; type: string; opportunity: string; date: string };
    viewReport: string;
    detailTitle: string;
  };
};
