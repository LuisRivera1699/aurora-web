/** Site copy and structured content — AURORA Software Factory (ES). */

export const siteMeta = {
  name: "AURORA",
  tagline: "Software Factory",
  description:
    "Soluciones tecnológicas y marketing digital confiables y a medida. Desarrollo, estrategia y presencia que impulsan tu negocio con entregas a tiempo.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://aurora.example.com",
};

export const navLinks = [
  { href: "#nosotros", label: "Nosotros" },
  { href: "#servicios", label: "Servicios" },
  { href: "#productos", label: "Productos" },
  { href: "#stack", label: "Stack" },
  { href: "#portafolio", label: "Portafolio" },
  { href: "#contacto", label: "Contacto" },
] as const;

export const hero = {
  headline: "Construimos software que impulsa tu negocio",
  subline:
    "Desde la estrategia y el marketing hasta producción: equipos senior, procesos claros y entregas que cumplen plazo.",
  ctaPrimary: "Solicitar propuesta",
  ctaSecondary: "Ver capacidades",
  /** Unsplash — team collaboration (dark, tech-adjacent) */
  backgroundImage: {
    src: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=2400&q=80",
    alt: "Equipo colaborando en un proyecto tecnológico",
    credit: "Unsplash / Annie Spratt",
    creditUrl: "https://unsplash.com/photos/photo-of-people-sitting-in-front-of-computer-72NjxYfqNr4",
  },
};

export const about = {
  id: "nosotros",
  title: "Nosotros",
  mission:
    "Somos una software factory dedicada a ofrecer soluciones tecnológicas confiables y a medida para empresas de todo el mundo. Nos destacamos por nuestro compromiso inquebrantable con el cumplimiento de plazos, entregando proyectos de alta calidad de manera oportuna. En un mercado en constante cambio y evolución, nos esforzamos por ser el socio tecnológico preferido de nuestros clientes, brindando innovación y confiabilidad en cada solución que entregamos.",
  vision:
    "Nos impulsa una visión clara: ser líderes en el mercado global de servicios tecnológicos, reconocidos por nuestra excelencia en el cumplimiento de plazos y nuestra capacidad para ofrecer soluciones innovadoras que superen las expectativas de nuestros clientes. Con una cultura arraigada en la excelencia, la colaboración y la innovación, nos comprometemos a impulsar el éxito y el crecimiento empresarial en todo el mundo, un proyecto a la vez.",
  stats: [
    {
      prefix: ">",
      value: "+10",
      label: "proyectos puestos en producción",
    },
    {
      prefix: ">",
      value: "08",
      label: "semanas en promedio para lanzar un proyecto",
    },
  ],
};

export const services = {
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
};

export const products = {
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
};

/** `id` keys resolve in `lib/tech-icons.ts` (simple-icons or trademark-safe fallback). */
export const techStack = {
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
  ] as const,
};

const FIGMA_PORTFOLIO_DEFAULT =
  "https://www.figma.com/proto/rdjsRp3VmNbtR7e8o9Zd3X/Aurora?node-id=3698-404&t=twfA6KgC672rMKON-1&scaling=contain&content-scaling=fixed&page-id=338%3A2&starting-point-node-id=3698%3A404&show-proto-sidebar=1";

export const portfolio = {
  id: "portafolio",
  title: "Portafolio",
  description:
    "Proyectos, identidad y entregables en un prototipo navegable: la misma visión que compartimos con clientes, lista para explorarse con calma.",
  hint: "El enlace abre Figma en una nueva pestaña.",
  cardLine: "Presentación interactiva con casos y muestras de trabajo.",
  ctaLabel: "Abrir portafolio en Figma",
  url: process.env.NEXT_PUBLIC_PORTFOLIO_URL ?? FIGMA_PORTFOLIO_DEFAULT,
};

export const contact = {
  id: "contacto",
  title: "Hablemos de tu requerimiento",
  description:
    "Cuéntanos qué necesitas: te responderemos con próximos pasos y una propuesta acorde a tu contexto.",
  requirementTypes: [
    { value: "", label: "Tipo de necesidad (opcional)" },
    { value: "turnkey", label: "Proyecto llave en mano" },
    { value: "ux-ui", label: "UX/UI research y diseño" },
    { value: "marketing", label: "Marketing digital" },
    { value: "web", label: "Web o e-commerce" },
    { value: "mobile", label: "App móvil" },
    { value: "blockchain", label: "Blockchain / Web3" },
    { value: "other", label: "Otro" },
  ] as const,
};
