import "server-only";
import type { DocumentData, QueryDocumentSnapshot } from "firebase-admin/firestore";
import { getAdminFirestore, getArticlesCollectionName, isFirebaseAdminConfigured } from "@/lib/firebase-admin";
import type { ArticleDoc, ArticleSource, ImageAttribution } from "@/lib/articles/types";

function mapDoc(doc: QueryDocumentSnapshot<DocumentData>): ArticleDoc | null {
  const d = doc.data();
  if (!d) return null;
  let createdAt: Date | null = null;
  const ca = d.createdAt;
  if (ca && typeof ca.toDate === "function") {
    createdAt = ca.toDate();
  }
  const img = d.image_attribution;
  let image_attribution: ImageAttribution | null | undefined;
  if (img && typeof img === "object") {
    image_attribution = {
      photographer: typeof img.photographer === "string" ? img.photographer : undefined,
      source: typeof img.source === "string" ? img.source : undefined,
      page_url: typeof img.page_url === "string" ? img.page_url : undefined,
    };
  }

  let sources: ArticleSource[] | undefined;
  if (Array.isArray(d.sources)) {
    sources = d.sources
      .filter((s: unknown) => s && typeof s === "object")
      .map((s: { title?: string; url?: string }) => ({
        title: String(s.title ?? ""),
        url: String(s.url ?? ""),
      }))
      .filter((s) => s.title && s.url);
  }

  return {
    id: doc.id,
    slug: String(d.slug ?? ""),
    title_es: String(d.title_es ?? ""),
    title_en: String(d.title_en ?? ""),
    summary_es: String(d.summary_es ?? ""),
    summary_en: String(d.summary_en ?? ""),
    body_markdown_es: String(d.body_markdown_es ?? ""),
    body_markdown_en: String(d.body_markdown_en ?? ""),
    aurora_take_es: String(d.aurora_take_es ?? ""),
    aurora_take_en: String(d.aurora_take_en ?? ""),
    createdAt,
    created_at_iso: typeof d.created_at_iso === "string" ? d.created_at_iso : undefined,
    image_url: String(d.image_url ?? ""),
    image_attribution: image_attribution ?? null,
    sources: sources?.length ? sources : undefined,
  };
}

function filterValidSlug(a: ArticleDoc): boolean {
  return Boolean(a.slug?.trim());
}

export async function listArticles(): Promise<ArticleDoc[]> {
  if (!isFirebaseAdminConfigured()) return [];
  const db = getAdminFirestore();
  const col = db.collection(getArticlesCollectionName());
  const snap = await col.orderBy("createdAt", "desc").get();
  const out: ArticleDoc[] = [];
  for (const doc of snap.docs) {
    const m = mapDoc(doc);
    if (m && filterValidSlug(m)) out.push(m);
  }
  return out;
}

export async function latestArticles(limit: number): Promise<ArticleDoc[]> {
  const all = await listArticles();
  return all.slice(0, limit);
}

export async function getArticleBySlug(slug: string): Promise<ArticleDoc | null> {
  if (!isFirebaseAdminConfigured()) return null;
  const db = getAdminFirestore();
  const col = db.collection(getArticlesCollectionName());
  const snap = await col.where("slug", "==", slug).limit(1).get();
  if (snap.empty) return null;
  const doc = snap.docs[0]!;
  return mapDoc(doc);
}

/** All distinct slugs for sitemap (one URL per slug × locales). */
export async function getAllArticleSlugs(): Promise<string[]> {
  if (!isFirebaseAdminConfigured()) return [];
  const db = getAdminFirestore();
  const col = db.collection(getArticlesCollectionName());
  const snap = await col.select("slug").get();
  const slugs = new Set<string>();
  for (const doc of snap.docs) {
    const s = doc.get("slug");
    if (typeof s === "string" && s.trim()) slugs.add(s.trim());
  }
  return [...slugs];
}
