import { getCollection, type CollectionEntry } from "astro:content";

export type SiteLocale = "en" | "zh";

export type SermonEntry = CollectionEntry<"sermons">;
export type ArticleEntry = CollectionEntry<"articles">;

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9\u4e00-\u9fff]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function formatDate(date: Date, locale: SiteLocale): string {
  return new Intl.DateTimeFormat(locale === "zh" ? "zh-CN" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  }).format(date);
}

export function getSermonPermalink(sermon: SermonEntry): string {
  const [, ...rest] = sermon.id.split("/").filter(Boolean);
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  const prefix = base === "" ? "" : base;
  return `${prefix}/${sermon.data.locale}/sermons/${rest.join("/")}/`;
}

export function getArticlePermalink(article: ArticleEntry): string {
  const [, ...rest] = article.id.split("/").filter(Boolean);
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  const prefix = base === "" ? "" : base;
  return `${prefix}/${article.data.locale}/articles/${rest.join("/")}/`;
}

export async function getAllSermons(): Promise<SermonEntry[]> {
  const sermons = await getCollection("sermons");
  return sermons.sort((left, right) => right.data.date.getTime() - left.data.date.getTime());
}

export async function getAllArticles(): Promise<ArticleEntry[]> {
  const articles = await getCollection("articles");
  return articles.sort((left, right) => right.data.date.getTime() - left.data.date.getTime());
}

export async function getSermonsByLocale(locale: SiteLocale): Promise<SermonEntry[]> {
  const sermons = await getAllSermons();
  return sermons.filter((entry) => entry.data.locale === locale);
}

export async function getArticlesByLocale(locale: SiteLocale): Promise<ArticleEntry[]> {
  const articles = await getAllArticles();
  return articles.filter((entry) => entry.data.locale === locale);
}

export function getThemeGroups(sermons: SermonEntry[]) {
  const themeMap = new Map<string, SermonEntry[]>();

  for (const sermon of sermons) {
    for (const theme of sermon.data.themes) {
      const key = theme.trim();
      const existing = themeMap.get(key) ?? [];
      existing.push(sermon);
      themeMap.set(key, existing);
    }
  }

  return [...themeMap.entries()]
    .sort((left, right) => left[0].localeCompare(right[0]))
    .map(([theme, entries]) => ({
      label: theme,
      slug: slugify(theme),
      count: entries.length,
      entries: entries.sort((left, right) => right.data.date.getTime() - left.data.date.getTime())
    }));
}

export function getFeaturedQuotes(sermons: SermonEntry[]) {
  return sermons.flatMap((sermon) =>
    sermon.data.quotes.map((quote) => ({
      quote,
      sermon,
      url: getSermonPermalink(sermon)
    }))
  );
}

export function buildSearchItems(sermons: SermonEntry[], articles: ArticleEntry[] = []) {
  const sermonItems = sermons.map((sermon) => ({
    kind: "sermon",
    title: sermon.data.title,
    excerpt: sermon.data.summary,
    meta: `${sermon.data.speaker} · ${formatDate(sermon.data.date, sermon.data.locale)}`,
    url: getSermonPermalink(sermon),
    terms: [sermon.data.speaker, sermon.data.heroLine, ...sermon.data.themes, ...sermon.data.scriptures]
  }));

  const quoteItems = getFeaturedQuotes(sermons).map(({ quote, sermon, url }) => ({
    kind: "quote",
    title: quote.text,
    excerpt: `${sermon.data.speaker} · ${sermon.data.title}`,
    meta: `${quote.status} quote`,
    url,
    terms: [sermon.data.speaker, sermon.data.title, ...sermon.data.themes, ...sermon.data.scriptures]
  }));

  const articleItems = articles.map((article) => ({
    kind: "article",
    title: article.data.title,
    excerpt: article.data.summary,
    meta: formatDate(article.data.date, article.data.locale),
    url: getArticlePermalink(article),
    terms: [
      article.data.heroLine,
      ...article.data.themes,
      ...article.data.sources.flatMap((source) => [source.title, source.author ?? "", source.publisher])
    ].filter(Boolean)
  }));

  return [...sermonItems, ...quoteItems, ...articleItems];
}
