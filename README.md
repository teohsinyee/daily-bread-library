# Daily Bread Library

A public Christian library of sermon notes, memorable lines, themes, and reflections.

## Purpose

This repository powers a public GitHub Pages site where people can browse spiritual food by theme, read curated sermon notes, and join the conversation through GitHub Discussions.

## Tech stack

- Astro
- Markdown content
- GitHub Pages
- GitHub Discussions comments via giscus

## Local development

```powershell
npm install
npm run dev
```

## Repository setup

1. In `Settings -> Pages`, set the source to `GitHub Actions`.
2. In `Settings -> General`, enable `Discussions`.
3. Create a discussion category named `Page Comments`.
4. Copy the giscus `Category ID` into `src/config/site.ts`.

## Content rules

- Publish curated notes, short quotes, themes, scriptures, and reflections.
- Keep raw transcripts and other working drafts outside the public repo unless you later have explicit permission to publish them.
- Use `quote.status` to distinguish confirmed wording from cleaned or paraphrased lines.

## Site identity

- Repo: `teohsinyee/daily-bread-library`
- Base path: `/daily-bread-library`
- GitHub Pages URL: `https://teohsinyee.github.io/daily-bread-library`
