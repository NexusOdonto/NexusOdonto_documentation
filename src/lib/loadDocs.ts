import { parseFrontmatter } from "./frontmatter";
import type { DocFile } from "../types/doc";

const modules = import.meta.glob("/src/docs/**/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

function pathToSlug(path: string): { section: string; slug: string } {
  const parts = path.replace("/src/docs/", "").replace(".md", "").split("/");
  const section = parts[0];
  const slug = parts.join("/").toLowerCase();
  return { section, slug };
}

export function loadAllDocs(): DocFile[] {
  const docs: DocFile[] = Object.entries(modules).map(([path, raw]) => {
    const { data, content } = parseFrontmatter(raw);
    const { section, slug } = pathToSlug(path);

    return {
      slug,
      section,
      title: String(data.title || data.name || slug.split("/").pop() || "Sin título"),
      order: Number(data.order ?? 999),
      date: data.date ? String(data.date) : undefined,
      author: data.author ? String(data.author) : undefined,
      content,
      path,
      role: data.role ? String(data.role) : undefined,
      photo: data.photo ? String(data.photo) : undefined,
      name: data.name ? String(data.name) : undefined,
      avatar: data.avatar ? String(data.avatar) : undefined,
      summary: data.summary ? String(data.summary) : undefined,
    } as DocFile;
  });

  return docs.sort((a, b) => a.order - b.order);
}
export function getDocsBySection(): Record<string, DocFile[]> {
  const docs = loadAllDocs();
  const bySection: Record<string, DocFile[]> = {};

  docs.forEach((doc) => {
    if (!bySection[doc.section]) bySection[doc.section] = [];
    bySection[doc.section].push(doc);
  });

  return bySection;
}

export function getDocBySlug(slug: string): DocFile | undefined {
  const norm = slug.toLowerCase();
  return loadAllDocs().find(
    (doc) => doc.slug.toLowerCase() === norm || doc.slug.endsWith("/" + norm)
  );
}