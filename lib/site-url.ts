export const DEFAULT_SITE_URL = "https://www.teamaurora.pe";

export function getPublicSiteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL ?? DEFAULT_SITE_URL;
}

export function getPublicSiteOrigin(): string {
  return new URL(getPublicSiteUrl()).origin;
}
