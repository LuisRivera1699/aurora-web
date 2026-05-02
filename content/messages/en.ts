import type { SiteMessages } from "@/content/messages/types";

const FIGMA_PORTFOLIO_DEFAULT =
  "https://www.figma.com/proto/rdjsRp3VmNbtR7e8o9Zd3X/Aurora?node-id=3837-2034&t=jbrdw7O7L9VTdyPh-1&scaling=contain&content-scaling=fixed&page-id=338%3A2&starting-point-node-id=3837%3A2034&show-proto-sidebar=1";

export const messagesEn: SiteMessages = {
  locale: "en",
  siteMeta: {
    name: "AURORA",
    tagline: "AI Driven Software Factory",
    description:
      "An AI-driven software factory: we accelerate the design and delivery of enterprise-grade systems. Engineering, intelligent agents, and digital marketing—with quality, judgment, and on-time releases.",
    url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://aurora.example.com",
  },
  navLinks: [
    { href: "#about", label: "About" },
    { href: "#services", label: "Services" },
    { href: "#products", label: "Products" },
    { href: "#portfolio", label: "Portfolio" },
    { href: "/en/blog", label: "Blog" },
    { href: "/en/diagnostic", label: "AI diagnostic" },
    { href: "#contact", label: "Contact" },
  ],
  socialLinks: [
    {
      label: "Instagram",
      href: "https://www.instagram.com/teamaurora.pe/",
      handle: "@teamaurora.pe",
    },
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/company/aurora-software-factory",
    },
  ],
  siteHeader: {
    ctaPrimary: "Request a proposal",
    navMobileAria: "Sections (mobile)",
    languageSwitcherAria: "Language",
    languageEs: "ES",
    languageEn: "EN",
    menuOpenAria: "Open navigation menu",
    menuCloseAria: "Close menu",
  },
  hero: {
    headline: "Enterprise systems powered by AI",
    subline:
      "We are an AI-driven software factory: senior engineering and AI take you from strategy to production software—clear processes, reliable deadlines, and measurable outcomes.",
    ctaPrimary: "Request a proposal",
    ctaSecondary: "See capabilities",
    photoPrefix: "Photo:",
    backgroundImage: {
      src: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=2400&q=80",
      alt: "Team collaborating on a technology project",
      credit: "Unsplash / Annie Spratt",
      creditUrl:
        "https://unsplash.com/photos/photo-of-people-sitting-in-front-of-computer-72NjxYfqNr4",
    },
  },
  about: {
    id: "about",
    title: "About us",
    mission:
      "We are an AI-driven software factory: we design and build enterprise solutions with AI embedded in every phase—from discovery to deployment—with human oversight, traceability, and high quality standards. We prioritize shipped deadlines and trust in every delivery. Our goal: to be the technology partner that turns innovation into measurable business outcomes.",
    vision:
      "We believe in systems that scale and in putting innovation at the service of the business: solid engineering and AI applied with judgment, operational excellence, and commitment to deadlines. We work with a culture of collaboration and continuous improvement to grow our clients’ businesses—one project at a time.",
    stats: [
      { prefix: ">", value: "+10", label: "projects shipped to production" },
      {
        prefix: ">",
        value: "08",
        label: "weeks on average to launch a project",
      },
    ],
  },
  services: {
    id: "services",
    title: "Our services",
    items: [
      {
        title: "Turnkey projects",
        description:
          "Our end-to-end solutions simplify complex project management with a full turnkey service from planning through implementation. With a sharp focus on execution and high-quality delivery, our experienced team ensures a smooth, successful experience for our clients.",
      },
      {
        title: "UX/UI research",
        description:
          "Our UX/UI research practice deep-dives into user behavior and preferences to inform highly effective digital interfaces. With rigorous methods, we craft differentiated experiences that drive satisfaction and business outcomes.",
      },
      {
        title: "Digital marketing",
        description:
          "We orchestrate your presence and acquisition with strategy, messaging, and campaigns tied to measurable goals. We work positioning, content, and digital activations focused on conversion and ROI—creative and analytics aligned with your product story.",
      },
    ],
  },
  products: {
    id: "products",
    title: "Our products",
    items: [
      {
        title: "Marketing websites",
        description:
          "We build attractive, functional sites that communicate your company, product, or service clearly—from landing pages to full corporate sites—so your online presence reflects your brand.",
      },
      {
        title: "Mobile applications",
        description:
          "We develop high-quality mobile apps for iOS and Android—from native to cross-platform—with a smooth, engaging experience for your users.",
      },
      {
        title: "E-commerce websites",
        description:
          "We grow your online business with tailored e-commerce—from simple storefronts to scalable platforms—so you can hit your sales goals online.",
      },
      {
        title: "AI agents",
        description:
          "We build custom AI agents to automate critical processes and speed up operations. We connect them to your systems and tools (CRM, email, APIs) with control and traceability—from design through production, with the same rigor as our other solutions.",
      },
      {
        title: "Blockchain development",
        description:
          "Explore blockchain with our custom development—from smart contracts to decentralized apps (dApps)—helping you bring blockchain innovation into your business.",
      },
      {
        title: "UX/UI design",
        description:
          "We design experiences that engage and delight—from intuitive interfaces to memorable flows—with a user-centered approach that delivers impact.",
      },
    ],
  },
  portfolio: {
    id: "portfolio",
    title: "Portfolio",
    description:
      "Projects, identity, and deliverables in a browsable prototype: how we think as a software factory—applied to enterprise systems—ready to explore at your own pace.",
    hint: "Opens Figma in a new tab.",
    cardLine: "Interactive presentation with case studies and work samples.",
    ctaLabel: "Open portfolio in Figma",
    url: process.env.NEXT_PUBLIC_PORTFOLIO_URL ?? FIGMA_PORTFOLIO_DEFAULT,
  },
  contact: {
    id: "contact",
    title: "Tell us what you need",
    description:
      "Share your context: we’ll reply with next steps and a clear proposal—scope, timeline, and value—with the same delivery rigor we apply on every project.",
    requirementTypes: [
      { value: "", label: "Need type (optional)" },
      { value: "turnkey", label: "Turnkey project" },
      { value: "ux-ui", label: "UX/UI research & design" },
      { value: "marketing", label: "Digital marketing" },
      { value: "web", label: "Web or e-commerce" },
      { value: "mobile", label: "Mobile app" },
      { value: "ai-agents", label: "AI agents / automation" },
      { value: "blockchain", label: "Blockchain / Web3" },
      { value: "other", label: "Other" },
    ],
  },
  contactForm: {
    labels: {
      name: "Name",
      email: "Email",
      company: "Company",
      phone: "Phone",
      requirementType: "Need type",
      message: "Requirements",
      required: "*",
    },
    placeholders: {
      name: "Your name",
      email: "name@company.com",
      company: "Optional",
      phone: "Optional",
      message: "Share scope, timeline, and any useful context.",
    },
    optional: "Optional",
    sending: "Sending…",
    submit: "Send request",
    success: "Thank you. We’ll be in touch soon.",
    errorFirebase:
      "Form unavailable: configure Firebase in .env (NEXT_PUBLIC_FIREBASE_*).",
    errorPermission:
      "Not authorized. Check Firestore rules for this collection.",
    errorGeneric: "Could not send. Please try again.",
  },
  footer: {
    navAria: "Footer",
    homeLinkAria: "{name} — {tagline}, go to home",
    socialAriaInstagram: "Instagram ({handle})",
    socialAriaLinkedIn: "LinkedIn — {brand}",
  },
  notFound: {
    title: "This route does not exist",
    description:
      "The page you are looking for is unavailable or has moved. Let’s get you back to the core paths for exploring AI, engineering, and business-ready software.",
    homeCta: "Back to home",
    contactCta: "Contact",
    panelEyebrow: "Reroute",
    panelTitle: "Let’s keep the momentum.",
    panelDescription:
      "Start a quick diagnostic or read recent notes while we find the right path for your project.",
    diagnosticLink: "Start AI diagnostic",
    blogLink: "Read the blog",
  },
  blog: {
    navLabel: "Blog",
    sectionTitle: "Aurora Blog",
    sectionSubtitle: "Notes on engineering, AI, and enterprise systems.",
    viewAll: "View all articles",
    pageTitle: "Aurora Blog",
    pageDescription:
      "Articles on software development, applied AI, and engineering practices from Aurora.",
    readingTime: "Read time",
    readingTimeMinutes: "{minutes} min",
    authorByline: "Editorial: Aurora AI",
    publishedLabel: "Published",
    imageCreditPrefix: "Photo:",
    auroraTakeHeading: "The Aurora take",
    referencesHeading: "References",
    emptyList: "No articles published yet.",
    readArticle: "Read article",
  },
  diagnosticPromo: {
    title: "Get a free AI diagnosis",
    description:
      "Answer a few quick questions and receive an orientative brief with opportunities and next steps.",
    cta: "Start diagnosis",
  },
  diagnosticThanks: {
    pageTitle: "Thanks for booking",
    headline: "Thank you for scheduling with us.",
    bodyMeeting:
      "We’ll see you at the meeting. If you haven’t already, you can add it to your calendar from your confirmation email.",
    bodyEmail:
      "Remember: we sent your diagnostic report to the email address you shared with us.",
    meetingIntro: "Your session:",
    homeCta: "Back to home",
  },
  diagnostic: {
    navLabel: "AI diagnostic",
    pageTitle: "AI-powered diagnostic",
    pageSubtitle:
      "Tell us about your context in a few minutes. We analyze what you share with assisted intelligence and professional judgment, and you get an orientative diagnostic—clear, structured, and with concrete next steps.",
    progress: "Step {current} of {total}",
    back: "Back",
    next: "Next",
    submit: "Generate report",
    submitting: "Generating your report…",
    errorGeneric: "We couldn’t complete the diagnostic. Please try again.",
    errorNotConfigured: "This service isn’t configured yet. Check back soon.",
    stepProfileTitle: "What best describes your situation?",
    stepProfileSubtitle: "Pick the closest option.",
    optionCompany: "I run an operating company",
    optionStartup: "I have a startup idea",
    optionFreelancer: "I’m independent / freelancer",
    stepCompanyGoalTitle: "What are you trying to do?",
    optionAutomation: "Automate or improve processes",
    optionNewProduct: "Build a new digital product",
    optionUnsure: "I’m not sure yet",
    optionUrgent: "Very urgent (weeks)",
    optionSoon: "Soon (1–3 months)",
    optionExploring: "Exploring options",
    flowStepDetailHint:
      "A short answer is fine—the more context you share, the better we can tailor the automated diagnostic to your project.",
    stepContactTitle: "Where should we send the report?",
    labels: {
      name: "Name",
      email: "Email",
      company: "Company",
      phone: "Phone",
      webUrlCompany: "Website or main page",
      webUrlFreelancer: "Website or professional profile",
    },
    placeholders: {
      name: "Your name",
      email: "you@email.com",
      company: "Optional",
      phone: "Optional",
      webUrlCompany: "https://yourcompany.com",
      webUrlFreelancer: "Website, LinkedIn, Instagram…",
    },
    webUrlOptionalHint:
      "Optional. Helps us prepare before a call; it is not used in the automated diagnostic.",
    flows: {
      companyAutomation: [
        {
          title: "Which area or process do you want to improve?",
          description:
            "The department or flow name is enough (sales, billing, support…). It doesn’t need to be exhaustive.",
          placeholder: "e.g. WhatsApp support, invoicing, customer onboarding…",
        },
        {
          title: "How do you do it today?",
          description:
            "Describe the real process, even if messy: steps, tools, and who does what.",
          placeholder: "e.g. shared Excel, paper, multiple tools without integration…",
        },
        {
          title: "What is the main problem?",
          description:
            "You don’t need a technical fix yet: what breaks, slows down, or costs the most.",
          placeholder: "Describe the bottleneck or recurring failure.",
        },
        {
          title: "How many people are involved?",
          description:
            "A rough number is fine. If it helps, add roles (sales, finance, IT…).",
          placeholder: "Approximate headcount or teams.",
        },
        {
          title: "How much time does it take (per week or per case)?",
          description:
            "A ballpark is enough: hours per week or minutes per ticket/case.",
          placeholder: "e.g. 10h/week, 30 min per ticket…",
        },
        {
          title: "Urgency level",
          description:
            "Helps us prioritize the diagnostic given real deadlines and pressure.",
          placeholder: "Choose an option below.",
        },
        {
          title: "What have you already tried?",
          description:
            "Include what didn’t work or stalled — that context still matters.",
          placeholder: "Tools, vendors, internal attempts…",
        },
      ],
      companyNewProduct: [
        {
          title: "What kind of digital product do you have in mind?",
          description:
            "No perfect label needed: what it is, for whom, and how they’d use it.",
          placeholder: "e.g. B2B app, marketplace, internal SaaS…",
        },
        {
          title: "What concrete problem would it solve?",
          description:
            "Think about the end user: what happens today if this didn’t exist.",
          placeholder: "For whom and in what moment of their workflow.",
        },
        {
          title: "Who is the target audience?",
          description:
            "One segment or several; size and role already tell us a lot.",
          placeholder: "Segment, size, geography, user role.",
        },
        {
          title: "What validation exists today?",
          description:
            "Real signals, even small: interviews, sales, waitlist, or “nothing yet”.",
          placeholder: "Interviews, pilots, waitlist, sales, none yet…",
        },
        {
          title: "How do you see competition or substitutes?",
          description:
            "Include how people solve it without you (apps, spreadsheets, agencies…).",
          placeholder: "What customers use today instead of you.",
        },
        {
          title: "What stage is the project at?",
          description:
            "There’s no wrong answer — we just want to align expectations and next steps.",
          placeholder: "Idea, design, MVP, beta, production…",
        },
        {
          title: "What do you need right now?",
          description:
            "One clear priority (discovery, design, build…) helps us be concrete.",
          placeholder: "Discovery, design, build, launch, scale…",
        },
      ],
      companyUnsure: [
        {
          title: "Summarize the problem or opportunity in your words",
          description:
            "Free text when you’re not sure yet if it’s “automation” or a “new product”.",
          placeholder: "Context and main pain — it doesn’t need to be perfect.",
        },
        {
          title: "Additional context",
          description:
            "Industry, team size, regulation, or time/budget limits, if relevant.",
          placeholder: "Industry, team size, constraints (time, budget, compliance)…",
        },
        {
          title: "How urgent does it feel?",
          description:
            "Your subjective sense of pressure or dates that matter is enough.",
          placeholder: "Internal deadlines or events driving timing.",
        },
        {
          title: "What tools or support do you have today?",
          description:
            "Software, vendor, or internal team; “poorly integrated” counts too.",
          placeholder: "Software, vendor, internal team…",
        },
        {
          title: "What outcome would you like in 3–6 months?",
          description:
            "Can be tangible (saved time) or strategic (clarity, alignment).",
          placeholder: "Even directional is fine.",
        },
      ],
      startup: [
        {
          title: "Your idea in one line",
          description:
            "One pitch-style sentence: what you offer, for whom, and what changes for them.",
          placeholder: "What you offer and for whom.",
        },
        {
          title: "What validation do you have so far?",
          description:
            "Metrics, pilots, LOIs, or “just conversations so far” — all useful.",
          placeholder: "Metrics, pilots, LOIs, pre-sales…",
        },
        {
          title: "Users or customers today?",
          description:
            "Rough numbers and main channel. If there’s no traction yet, say so.",
          placeholder: "Approximate numbers and main channel.",
        },
        {
          title: "What problem do you solve for them?",
          description:
            "Concrete pain and what they do today without you (including “nothing”).",
          placeholder: "Concrete pain and current alternative.",
        },
        {
          title: "Competition or substitutes",
          description:
            "How the need is covered today: other startups, generic tools, or manual work.",
          placeholder: "How they solve it without you today.",
        },
        {
          title: "Project stage",
          description:
            "To orient the diagnostic: idea, MVP, traction, scale — whatever fits best.",
          placeholder: "Idea, MVP, traction, growth…",
        },
        {
          title: "What do you need now?",
          description:
            "One priority for the next few weeks (validate, build, sell, pivot…).",
          placeholder: "Single priority for the next few weeks.",
        },
      ],
      freelancer: [
        {
          title: "What do you do?",
          description:
            "Your main service and typical clients; one example is enough.",
          placeholder: "Main service and typical clients.",
        },
        {
          title: "What task is most repetitive?",
          description:
            "What eats the most time in practice, even if it’s not the “glamorous” work.",
          placeholder: "What eats the most time each week.",
        },
        {
          title: "What tools do you use today?",
          description:
            "Include what works and what slows you down or creates duplicate work.",
          placeholder: "Include the ones that frustrate you.",
        },
        {
          title: "What would you like to automate or delegate with tech?",
          description:
            "You don’t need to know how — just what you’d like off your plate manually.",
          placeholder: "Even if you don’t know how yet.",
        },
        {
          title: "How much time do you spend on that?",
          description:
            "Hours per week or % of billable time; an estimate is fine.",
          placeholder: "Hours/week or % of billable time.",
        },
        {
          title: "What is your main goal?",
          description:
            "What you want to improve in the next few months (revenue, time, stress…).",
          placeholder: "More clients, margin, time, delivery quality…",
        },
      ],
    },
  },
  report: {
    pageTitle: "Your report",
    clientLinePrefix: "Client:",
    loading: "Loading report…",
    notFound: "We couldn’t find this report.",
    errorState: "The report couldn’t be generated. Contact us if you need help.",
    downloadPdf: "Download PDF",
    scheduleCta: "Want us to review this with you?",
    scheduleButton: "Schedule a call",
    scheduleCta15m:
      "We’ll walk you through exactly how to put this into practice on a 15-minute call.",
    pdfCtaLinkLabel: "Open link",
    opportunityBadge: "Opportunity level",
    insightsTitle: "Key insights",
    impactTitle: "Estimated impact",
    impactTime: "Time savings",
    impactOps: "Operational improvement",
    impactBusiness: "Business potential",
    impactNarrativeSubtitle: "In more detail",
    scheduleButtonCompact: "Book 15 min",
    reportAsideCtaTitle: "Next step",
    reportScrollHintAria: "Scroll to read the full report",
    primaryRecLabel: "Recommended focus",
    primaryRec: {
      automate: "Automate processes",
      validate_first: "Validate before investing",
      build_mvp: "Build an MVP",
      do_not_invest_yet: "Don’t invest yet — clarify first",
    },
    sections: {
      summary: "Summary",
      problem: "Context analysis",
      opportunity: "Opportunity",
      risks: "Risks to consider",
      recommendation: "Recommendation",
      impact: "Estimated impact",
      nextSteps: "Next steps",
    },
  },
  adminDiagnostics: {
    title: "AI diagnostics",
    navBack: "← Back to dashboard",
    empty: "No diagnostics yet.",
    cols: {
      name: "Name",
      company: "Company",
      type: "Type",
      opportunity: "Opportunity",
      date: "Date",
    },
    viewReport: "View report",
    detailTitle: "Diagnostic detail",
  },
};
