import { writeFile } from "node:fs/promises";
import { createClient } from "@sanity/client";

const SITE_URL = "https://loannjuillerat.ch";
const STATIC_PATHS = ["/", "/about", "/projects", "/contact"];

const sanity = createClient({
  projectId: "164340f4",
  dataset: "production",
  useCdn: false,
  apiVersion: "2026-08-20",
});

const { pages, projects } = await sanity.fetch(`{
  "pages": *[_type == "page" && defined(slug.current)]{ "slug": slug.current, _updatedAt },
  "projects": *[_type == "project" && defined(slug.current)]{ "slug": slug.current, _updatedAt }
}`);

const toPath = (slug) => (slug.startsWith("/") ? slug : `/${slug}`);
const updatedAt = new Map(pages.map((page) => [toPath(page.slug), page._updatedAt]));

const entries = [
  ...STATIC_PATHS.map((path) => ({ path, lastmod: updatedAt.get(path) })),
  ...projects.map((project) => ({
    path: `/projects${toPath(project.slug)}`,
    lastmod: project._updatedAt,
  })),
];

const urls = entries
  .map(({ path, lastmod }) =>
    [
      "  <url>",
      `    <loc>${SITE_URL}${path}</loc>`,
      lastmod ? `    <lastmod>${lastmod.slice(0, 10)}</lastmod>` : null,
      "  </url>",
    ]
      .filter(Boolean)
      .join("\n"),
  )
  .join("\n");

await writeFile(
  new URL("../public/sitemap.xml", import.meta.url),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`,
);

console.log(`sitemap.xml: ${entries.length} URLs`);
