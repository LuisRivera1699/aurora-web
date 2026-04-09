const TILES = {
  1: "/brand_assets/PATTERN_1_INDIVIDUAL.svg",
  2: "/brand_assets/PATTERN_2_INDIVIDUAL.svg",
} as const;

/**
 * Separador con patrón en mosaico horizontal: altura fija, los motivos se repiten
 * en X sin estirar el SVG completo (evita que crezca la altura en pantallas anchas).
 */
export function PatternStrip({ variant = 1 }: { variant?: 1 | 2 }) {
  const src = TILES[variant];

  return (
    <div
      className="h-12 w-full opacity-[0.35] md:h-14"
      style={{
        backgroundImage: `url(${src})`,
        backgroundRepeat: "repeat-x",
        backgroundPosition: "center",
        backgroundSize: "auto 100%",
      }}
      aria-hidden
    />
  );
}
