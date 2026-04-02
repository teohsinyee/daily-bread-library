export const siteConfig = {
  siteName: "Daily Bread Library",
  tagline: "Spiritual food through sermons, memorable lines, and lived reflection.",
  repo: "teohsinyee/daily-bread-library",
  repoId: "R_kgDOR3kTrg",
  discussionCategory: "Page Comments",
  discussionCategoryId: "DIC_kwDOR3kTrs4C52dV",
  baseUrl: "https://teohsinyee.github.io/daily-bread-library",
  locales: ["en", "zh"] as const
};

export type SiteLocale = (typeof siteConfig.locales)[number];

export function withBase(path: string): string {
  const base = import.meta.env.BASE_URL === "/" ? "" : import.meta.env.BASE_URL.replace(/\/$/, "");
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalized}`;
}

export const localeLabels: Record<SiteLocale, string> = {
  en: "English",
  zh: "中文"
};
