import { loadAllDocs } from "./loadDocs";
import type { DocFile } from "../types/doc";

export interface SearchResult {
  doc: DocFile;
  snippet: string;
}

// Función para remover la sintaxis de Markdown y dejar texto limpio
function cleanMarkdown(text: string): string {
  return text
    // Elimina la especificación del lenguaje en bloques de código (ej: ```csharp o ```cs)
    .replace(/```[a-zA-Z0-9_-]*/g, "")
    // Elimina acentos graves/backticks sueltos de código inline (`code`)
    .replace(/`/g, "")
    // Elimina caracteres de encabezados (#, ##, ###)
    .replace(/#+\s?/g, "")
    // Reemplaza múltiples saltos de línea o espacios por uno solo
    .replace(/\s+/g, " ")
    .trim();
}

export function searchDocs(query: string): SearchResult[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const docs = loadAllDocs();
  const results: SearchResult[] = [];

  for (const doc of docs) {
    // Limpiamos el contenido Markdown del documento
    const cleanContent = cleanMarkdown(doc.content);
    
    const titleMatch = doc.title.toLowerCase().includes(q);
    const contentLower = cleanContent.toLowerCase();
    const contentIndex = contentLower.indexOf(q);

    if (titleMatch || contentIndex !== -1) {
      let snippet: string;

      if (contentIndex !== -1) {
        const start = Math.max(0, contentIndex - 40);
        const end = Math.min(cleanContent.length, contentIndex + 80);
        snippet = (start > 0 ? "…" : "") + cleanContent.slice(start, end) + "…";
      } else {
        snippet = cleanContent.slice(0, 100) + "…";
      }

      results.push({ doc, snippet });
    }
  }

  return results.slice(0, 8);
}