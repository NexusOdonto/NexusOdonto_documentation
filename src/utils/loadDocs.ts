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

// Helper para resolver rutas de imágenes de teams usando Vite's new URL()
export const getTeamAvatar = (imageName: string): string => {
  try {
    return new URL(`../assets/teams/${imageName}`, import.meta.url).href;
  } catch {
    return ""; // Retornar string vacío en caso de error
  }
};

export function loadAllDocs(): DocFile[] {
  const docs: DocFile[] = Object.entries(modules).map(([path, raw]) => {
    const rawContent = raw as string;
    const { data, content } = parseFrontmatter(rawContent);
    const { section, slug } = pathToSlug(path);

    // Resolución de avatar de team usando new URL()
    let resolvedAvatar = "";
    if (data.avatar && typeof data.avatar === 'string') {
      // Si el avatar es una ruta relativa como "../../assets/teams/...", resolverla
      if (data.avatar.includes("../assets/teams/")) {
        const fileName = data.avatar.split("/").pop() || "";
        resolvedAvatar = getTeamAvatar(fileName);
      } else if (data.avatar.startsWith("/teams/")) {
        // Ruta absoluta como "/teams/AndresFelipeNavasAlvear.jpeg"
        resolvedAvatar = data.avatar;
      } else {
        resolvedAvatar = data.avatar;
      }
    }

    return {
      slug,
      section,
      title: String(data.title || data.name || slug.split("/").pop() || "Sin título"),
      order: Number(data.order ?? 999),
      date: data.date ? String(data.date) : undefined,
      author: data.author ? String(data.author) : undefined,
      content: content || "",
      path,
      role: data.role ? String(data.role) : undefined,
      photo: data.photo ? String(data.photo) : undefined,
      name: data.name ? String(data.name) : undefined,
      avatar: resolvedAvatar,
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