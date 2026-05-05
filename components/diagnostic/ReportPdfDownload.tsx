"use client";

import fontkit from "@pdf-lib/fontkit";
import { PDFDocument, StandardFonts, type PDFFont, type PDFImage } from "pdf-lib";
import type { SiteMessages } from "@/content/messages/types";
import { DIAGNOSTIC_SCHEDULE_URL } from "@/lib/diagnostic-schedule-url";
import { getReportClientDisplayName } from "@/lib/diagnostics/report-client-line";
import type { DiagnosticReportPayload, PrimaryRecommendation } from "@/lib/diagnostics/types";
import { addUriLink } from "./pdf-links";
import { PDF_LAYOUT, PDF_THEME, wrapLinesToWidth } from "./pdf-theme";

type ReportPdfDownloadProps = {
  payload: DiagnosticReportPayload;
  messages: SiteMessages;
  /** Localized label for opportunity level (e.g. Alta / High). */
  opportunityLevelLabel: string;
  scheduleHref?: string;
};

const FONT_URLS = {
  regular: "/fonts/Inter-400.ttf",
  bold: "/fonts/Inter-700.ttf",
} as const;

const LOGO_PATH = "/brand_assets/logo-aurora-report.png";
const FOOTER_ICON_PATH = "/brand_assets/icon-black-footer.png";

function primaryLabel(m: SiteMessages, key: PrimaryRecommendation | undefined): string | null {
  if (!key) return null;
  return m.report.primaryRec[key];
}

function resolvePdfCtaUrl(scheduleHref: string | undefined): string {
  const explicit = process.env.NEXT_PUBLIC_DIAGNOSTIC_SCHEDULE_URL?.trim();
  if (explicit) {
    if (explicit.startsWith("http://") || explicit.startsWith("https://")) return explicit;
    try {
      return new URL(explicit, window.location.origin).href;
    } catch {
      return explicit;
    }
  }
  const href = scheduleHref?.trim() ?? "";
  if (href.startsWith("http://") || href.startsWith("https://")) return href;
  const legacyExplicit = process.env.NEXT_PUBLIC_REPORT_PDF_CTA_URL?.trim();
  if (!href && legacyExplicit) return legacyExplicit;
  if (!href) return DIAGNOSTIC_SCHEDULE_URL;
  try {
    return new URL(href || "/", window.location.origin).href;
  } catch {
    return href;
  }
}

async function embedInterFonts(pdf: PDFDocument): Promise<{ font: PDFFont; fontBold: PDFFont } | null> {
  pdf.registerFontkit(fontkit);
  try {
    const [regRes, boldRes] = await Promise.all([fetch(FONT_URLS.regular), fetch(FONT_URLS.bold)]);
    if (!regRes.ok || !boldRes.ok) return null;
    const [regBuf, boldBuf] = await Promise.all([regRes.arrayBuffer(), boldRes.arrayBuffer()]);
    const [font, fontBold] = await Promise.all([
      pdf.embedFont(regBuf, { subset: false }),
      pdf.embedFont(boldBuf, { subset: false }),
    ]);
    return { font, fontBold };
  } catch {
    return null;
  }
}

async function embedPngAsset(pdf: PDFDocument, path: string): Promise<PDFImage | null> {
  try {
    const res = await fetch(path);
    if (!res.ok) return null;
    const buf = await res.arrayBuffer();
    return await pdf.embedPng(buf);
  } catch {
    return null;
  }
}

