import { loadAllDocs } from "./loadDocs";
import type { DocFile } from "../types/doc";

export interface SearchResult {
  doc: DocFile;
  snippet: string;
}

export function searchDocs(query: string): SearchResult[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const docs = loadAllDocs();
  const results: SearchResult[] = [];

  for (const doc of docs) {
    const titleMatch = doc.title.toLowerCase().includes(q);
    const contentLower = doc.content.toLowerCase();
    const contentIndex = contentLower.indexOf(q);

    if (titleMatch || contentIndex !== -1) {
      let snippet: string;
      if (contentIndex !== -1) {
        const start = Math.max(0, contentIndex - 40);
        const end = Math.min(doc.content.length, contentIndex + 80);
        snippet = (start > 0 ? "…" : "") + doc.content.slice(start, end).replace(/\n/g, " ") + "…";
      } else {
        snippet = doc.content.slice(0, 100).replace(/\n/g, " ") + "…";
      }

      results.push({ doc, snippet });
    }
  }
return results.slice(0, 8);
}