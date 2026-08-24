import type { ReactNode } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import { getDocsBySection } from "../lib/loadDocs";
import { SECTION_ORDER, SECTION_LABELS, SPECIAL_SECTIONS } from "../lib/sectionConfig";
import {
  OverviewIcon,
  AgentIcon,
  BackendIcon,
  FrontendIcon,
  BitacoraIcon,
  TeamIcon,
} from "./Icons";

const SECTION_ICONS: Record<string, ReactNode> = {
  Overview: <OverviewIcon />,
  Agente_IA: <AgentIcon />,
  Backend_Net: <BackendIcon />,
  Frontend_React: <FrontendIcon />,
  Bitacora: <BitacoraIcon />,
  Team: <TeamIcon />,
};

export function Sidebar() {
  const bySection = getDocsBySection();
  const params = useParams();
  const activeSlug = params["*"];
  const location = useLocation();

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        {SECTION_ORDER.map((section) => {
          const specialRoute = SPECIAL_SECTIONS[section];
          const icon = SECTION_ICONS[section] || <OverviewIcon />;
          const label = SECTION_LABELS[section] || section;

          if (specialRoute) {
            const isActive = location.pathname === specialRoute;
            return (
              <div key={section} className="sidebar-section">
                <Link
                  to={specialRoute}
                  className={`sidebar-item ${isActive ? "active" : ""}`}
                >
                  <span className="sidebar-item-icon">{icon}</span>
                  <span className="sidebar-item-label">{label}</span>
                </Link>
              </div>
            );
          }

          const docs = bySection[section] || [];
          const isSectionActive = docs.some((d) => d.slug === activeSlug);

          return (
            <div key={section} className="sidebar-section">
              <div className={`sidebar-section-header ${isSectionActive ? "active-group" : ""}`}>
                <span className="sidebar-item-icon">{icon}</span>
                <span className="sidebar-section-title">{label}</span>
              </div>

              {docs.length === 0 ? (
                <p className="sidebar-empty">Sin documentos</p>
              ) : (
                <ul className="sidebar-list">
                  {docs.map((doc) => {
                    const isActive = doc.slug === activeSlug;
                    return (
                      <li key={doc.slug}>
                        <Link
                          to={`/docs/${doc.slug}`}
                          className={`sidebar-subitem ${isActive ? "active" : ""}`}
                        >
                          {doc.title}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}