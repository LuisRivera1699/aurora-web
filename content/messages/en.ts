import type { SiteMessages } from "@/content/messages/types";

const FIGMA_PORTFOLIO_DEFAULT =
  "https://www.figma.com/proto/rdjsRp3VmNbtR7e8o9Zd3X/Aurora?node-id=3698-404&t=twfA6KgC672rMKON-1&scaling=contain&content-scaling=fixed&page-id=338%3A2&starting-point-node-id=3698%3A404&show-proto-sidebar=1";

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
    { href: "#stack", label: "Stack" },
    { href: "#portfolio", label: "Portfolio" },
    { href: "/en/blog", label: "Blog" },
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
      { prefix: ">", value: "08", label: "weeks on average to launch a project" },
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
  techStack: {
    id: "stack",
    title: "Tech stack",
    items: [
      { id: "figma", label: "Figma" },
      { id: "react", label: "React" },
      { id: "nextdotjs", label: "Next.js" },
      { id: "angular", label: "AngularJS" },
      { id: "html5", label: "HTML5" },
      { id: "css", label: "CSS3" },
      { id: "javascript", label: "JavaScript" },
      { id: "flutter", label: "Flutter" },
      { id: "swift", label: "Swift" },
      { id: "kotlin", label: "Kotlin" },
      { id: "nodedotjs", label: "Node.js" },
      { id: "dotnet", label: "C#" },
      { id: "python", label: "Python" },
      { id: "openai", label: "GPT / AI" },
      { id: "mongodb", label: "MongoDB" },
      { id: "aws", label: "AWS" },
      { id: "azure", label: "Azure" },
      { id: "firebase", label: "Firebase" },
      { id: "digitalocean", label: "DigitalOcean" },
      { id: "solidity", label: "Solidity" },
      { id: "ethereum", label: "Ethereum" },
      { id: "polygon", label: "Polygon" },
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
};
