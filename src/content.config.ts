import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const sermons = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/sermons" }),
  schema: z.object({
    title: z.string(),
    locale: z.enum(["en", "zh"]),
    canonicalId: z.string(),
    speaker: z.string(),
    date: z.coerce.date(),
    event: z.string(),
    summary: z.string(),
    heroLine: z.string(),
    themes: z.array(z.string()).min(1),
    scriptures: z.array(z.string()).default([]),
    sourceRights: z.enum([
      "curated-notes-and-short-quotes",
      "permission-granted-full-text",
      "original-sermon"
    ]),
    commentTerm: z.string(),
    quotes: z.array(
      z.object({
        text: z.string(),
        status: z.enum(["exact", "cleaned", "paraphrase"]),
        note: z.string().optional()
      })
    )
  })
});

export const collections = {
  sermons
};
