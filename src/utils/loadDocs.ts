import { parseFrontmatter } from "./frontmatter";
import type { DocFile } from "../types/doc";

const modules = import.meta.glob("/src/docs/**/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

export function normalizeSlug(str: string): string {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/^\/+/, "")
    .replace(/\/+$/, "")
    .replace(/[\s_]+/g, "-")
    .replace(/[^a-z0-9\-\/]+/g, "")
    .replace(/\-+/g, "-");
}

export function formatFallbackTitle(raw: string): string {
  const lastPart = raw.split("/").pop() || "";
  const clean = lastPart.replace(/^\d+[\-_]/, "");
  return clean
    .split(/[\-_]+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function pathToSlug(path: string): { section: string; slug: string } {
  const clean = path
    .replace(/\\/g, "/")
    .replace(/^.*\/src\/docs\//, "")
    .replace(/^src\/docs\//, "")
    .replace(/^\/src\/docs\//, "")
    .replace(/\.md$/, "");
  const parts = clean.split("/").filter(Boolean);
  const section = parts[0] || "";
  const slug = parts.map((p) => normalizeSlug(p)).join("/");
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

let cachedDocs: DocFile[] | null = null;

export function loadAllDocs(): DocFile[] {
  if (cachedDocs) return cachedDocs;

  const docs: DocFile[] = Object.entries(modules).map(([path, raw]) => {
    const rawContent = raw as string;
    const { data, content } = parseFrontmatter(rawContent);
    const { section, slug } = pathToSlug(path);

    // Resolución de avatar de team usando new URL()
    let resolvedAvatar = "";
    if (data.avatar && typeof data.avatar === 'string') {
      if (data.avatar.includes("../assets/teams/")) {
        const fileName = data.avatar.split("/").pop() || "";
        resolvedAvatar = getTeamAvatar(fileName);
      } else if (data.avatar.startsWith("/teams/")) {
        resolvedAvatar = data.avatar;
      } else {
        resolvedAvatar = data.avatar;
      }
    }

    const fallbackTitle = formatFallbackTitle(slug);
    const title = String(data.title || data.name || fallbackTitle || "Sin título");

    return {
      slug,
      section,
      title,
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

  cachedDocs = docs.sort((a, b) => a.order - b.order);
  return cachedDocs;
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
  if (!slug) return undefined;
  const decoded = decodeURIComponent(slug);
  const norm = normalizeSlug(decoded);
  const allDocs = loadAllDocs();

  // 1. Coincidencia exacta de slug normalizado
  const exact = allDocs.find((doc) => normalizeSlug(doc.slug) === norm);
  if (exact) return exact;

  // 2. Coincidencia con delimitador de sección (/slug o slug/)
  const suffix = allDocs.find((doc) => {
    const docNorm = normalizeSlug(doc.slug);
    return docNorm.endsWith("/" + norm) || norm.endsWith("/" + docNorm);
  });
  if (suffix) return suffix;

  // 3. Coincidencia por nombre de archivo (basename)
  const lastPartQuery = norm.split("/").pop();
  if (lastPartQuery) {
    const baseMatch = allDocs.find((doc) => {
      const docNorm = normalizeSlug(doc.slug);
      const lastPartDoc = docNorm.split("/").pop();
      return lastPartDoc === lastPartQuery;
    });
    if (baseMatch) return baseMatch;
  }

  return undefined;
}