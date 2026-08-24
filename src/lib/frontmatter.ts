export interface Frontmatter {
  title?: string;
  date?: string;
  author?: string;
  order?: number;
  [key: string]: string | number | undefined;
}

export function parseFrontmatter(raw: string): { data: Frontmatter; content: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);

  if (!match) {
    return { data: {}, content: raw };
  }

  const [, frontmatterBlock, content] = match;
  const data: Frontmatter = {};

  frontmatterBlock.split("\n").forEach((line) => {
    const idx = line.indexOf(":");
    if (idx === -1) return;
    const key = line.slice(0, idx).trim();
    let value: string | number = line.slice(idx + 1).trim();

    value = value.replace(/^["']|["']$/g, "");

    if (!isNaN(Number(value)) && value !== "") value = Number(value);

    data[key] = value;
  });

  return { data, content };
}