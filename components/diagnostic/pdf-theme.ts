import { rgb, type PDFFont } from "pdf-lib";

/** RGB aligned with `app/globals.css` brand tokens; body on white for print. */
export const PDF_THEME = {
  auroraPurple: rgb(133 / 255, 67 / 255, 154 / 255),
  auroraBlue: rgb(0 / 255, 110 / 255, 160 / 255),
  /** PDF header band (logo + date only). */
  headerBlack: rgb(0, 0, 0),
  text: rgb(0.12, 0.12, 0.15),
  muted: rgb(0.38, 0.4, 0.44),
  cardFill: rgb(0.97, 0.97, 0.99),
  cardBorder: rgb(0.86, 0.88, 0.91),
  ctaFill: rgb(0.96, 0.98, 0.99),
  ctaBorder: rgb(0.7, 0.82, 0.9),
  ctaButtonBlue: rgb(0 / 255, 100 / 255, 145 / 255),
  white: rgb(1, 1, 1),
  footerLine: rgb(0.88, 0.9, 0.92),
};

export const PDF_LAYOUT = {
  pageW: 595.28,
  pageH: 841.89,
  /** Single horizontal inset for body text and cards (points). */
  margin: 48,
  headerBandH: 46,
  /** Space for footer row (page label + icon). */
  footerReserve: 44,
  lineGap: 13,
  bodySize: 10,
  titleSize: 18,
  sectionTitleSize: 11,
  smallSize: 9,
  cardPad: 10,
  impactColGap: 12,
} as const;

/** @deprecated Prefer wrapLinesToWidth for PDF layout alignment. */
export function wrapLines(text: string, maxChars: number): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = "";
  for (const w of words) {
    const next = current ? `${current} ${w}` : w;
    if (next.length <= maxChars) {
      current = next;
    } else {
      if (current) lines.push(current);
      current = w.length > maxChars ? `${w.slice(0, maxChars - 1)}…` : w;
    }
  }
  if (current) lines.push(current);
  return lines;
}

/**
 * Word-wrap using real glyph widths so every line fits within `maxWidthPt` points.
 * Keeps body text and cards aligned to the same left/right edges as the margin box.
 */
export function wrapLinesToWidth(
  text: string,
  font: PDFFont,
  fontSize: number,
  maxWidthPt: number,
): string[] {
  const t = text.trim();
  if (!t) return [];

  const wline = (s: string) => font.widthOfTextAtSize(s, fontSize);

  function breakLongWord(word: string): string[] {
    const out: string[] = [];
    let remainder = word;
    while (remainder.length > 0) {
      if (wline(remainder) <= maxWidthPt) {
        out.push(remainder);
        break;
      }
      let lo = 1;
      let hi = remainder.length;
      while (lo < hi) {
        const mid = Math.ceil((lo + hi) / 2);
        if (wline(remainder.slice(0, mid)) <= maxWidthPt) lo = mid;
        else hi = mid - 1;
      }
      const take = Math.max(1, lo);
      out.push(remainder.slice(0, take));
      remainder = remainder.slice(take);
    }
    return out;
  }

  const words = t.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = "";

  for (const w of words) {
    const next = current ? `${current} ${w}` : w;
    if (wline(next) <= maxWidthPt) {
      current = next;
      continue;
    }
    if (current) lines.push(current);
    if (wline(w) <= maxWidthPt) {
      current = w;
    } else {
      lines.push(...breakLongWord(w));
      current = "";
    }
  }
  if (current) lines.push(current);
  return lines;
}