export function ReportPdfDownload({
  payload,
  messages,
  opportunityLevelLabel,
  scheduleHref,
}: ReportPdfDownloadProps) {
  const r = messages.report;
  const d = payload.diagnosis;
  const cls = payload.classification;
  const pr = primaryLabel(messages, cls.primary_recommendation);

  async function download() {
    const pdf = await PDFDocument.create();

    const inter = await embedInterFonts(pdf);
    const font = inter?.font ?? (await pdf.embedFont(StandardFonts.Helvetica));
    const fontBold = inter?.fontBold ?? (await pdf.embedFont(StandardFonts.HelveticaBold));

    const logoImage = await embedPngAsset(pdf, LOGO_PATH);
    const footerIcon = await embedPngAsset(pdf, FOOTER_ICON_PATH);

    const pageW = PDF_LAYOUT.pageW;
    const pageH = PDF_LAYOUT.pageH;
    const margin = PDF_LAYOUT.margin;
    const footerReserve = PDF_LAYOUT.footerReserve;
    const bottomLimit = margin + footerReserve;
    const headerBandH = PDF_LAYOUT.headerBandH;
    const lineGap = PDF_LAYOUT.lineGap;
    const bodySize = PDF_LAYOUT.bodySize;
    const sectionTitleSize = PDF_LAYOUT.sectionTitleSize;
    const smallSize = PDF_LAYOUT.smallSize;
    const titleSize = PDF_LAYOUT.titleSize;

    const contentWidth = pageW - margin * 2;

    let page = pdf.addPage([pageW, pageH]);
    let height = page.getSize().height;
    let y = height - margin;
    let drewFirstPageHeader = false;

    function newPage() {
      page = pdf.addPage([pageW, pageH]);
      height = page.getSize().height;
      y = height - margin;
    }

    function needSpace(lines: number) {
      const h = lines * lineGap + 8;
      if (y - h < bottomLimit) newPage();
    }

    function drawFirstPageHeader() {
      if (drewFirstPageHeader) return;
      drewFirstPageHeader = true;
      page.drawRectangle({
        x: 0,
        y: height - headerBandH,
        width: pageW,
        height: headerBandH,
        color: PDF_THEME.headerBlack,
      });

      const dateStr = new Intl.DateTimeFormat(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(new Date());

      if (logoImage) {
        const logoH = 28;
        const logoW = (logoImage.width / logoImage.height) * logoH;
        const logoBottom = height - headerBandH + 9;
        page.drawImage(logoImage, { x: margin, y: logoBottom, width: logoW, height: logoH });
      }

      const dateW = font.widthOfTextAtSize(dateStr, smallSize);
      page.drawText(dateStr, {
        x: pageW - margin - dateW,
        y: height - 28,
        size: smallSize,
        font,
        color: PDF_THEME.white,
      });

      y = height - headerBandH - 20;
    }

    function drawParagraph(text: string, boldTitle?: string) {
      if (boldTitle) {
        const titleLines = wrapLinesToWidth(boldTitle, fontBold, sectionTitleSize, contentWidth);
        needSpace(titleLines.length + 1);
        for (const line of titleLines) {
          page.drawText(line, {
            x: margin,
            y: y - sectionTitleSize,
            size: sectionTitleSize,
            font: fontBold,
            color: PDF_THEME.auroraBlue,
          });
          y -= sectionTitleSize + 4;
        }
        y -= 2;
      }
      for (const line of wrapLinesToWidth(text, font, bodySize, contentWidth)) {
        needSpace(1);
        page.drawText(line, { x: margin, y: y - bodySize, size: bodySize, font, color: PDF_THEME.text });
        y -= lineGap;
      }
      y -= lineGap;
    }

    function drawSectionCard(title: string, bodyLines: string[]) {
      const pad = PDF_LAYOUT.cardPad;
      const innerW = contentWidth - pad * 2;
      const titleLines = wrapLinesToWidth(title, fontBold, sectionTitleSize, innerW);
      const wrapped = bodyLines.flatMap((t) => wrapLinesToWidth(t, font, bodySize, innerW));
      const titleH = titleLines.length > 0 ? titleLines.length * (sectionTitleSize + 4) - 4 : 0;
      const cardH = pad + titleH + wrapped.length * lineGap + pad;
      needSpace(Math.ceil(cardH / lineGap) + 2);

      const yBottom = y - cardH;
      page.drawRectangle({
        x: margin,
        y: yBottom,
        width: contentWidth,
        height: cardH,
        color: PDF_THEME.cardFill,
        borderColor: PDF_THEME.cardBorder,
        borderWidth: 0.5,
      });

      let innerY = y - pad;
      for (const tl of titleLines) {
        page.drawText(tl, {
          x: margin + pad,
          y: innerY - sectionTitleSize,
          size: sectionTitleSize,
          font: fontBold,
          color: PDF_THEME.auroraPurple,
        });
        innerY -= sectionTitleSize + 4;
      }
      innerY -= 2;
      for (const line of wrapped) {
        page.drawText(line, {
          x: margin + pad,
          y: innerY - bodySize,
          size: bodySize,
          font,
          color: PDF_THEME.text,
        });
        innerY -= lineGap;
      }
      y = yBottom - lineGap;
    }

    function drawImpactGrid(
      sectionTitle: string,
      rows: { label: string; value: string }[],
    ) {
      const sectionLines = wrapLinesToWidth(sectionTitle, fontBold, sectionTitleSize, contentWidth);
      needSpace(2 + sectionLines.length);
      for (const sl of sectionLines) {
        page.drawText(sl, {
          x: margin,
          y: y - sectionTitleSize,
          size: sectionTitleSize,
          font: fontBold,
          color: PDF_THEME.auroraBlue,
        });
        y -= sectionTitleSize + 4;
      }
      y -= 4;

      const gap = PDF_LAYOUT.impactColGap;
      const colW = (contentWidth - gap * 2) / 3;
      const colInnerW = colW - PDF_LAYOUT.cardPad * 2;
      const labelLineGap = 11;

      const blocks = rows.map((row) => ({
        labelLines: wrapLinesToWidth(row.label, fontBold, 8, colInnerW),
        valueLines: wrapLinesToWidth(row.value, font, bodySize, colInnerW),
      }));

      const rowH = blocks.reduce((max, b) => {
        const h =
          PDF_LAYOUT.cardPad * 2 +
          b.labelLines.length * labelLineGap +
          4 +
          b.valueLines.length * lineGap;
        return Math.max(max, h);
      }, 0);

      needSpace(Math.ceil(rowH / lineGap) + 2);

      const baseY = y;
      for (let i = 0; i < 3; i++) {
        const x0 = margin + i * (colW + gap);
        const { labelLines, valueLines } = blocks[i]!;
        page.drawRectangle({
          x: x0,
          y: baseY - rowH,
          width: colW,
          height: rowH,
          color: PDF_THEME.cardFill,
          borderColor: PDF_THEME.cardBorder,
          borderWidth: 0.5,
        });
        let cy = baseY - PDF_LAYOUT.cardPad;
        for (const line of labelLines) {
          page.drawText(line, {
            x: x0 + PDF_LAYOUT.cardPad,
            y: cy - 8,
            size: 8,
            font: fontBold,
            color: PDF_THEME.auroraBlue,
          });
          cy -= labelLineGap;
        }
        cy -= 4;
        for (const line of valueLines) {
          page.drawText(line, {
            x: x0 + PDF_LAYOUT.cardPad,
            y: cy - bodySize,
            size: bodySize,
            font,
            color: PDF_THEME.text,
          });
          cy -= lineGap;
        }
      }
      y = baseY - rowH - lineGap;
    }

    drawFirstPageHeader();

    const reportTitleText = d.report_title?.trim() || r.pageTitle;
    const reportTitleLines = wrapLinesToWidth(reportTitleText, fontBold, titleSize, contentWidth);
    const clientLineText = `${r.clientLinePrefix} ${getReportClientDisplayName(payload)}`;
    const clientLineLines = wrapLinesToWidth(clientLineText, font, smallSize, contentWidth);
    needSpace(reportTitleLines.length + clientLineLines.length + 3);
    for (const line of reportTitleLines) {
      page.drawText(line, {
        x: margin,
        y: y - titleSize,
        size: titleSize,
        font: fontBold,
        color: PDF_THEME.text,
      });
      y -= titleSize + 4;
    }
    y -= 4;
    for (const line of clientLineLines) {
      page.drawText(line, {
        x: margin,
        y: y - smallSize,
        size: smallSize,
        font,
        color: PDF_THEME.muted,
      });
      y -= lineGap;
    }
    y -= lineGap;

    const oppLines = wrapLinesToWidth(
      `${r.opportunityBadge}: ${opportunityLevelLabel}`,
      fontBold,
      sectionTitleSize,
      contentWidth,
    );
    needSpace(oppLines.length + 1);
    for (const line of oppLines) {
      page.drawText(line, {
        x: margin,
        y: y - sectionTitleSize,
        size: sectionTitleSize,
        font: fontBold,
        color: PDF_THEME.auroraBlue,
      });
      y -= sectionTitleSize + 4;
    }
    y -= 2;
    drawParagraph(d.summary);

    if (d.key_insights && d.key_insights.length > 0) {
      const insightLines = d.key_insights.map((insight) => `• ${insight}`);
      drawSectionCard(r.insightsTitle, insightLines);
    }

    if (d.impact) {
      drawImpactGrid(r.impactTitle, [
        { label: r.impactTime, value: d.impact.time_savings },
        { label: r.impactOps, value: d.impact.operational_improvement },
        { label: r.impactBusiness, value: d.impact.business_potential },
      ]);
    }
    const est = d.estimated_impact?.trim();
    if (est) {
      if (d.impact) {
        drawParagraph(est, r.impactNarrativeSubtitle);
      } else {
        drawParagraph(est, r.impactTitle);
      }
    }

    drawParagraph(d.problem_analysis, r.sections.problem);
    drawParagraph(d.opportunity, r.sections.opportunity);
    drawParagraph(d.risks, r.sections.risks);
    if (pr) {
      const prLabelLines = wrapLinesToWidth(r.primaryRecLabel, fontBold, sectionTitleSize, contentWidth);
      needSpace(2 + prLabelLines.length);
      for (const line of prLabelLines) {
        page.drawText(line, {
          x: margin,
          y: y - sectionTitleSize,
          size: sectionTitleSize,
          font: fontBold,
          color: PDF_THEME.auroraBlue,
        });
        y -= sectionTitleSize + 4;
      }
      y -= 2;
      for (const line of wrapLinesToWidth(pr, font, bodySize, contentWidth)) {
        needSpace(1);
        page.drawText(line, { x: margin, y: y - bodySize, size: bodySize, font, color: PDF_THEME.text });
        y -= lineGap;
      }
      y -= lineGap;
    }
    drawParagraph(d.recommendation, r.sections.recommendation);
    drawParagraph(d.next_steps, r.sections.nextSteps);

    const ctaUrl = resolvePdfCtaUrl(scheduleHref);
    const ctaPad = 14;
    const buttonH = 30;
    const gapTitleToButton = 12;
    const ctaTitle = r.scheduleCta15m;
    const linkLabel = r.pdfCtaLinkLabel;
    const btnInnerW = contentWidth - ctaPad * 2;
    const titleLines = wrapLinesToWidth(ctaTitle, fontBold, sectionTitleSize, btnInnerW);
    const titleLineStep = sectionTitleSize + 6;
    const titleBlockH =
      titleLines.length > 0 ? titleLines.length * titleLineStep - 6 : 0;
    const cardH = ctaPad + titleBlockH + gapTitleToButton + buttonH + ctaPad;

    needSpace(Math.ceil(cardH / lineGap) + 2);
    const ctaBottom = y - cardH;
    page.drawRectangle({
      x: margin,
      y: ctaBottom,
      width: contentWidth,
      height: cardH,
      color: PDF_THEME.ctaFill,
      borderColor: PDF_THEME.ctaBorder,
      borderWidth: 0.75,
    });

    let lineTop = y - ctaPad;
    for (const line of titleLines) {
      page.drawText(line, {
        x: margin + ctaPad,
        y: lineTop - sectionTitleSize,
        size: sectionTitleSize,
        font: fontBold,
        color: PDF_THEME.auroraBlue,
      });
      lineTop -= titleLineStep;
    }
    lineTop -= gapTitleToButton;
    const btnBottom = lineTop - buttonH;
    page.drawRectangle({
      x: margin + ctaPad,
      y: btnBottom,
      width: btnInnerW,
      height: buttonH,
      color: PDF_THEME.ctaButtonBlue,
    });
    const labelW = fontBold.widthOfTextAtSize(linkLabel, bodySize);
    page.drawText(linkLabel, {
      x: margin + ctaPad + (btnInnerW - labelW) / 2,
      y: btnBottom + 11,
      size: bodySize,
      font: fontBold,
      color: PDF_THEME.white,
    });
    addUriLink(
      pdf,
      page,
      { x: margin + ctaPad, y: btnBottom, width: btnInnerW, height: buttonH },
      ctaUrl,
    );
    y = ctaBottom - lineGap;

    const pages = pdf.getPages();
    const iconH = footerIcon ? 26 : 0;
    const iconW = footerIcon ? (footerIcon.width / footerIcon.height) * iconH : 0;
    /** Same inset as body: right edge of icon aligns with text block (`pageW - margin`). */
    const footerIconBottomY = margin;
    const iconCenterY =
      iconH > 0 ? footerIconBottomY + iconH / 2 : footerIconBottomY + smallSize;
    const pageNumBaseline = iconCenterY - smallSize * 0.32;

    for (let i = 0; i < pages.length; i++) {
      const p = pages[i]!;
      const w = p.getSize().width;
      p.drawText(String(i + 1), {
        x: margin,
        y: pageNumBaseline,
        size: smallSize,
        font,
        color: PDF_THEME.text,
      });
      if (footerIcon) {
        p.drawImage(footerIcon, {
          x: w - margin - iconW,
          y: footerIconBottomY,
          width: iconW,
          height: iconH,
        });
      }
    }

    const bytes = await pdf.save();
    const blob = new Blob([new Uint8Array(bytes)], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const safe = payload.contact.email.split("@")[0]?.replace(/[^\w.-]+/g, "_") ?? "report";
    a.download = `aurora-diagnostic-${safe}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <button
      type="button"
      onClick={() => void download()}
      className="cursor-pointer rounded-full border border-aurora-blue/40 bg-aurora-blue/15 px-5 py-2.5 text-sm font-medium text-foreground hover:bg-aurora-blue/25"
    >
      {r.downloadPdf}
    </button>
  );
}
