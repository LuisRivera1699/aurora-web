import type { SiteMessages } from "@/content/messages/types";

const FIGMA_PORTFOLIO_DEFAULT =
  "https://www.figma.com/proto/rdjsRp3VmNbtR7e8o9Zd3X/Aurora?node-id=3698-404&t=twfA6KgC672rMKON-1&scaling=contain&content-scaling=fixed&page-id=338%3A2&starting-point-node-id=3698%3A404&show-proto-sidebar=1";

export const messagesEs: SiteMessages = {
  siteMeta: {
    name: "AURORA",
    tagline: "AI Driven Software Factory",
    description:
      "Software factory donde la IA acelera el diseño y el desarrollo de sistemas empresariales a medida. Desarrollo, agentes inteligentes y marketing digital, con calidad, criterio y entregas a tiempo.",
    url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://aurora.example.com",
  },
  navLinks: [
    { href: "#nosotros", label: "Nosotros" },
    { href: "#servicios", label: "Servicios" },
    { href: "#productos", label: "Productos" },
    { href: "#stack", label: "Stack" },
    { href: "#portafolio", label: "Portafolio" },
    { href: "#contacto", label: "Contacto" },
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
    ctaPrimary: "Solicitar propuesta",
    navMobileAria: "Secciones (móvil)",
    languageSwitcherAria: "Selector de idioma",
    languageEs: "ES",
    languageEn: "EN",
    menuOpenAria: "Abrir menú de navegación",
    menuCloseAria: "Cerrar menú",
  },
  hero: {
    headline: "Sistemas empresariales impulsados por IA",
    subline:
      "Somos una AI-driven Software Factory: combinamos ingeniería senior e inteligencia artificial para ir de la estrategia al software en producción—con procesos claros, plazos cumplidos y resultados que puedes medir.",
    ctaPrimary: "Solicitar propuesta",
    ctaSecondary: "Ver capacidades",
    photoPrefix: "Foto:",
    backgroundImage: {
      src: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=2400&q=80",
      alt: "Equipo colaborando en un proyecto tecnológico",
      credit: "Unsplash / Annie Spratt",
      creditUrl:
        "https://unsplash.com/photos/photo-of-people-sitting-in-front-of-computer-72NjxYfqNr4",
    },
  },
  about: {
    id: "nosotros",
    title: "Nosotros",
    mission:
      "Somos una AI-driven Software Factory: diseñamos y construimos soluciones empresariales a medida, con la IA integrada en cada fase—desde el discovery hasta el despliegue—y siempre con supervisión humana, trazabilidad y altos estándares de calidad. Priorizamos plazos cumplidos y la confianza en cada entrega. Nuestro objetivo: ser el socio tecnológico que convierte innovación en resultados medibles para tu negocio.",
    vision:
      "Creemos en sistemas que escalan y en poner la innovación al servicio del negocio: ingeniería sólida e IA aplicada con criterio, excelencia operativa y compromiso con los plazos. Trabajamos con cultura de colaboración y mejora continua para impulsar el crecimiento de nuestros clientes, un proyecto a la vez.",
    stats: [
      { prefix: ">", value: "+10", label: "proyectos puestos en producción" },
      { prefix: ">", value: "08", label: "semanas en promedio para lanzar un proyecto" },
    ],
  },
  services: {
    id: "servicios",
    title: "Nuestros servicios",
    items: [
      {
        title: "Turnkey Projects",
        description:
          "Nuestra gama de soluciones integrales está diseñada para simplificar la gestión de proyectos complejos, ofreciendo un servicio llave en mano que abarca todas las etapas, desde la planificación hasta la implementación. Con un enfoque meticuloso en la ejecución eficiente y la entrega de resultados de alta calidad, nuestro equipo altamente experimentado garantiza una experiencia fluida y exitosa para nuestros clientes.",
      },
      {
        title: "UX/UI Research",
        description:
          "Nuestra práctica de UX/UI Research se centra en el análisis profundo del comportamiento y las preferencias del usuario para informar el diseño de interfaces digitales altamente efectivas. Utilizando enfoques metodológicos sólidos, creamos experiencias de usuario diferenciadas que impulsan la satisfacción del cliente y el éxito comercial.",
      },
      {
        title: "Marketing digital",
        description:
          "Orquestamos tu presencia y adquisición con estrategia, mensajes y campañas alineadas a objetivos medibles. Trabajamos posicionamiento, contenidos y activaciones en canales digitales con foco en conversión y retorno, coordinando creatividad y analítica para que cada inversión respalde tu propuesta de valor y tus entregables de producto.",
      },
    ],
  },
  products: {
    id: "productos",
    title: "Nuestros productos",
    items: [
      {
        title: "Webs informativas",
        description:
          "Creamos sitios web atractivos y funcionales que comunican eficazmente la información de tu empresa, producto o servicio. Desde páginas de aterrizaje hasta sitios corporativos completos, nos aseguramos de que tu presencia en línea refleje la esencia de tu marca.",
      },
      {
        title: "Aplicaciones móviles",
        description:
          "Desarrollamos aplicaciones móviles innovadoras y de alta calidad para iOS y Android. Desde aplicaciones nativas hasta soluciones multiplataforma, nos enfocamos en ofrecer una experiencia fluida y atractiva para tus usuarios.",
      },
      {
        title: "Webs ecommerce",
        description:
          "Potenciamos tu negocio en línea con soluciones de comercio electrónico personalizadas. Desde tiendas virtuales básicas hasta plataformas escalables, te ayudamos a alcanzar tus objetivos de ventas en línea.",
      },
      {
        title: "Agentes de inteligencia artificial",
        description:
          "Creamos agentes de inteligencia artificial a medida para automatizar procesos clave y ganar velocidad operativa. Los conectamos a tus sistemas y herramientas (CRM, correo, APIs) con control y trazabilidad, desde el diseño hasta el despliegue en producción con el mismo rigor que el resto de nuestras soluciones.",
      },
      {
        title: "Desarrollo blockchain",
        description:
          "Explora el potencial de la tecnología blockchain con nuestras soluciones de desarrollo a medida. Desde contratos inteligentes hasta aplicaciones descentralizadas (dApps), te ayudamos a integrar la innovación blockchain en tu negocio.",
      },
      {
        title: "Diseño UX/UI",
        description:
          "Diseñamos experiencias de usuario excepcionales que cautivan y deleitan a tus usuarios. Desde interfaces intuitivas hasta experiencias memorables, nuestro enfoque centrado en el usuario garantiza resultados impactantes.",
      },
    ],
  },
  techStack: {
    id: "stack",
    title: "Stack tecnológico",
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
      { id: "openai", label: "GPT / IA" },
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
    id: "portafolio",
    title: "Portafolio",
    description:
      "Proyectos, identidad y entregables en un prototipo navegable: nuestra forma de pensar la software factory aplicada a sistemas empresariales, para explorarla con calma.",
    hint: "El enlace abre Figma en una nueva pestaña.",
    cardLine: "Presentación interactiva con casos y muestras de trabajo.",
    ctaLabel: "Abrir portafolio en Figma",
    url: process.env.NEXT_PUBLIC_PORTFOLIO_URL ?? FIGMA_PORTFOLIO_DEFAULT,
  },
  contact: {
    id: "contacto",
    title: "Hablemos de tu requerimiento",
    description:
      "Cuéntanos qué necesitas: te respondemos con próximos pasos y una propuesta clara—alcance, plazos y valor—con el rigor de entrega que aplicamos en cada proyecto.",
    requirementTypes: [
      { value: "", label: "Tipo de necesidad (opcional)" },
      { value: "turnkey", label: "Proyecto llave en mano" },
      { value: "ux-ui", label: "UX/UI research y diseño" },
      { value: "marketing", label: "Marketing digital" },
      { value: "web", label: "Web o e-commerce" },
      { value: "mobile", label: "App móvil" },
      { value: "ai-agents", label: "Agentes de IA / automatización" },
      { value: "blockchain", label: "Blockchain / Web3" },
      { value: "other", label: "Otro" },
    ],
  },
  contactForm: {
    labels: {
      name: "Nombre",
      email: "Correo",
      company: "Empresa",
      phone: "Teléfono",
      requirementType: "Tipo de necesidad",
      message: "Requerimiento",
      required: "*",
    },
    placeholders: {
      name: "Tu nombre",
      email: "nombre@empresa.com",
      company: "Opcional",
      phone: "Opcional",
      message: "Cuéntanos alcance, plazos y cualquier contexto útil.",
    },
    optional: "Opcional",
    sending: "Enviando…",
    submit: "Enviar solicitud",
    success: "Gracias. Te contactaremos pronto.",
    errorFirebase:
      "Formulario no disponible: configura Firebase en .env (NEXT_PUBLIC_FIREBASE_*).",
    errorPermission:
      "No autorizado. Revisa las reglas de Firestore para esta colección.",
    errorGeneric: "No se pudo enviar. Intenta de nuevo.",
  },
  footer: {
    navAria: "Pie de página",
    homeLinkAria: "{name} — {tagline}, ir al inicio",
    socialAriaInstagram: "Instagram ({handle})",
    socialAriaLinkedIn: "LinkedIn — {brand}",
  },
};
