/** ~200 wpm; strips fenced code blocks for a fairer estimate. */
export function estimateReadingMinutes(markdown: string): number {
  const stripped = markdown.replace(/```[\s\S]*?```/g, " ");
  const text = stripped.replace(/\s+/g, " ").trim();
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}
