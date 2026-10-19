// Turns a table cell link from Sanity into a route or an external href

export function resolveLink(link) {
  if (!link) return null;

  if (link.slug) {
    const path = link.slug.startsWith("/") ? link.slug : `/${link.slug}`;

    return {
      to: link.type === "project" ? `/projects${path}` : path,
      newTab: link.newTab,
    };
  }

  return link.url ? { href: link.url, newTab: link.newTab } : null;
}

export function resolveRowLinks(rows) {
  return rows.map((row) => ({
    ...row,
    cells: (row.cells ?? []).map((cell) => ({
      ...cell,
      link: resolveLink(cell.link),
    })),
  }));
}
