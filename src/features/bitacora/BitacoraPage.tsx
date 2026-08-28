import { getDocsBySection } from "../../utils/loadDocs";

const TYPE_COLORS: Record<string, string> = {
  Feature: "var(--color-tertiary)",
  Fix: "var(--color-primary)",
  Chore: "var(--color-text-muted)",
};

export function BitacoraPage() {
  const bySection = getDocsBySection();
  const entries = (bySection["Bitacora"] || [])
    .slice()
    .sort((a, b) => (b.date || "").localeCompare(a.date || ""));

  return (
    <div className="bitacora-page">
      <h1>Bitácora</h1>
      <p className="bitacora-subtitle">Historial de cambios del proyecto</p>

      {entries.length === 0 ? (
        <p className="sidebar-empty">Aún no hay entradas en la bitácora.</p>
      ) : (
        <div className="bitacora-timeline">
          {entries.map((entry) => (
            <div key={entry.slug} className="bitacora-entry">
              <div className="bitacora-entry-header">
                <span
                  className="bitacora-badge"
                  style={{ background: TYPE_COLORS[entry.type || "Chore"] }}
                >
                  {entry.type || "Chore"}
                </span>
                <span className="bitacora-date">{entry.date}</span>
              </div>
              <h3>{entry.title}</h3>
              {entry.author && (
                <p className="bitacora-author">Por {entry.author}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}