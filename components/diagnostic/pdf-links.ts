import { PDFString, type PDFDocument, type PDFPage } from "pdf-lib";

/**
 * Adds a clickable URI link annotation (PDF viewers open the URL on click).
 * Rect uses pdf-lib coordinates: origin bottom-left; `y` is the bottom edge of the rect.
 */
export function addUriLink(
  pdfDoc: PDFDocument,
  page: PDFPage,
  rect: { x: number; y: number; width: number; height: number },
  url: string,
): void {
  const { x, y, width, height } = rect;
  const linkAnnotation = pdfDoc.context.register(
    pdfDoc.context.obj({
      Type: "Annot",
      Subtype: "Link",
      Rect: [x, y, x + width, y + height],
      Border: [0, 0, 0],
      A: {
        Type: "Action",
        S: "URI",
        URI: PDFString.of(url),
      },
    }),
  );
  page.node.addAnnot(linkAnnotation);
}
