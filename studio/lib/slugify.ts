// Same rules as src/lib/slugify.ts in the website (kept identical on purpose).
export const slugify = (value: string): string =>
  value
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
