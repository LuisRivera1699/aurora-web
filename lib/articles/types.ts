/** Firestore `articles` collection — fields used by the public blog. */

export type ImageAttribution = {
  photographer?: string;
  source?: string;
  page_url?: string;
};

export type ArticleSource = { title: string; url: string };

export type ArticleDoc = {
  id: string;
  slug: string;
  title_es: string;
  title_en: string;
  summary_es: string;
  summary_en: string;
  body_markdown_es: string;
  body_markdown_en: string;
  aurora_take_es: string;
  aurora_take_en: string;
  createdAt: Date | null;
  /** Optional ISO string stored in Firestore */
  created_at_iso?: string;
  image_url: string;
  image_attribution?: ImageAttribution | null;
  sources?: ArticleSource[];
};
