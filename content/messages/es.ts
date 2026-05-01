import type { SiteMessages } from "@/content/messages/types";

const FIGMA_PORTFOLIO_DEFAULT =
  "https://www.figma.com/proto/rdjsRp3VmNbtR7e8o9Zd3X/Aurora?node-id=3698-404&t=twfA6KgC672rMKON-1&scaling=contain&content-scaling=fixed&page-id=338%3A2&starting-point-node-id=3698%3A404&show-proto-sidebar=1";

export const messagesEs: SiteMessages = {
  locale: "es",
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
    { href: "/es/blog", label: "Blog" },
    { href: "/es/diagnostic", label: "Diagnóstico IA" },
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
  notFound: {
    title: "Esta ruta no existe",
    description:
      "La página que buscas no está disponible o cambió de dirección. Te llevamos de vuelta a los puntos clave para seguir explorando soluciones con IA, ingeniería y criterio.",
    homeCta: "Volver al inicio",
    contactCta: "Contacto",
    panelEyebrow: "Recalcular ruta",
    panelTitle: "No perdamos el impulso.",
    panelDescription:
      "Puedes iniciar un diagnóstico rápido o leer ideas recientes mientras encontramos el mejor camino para tu proyecto.",
    diagnosticLink: "Iniciar diagnóstico IA",
    blogLink: "Leer el blog",
  },
  blog: {
    navLabel: "Blog",
    sectionTitle: "Aurora Blog",
    sectionSubtitle: "Ideas sobre ingeniería, IA y sistemas empresariales.",
    viewAll: "Ver más artículos",
    pageTitle: "Aurora Blog",
    pageDescription:
      "Artículos sobre desarrollo de software, IA aplicada y buenas prácticas de Aurora.",
    readingTime: "Lectura",
    readingTimeMinutes: "{minutes} min",
    authorByline: "Redacción: Aurora AI",
    publishedLabel: "Publicado",
    imageCreditPrefix: "Foto:",
    auroraTakeHeading: "La mirada Aurora",
    referencesHeading: "Referencias",
    emptyList: "Aún no hay artículos publicados.",
    readArticle: "Leer artículo",
  },
  diagnosticPromo: {
    title: "Diagnostica tu proyecto con IA",
    description:
      "Responde unas preguntas breves y recibe un informe orientativo con oportunidades y próximos pasos.",
    cta: "Iniciar diagnóstico",
  },
  diagnosticThanks: {
    pageTitle: "Gracias por agendar",
    headline: "Gracias por agendar con nosotros.",
    bodyMeeting:
      "Nos vemos en la reunión. Si aún no lo hiciste, puedes añadirla al calendario desde el correo de confirmación.",
    bodyEmail:
      "Recuerda: tu informe de diagnóstico te lo enviamos al correo que indicaste.",
    meetingIntro: "Tu sesión:",
    homeCta: "Volver al inicio",
  },
  diagnostic: {
    navLabel: "Diagnóstico IA",
    pageTitle: "Diagnóstico inteligente",
    pageSubtitle:
      "Cuéntanos tu contexto en unos minutos. Analizamos lo que compartes con inteligencia asistida y criterio profesional, y te devolvemos un diagnóstico orientativo: claro, estructurado y con próximos pasos.",
    progress: "Paso {current} de {total}",
    back: "Atrás",
    next: "Siguiente",
    submit: "Generar informe",
    submitting: "Generando tu informe…",
    errorGeneric: "No se pudo completar el diagnóstico. Inténtalo de nuevo.",
    errorNotConfigured: "El servicio no está configurado todavía. Vuelve pronto.",
    stepProfileTitle: "¿Qué describe mejor tu situación?",
    stepProfileSubtitle: "Elige la opción que más se acerque.",
    optionCompany: "Tengo una empresa operando",
    optionStartup: "Tengo una idea de startup",
    optionFreelancer: "Soy independiente / freelancer",
    stepCompanyGoalTitle: "¿Qué estás buscando hacer?",
    optionAutomation: "Automatizar o mejorar procesos",
    optionNewProduct: "Crear un nuevo producto digital",
    optionUnsure: "No estoy seguro",
    optionUrgent: "Muy urgente (semanas)",
    optionSoon: "Pronto (1–3 meses)",
    optionExploring: "Explorando opciones",
    flowStepDetailHint:
      "No hace falta un texto largo; aun así, cuanto más contexto nos des, mejor podremos afinar el diagnóstico automático de tu proyecto.",
    stepContactTitle: "¿Dónde te enviamos el informe?",
    labels: {
      name: "Nombre",
      email: "Email",
      company: "Empresa",
      phone: "Teléfono",
      webUrlCompany: "Sitio web o página principal",
      webUrlFreelancer: "Web o perfil profesional",
    },
    placeholders: {
      name: "Tu nombre",
      email: "tu@email.com",
      company: "Opcional",
      phone: "Opcional",
      webUrlCompany: "https://tuempresa.com",
      webUrlFreelancer: "Web, LinkedIn, Instagram…",
    },
    webUrlOptionalHint: "Opcional. Nos ayuda a conocerte antes de la reunión; no se usa en el diagnóstico automático.",
    flows: {
      companyAutomation: [
        {
          title: "¿Qué área o proceso quieres mejorar?",
          description:
            "Basta con el departamento o el nombre del flujo (ventas, facturación, soporte…). No hace falta ser exhaustivo.",
          placeholder: "Ej.: atención al cliente por WhatsApp, facturación, onboarding de clientes…",
        },
        {
          title: "¿Cómo lo hacéis hoy?",
          description:
            "Describe el proceso real, aunque sea imperfecto: pasos, herramientas y quién hace qué.",
          placeholder: "Ej.: Excel compartido, manual en papel, varias herramientas sin integrar…",
        },
        {
          title: "¿Cuál es el problema principal?",
          description:
            "No hace falta la solución técnica: qué falla, qué retrasa o qué os cuesta más caro.",
          placeholder: "Describe el cuello de botella o el error que más os cuesta.",
        },
        {
          title: "¿Cuántas personas intervienen en este proceso?",
          description:
            "Un número aproximado vale. Si ayuda, indica roles (comercial, administración, IT…).",
          placeholder: "Número aproximado o equipos involucrados.",
        },
        {
          title: "¿Cuánto tiempo se invierte (por semana o por caso)?",
          description:
            "Una estimación orientativa basta: horas por semana o minutos por ticket/caso.",
          placeholder: "Ej.: 10 h/semana del equipo, 30 min por ticket…",
        },
        {
          title: "Nivel de urgencia",
          description:
            "Nos ayuda a priorizar el diagnóstico según plazos y presión real del equipo.",
          placeholder: "Elige una opción abajo.",
        },
        {
          title: "¿Qué habéis intentado ya para resolverlo?",
          description:
            "Incluye lo que no funcionó o quedó a medias: igual aporta mucho contexto.",
          placeholder: "Herramientas, proveedores, proyectos internos abortados…",
        },
      ],
      companyNewProduct: [
        {
          title: "¿Qué tipo de producto digital tienes en mente?",
          description:
            "No necesitas una etiqueta perfecta: basta con qué es, para quién y en qué canal.",
          placeholder: "Ej.: app B2B, marketplace, SaaS interno, portal de clientes…",
        },
        {
          title: "¿Qué problema concreto resolvería?",
          description:
            "Piensa en el usuario final: qué les pasa hoy si esa solución no existiera.",
          placeholder: "Para quién y en qué momento del día o del negocio.",
        },
        {
          title: "¿Quién es el público objetivo?",
          description:
            "Puede ser un segmento inicial o varios; tamaño y rol ya dan mucha pista.",
          placeholder: "Segmento, tamaño, geografía, rol del usuario.",
        },
        {
          title: "¿Qué validación existe hoy?",
          description:
            "Datos reales, aunque sean modestos: entrevistas, ventas, lista de espera o “aún nada”.",
          placeholder: "Entrevistas, pilots, lista de espera, ventas, nada aún…",
        },
        {
          title: "¿Cómo ves la competencia o alternativas?",
          description:
            "Incluye cómo lo resuelven hoy sin vosotros (otras apps, Excel, terceros…).",
          placeholder: "Herramientas que usan hoy tus clientes o competidores directos.",
        },
        {
          title: "¿En qué etapa está el proyecto?",
          description:
            "No hay respuesta incorrecta: solo queremos alinear expectativas y siguiente paso.",
          placeholder: "Idea, diseño, MVP, beta, producción…",
        },
        {
          title: "¿Qué necesitáis ahora mismo?",
          description:
            "Una prioridad clara (descubrimiento, diseño, desarrollo…) nos ayuda a ser concretos.",
          placeholder: "Prioridad: descubrimiento, diseño, desarrollo, lanzamiento, escala…",
        },
      ],
      companyUnsure: [
        {
          title: "Resume el problema o la oportunidad en tus palabras",
          description:
            "Texto libre: sirve cuando aún no encajas en “automatizar” o “producto nuevo”.",
          placeholder: "No tiene que ser perfecto: contexto y dolor principal.",
        },
        {
          title: "Contexto adicional",
          description:
            "Sector, tamaño del equipo, normativa o límites de tiempo/presupuesto, si aplican.",
          placeholder: "Sector, tamaño del equipo, restricciones (tiempo, presupuesto, compliance)…",
        },
        {
          title: "¿Qué tan urgente lo ves?",
          description:
            "Vale una respuesta subjetiva: tu sensación de presión o fechas que te obsesionan.",
          placeholder: "Plazos internos o eventos que marcan el ritmo.",
        },
        {
          title: "¿Qué herramientas o apoyo tenéis hoy?",
          description:
            "Software, proveedor externo o equipo interno; “poco integrado” también cuenta.",
          placeholder: "Software, proveedor externo, equipo interno…",
        },
        {
          title: "¿Qué resultado os gustaría en 3–6 meses?",
          description:
            "Puede ser tangible (ahorro, velocidad) o más estratégico (orden, claridad).",
          placeholder: "Aunque sea orientativo.",
        },
      ],
      startup: [
        {
          title: "Tu idea en una línea",
          description:
            "Una frase tipo pitch: qué ofreces, para quién y qué cambia para ellos.",
          placeholder: "Qué ofreces y para quién.",
        },
        {
          title: "¿Qué validación tienes hasta ahora?",
          description:
            "Métricas, pilots, cartas de intención o “solo conversaciones”: todo suma.",
          placeholder: "Métricas, pilots, cartas de intención, pre-ventas…",
        },
        {
          title: "¿Usuarios o clientes actuales?",
          description:
            "Números aproximados y canal principal. Si aún no hay tracción, dilo sin problema.",
          placeholder: "Números aproximados y canal principal.",
        },
        {
          title: "¿Qué problema resuelves para ellos?",
          description:
            "El dolor concreto y qué hacen hoy si no te usan (incluido “no hacen nada”).",
          placeholder: "Dolor concreto y alternativa actual.",
        },
        {
          title: "Competencia o sustitutos",
          description:
            "Cómo cubren esa necesidad hoy: otras startups, herramientas genéricas o trabajo manual.",
          placeholder: "Cómo resuelven hoy ese problema sin ti.",
        },
        {
          title: "Etapa del proyecto",
          description:
            "Para orientar el diagnóstico: idea, MVP, tracción, escala… lo que mejor te encaje.",
          placeholder: "Idea, MVP, tracción, crecimiento…",
        },
        {
          title: "¿Qué necesitas ahora?",
          description:
            "Una sola prioridad para las próximas semanas (validar, construir, vender, pivotar…).",
          placeholder: "Prioridad única para las próximas semanas.",
        },
      ],
      freelancer: [
        {
          title: "¿A qué te dedicas?",
          description:
            "Tu servicio principal y tipo de clientes; con un ejemplo ya vamos bien.",
          placeholder: "Servicio principal y tipo de clientes.",
        },
        {
          title: "¿Qué tarea es la más repetitiva?",
          description:
            "La que más tiempo te quita aunque no sea la más “importante” en el papel.",
          placeholder: "La que más tiempo te quita cada semana.",
        },
        {
          title: "¿Qué herramientas usas hoy?",
          description:
            "Incluye las que te funcionan y las que te frenan o te generan trabajo duplicado.",
          placeholder: "Incluye las que te frustan.",
        },
        {
          title: "¿Qué te gustaría automatizar o delegar con tecnología?",
          description:
            "No hace falta saber cómo: solo qué te gustaría que dejara de depender de ti a mano.",
          placeholder: "Aunque no sepas cómo hacerlo aún.",
        },
        {
          title: "¿Cuánto tiempo inviertes en eso?",
          description:
            "Horas por semana o % del tiempo facturable; una estimación vale.",
          placeholder: "Horas/semana o % de tu tiempo facturable.",
        },
        {
          title: "¿Cuál es tu objetivo principal?",
          description:
            "Qué te importa mejorar en los próximos meses (ingresos, tiempo, calidad, estrés…).",
          placeholder: "Más clientes, margen, tiempo libre, calidad de entrega…",
        },
      ],
    },
  },
  report: {
    pageTitle: "Tu informe",
    clientLinePrefix: "Cliente:",
    loading: "Cargando informe…",
    notFound: "No encontramos este informe.",
    errorState: "No se pudo generar el informe. Contacta con nosotros si necesitas ayuda.",
    downloadPdf: "Descargar PDF",
    scheduleCta: "¿Quieres que revisemos esto contigo?",
    scheduleButton: "Agendar reunión",
    scheduleCta15m:
      "Te explicamos exactamente cómo llevar esto a la práctica en una llamada de 15 minutos.",
    pdfCtaLinkLabel: "Abrir enlace",
    opportunityBadge: "Nivel de oportunidad",
    insightsTitle: "Ideas clave",
    impactTitle: "Impacto estimado",
    impactTime: "Ahorro de tiempo",
    impactOps: "Mejora operativa",
    impactBusiness: "Potencial de negocio",
    impactNarrativeSubtitle: "En profundidad",
    scheduleButtonCompact: "Agendar 15 min",
    reportAsideCtaTitle: "Siguiente paso",
    reportScrollHintAria: "Desplazar para ver el informe completo",
    primaryRecLabel: "Enfoque recomendado",
    primaryRec: {
      automate: "Automatizar procesos",
      validate_first: "Validar antes de invertir",
      build_mvp: "Construir un MVP",
      do_not_invest_yet: "No invertir aún; clarificar primero",
    },
    sections: {
      summary: "Resumen",
      problem: "Análisis del contexto",
      opportunity: "Oportunidad",
      risks: "Riesgos a considerar",
      recommendation: "Recomendación",
      impact: "Impacto estimado",
      nextSteps: "Próximos pasos",
    },
  },
  adminDiagnostics: {
    title: "Diagnósticos IA",
    navBack: "← Volver al panel",
    empty: "No hay diagnósticos todavía.",
    cols: {
      name: "Nombre",
      company: "Empresa",
      type: "Tipo",
      opportunity: "Oportunidad",
      date: "Fecha",
    },
    viewReport: "Ver informe",
    detailTitle: "Detalle del diagnóstico",
  },
};
