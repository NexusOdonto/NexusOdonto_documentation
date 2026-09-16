import { Link } from "react-router-dom";
import { getDocsBySection } from "../../utils/loadDocs";

const TYPE_COLORS: Record<string, string> = {
  Feature: "var(--color-tertiary)",
  Fix: "var(--color-primary)",
  Chore: "var(--color-text-muted)",
};

export function BitacoraPage() {
  const bySection = getDocsBySection();
  const allBitacoras = bySection["05_Bitacora_de_Commits_y_Dailies"] || [];

  const entries = allBitacoras
    .slice()
    .sort((a, b) => (b.date || "").localeCompare(a.date || ""));

  return (
    <div className="bitacora-page">
      <h1>Bitácora de Desarrollo</h1>
      <p className="bitacora-subtitle">
        Historial cronológico de avances, decisiones técnicas y commits del ecosistema NexusOdonto
      </p>

      {entries.length === 0 ? (
        <p className="sidebar-empty">Aún no hay entradas en la bitácora.</p>
      ) : (
        <div className="bitacora-timeline">
          {entries.map((entry) => (
            <Link
              key={entry.slug}
              to={`/docs/${entry.slug}`}
              className="bitacora-entry-link"
              style={{ textDecoration: "none", color: "inherit", display: "block" }}
            >
              <div className="bitacora-entry">
                <div className="bitacora-entry-header">
                  <span
                    className="bitacora-badge"
                    style={{ background: TYPE_COLORS[entry.type || "Feature"] }}
                  >
                    {entry.type || "Feature"}
                  </span>
                  <span className="bitacora-date">{entry.date}</span>
                </div>
                <h3>{entry.title}</h3>
                {entry.author && (
                  <p className="bitacora-author">Por {entry.author}</p>
                )}
                {entry.summary && (
                  <p className="bitacora-summary">{entry.summary}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}