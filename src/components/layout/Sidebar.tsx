import type { ReactNode } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import { getDocsBySection } from "../../utils/loadDocs";
import { SECTION_ORDER, SECTION_LABELS, SPECIAL_SECTIONS } from "../../utils/sectionConfig";
import {
  OverviewIcon,
  AgentIcon,
  BackendIcon,
  BaseDeDatosIcon,
  FrontendIcon,
  BitacoraIcon,
  TeamIcon,
  XIcon,
} from "../ui/Icons";
import { useSidebar } from "../../context/SidebarContext";

const SECTION_ICONS: Record<string, ReactNode> = {
  Overview: <OverviewIcon />,
  Agente_IA: <AgentIcon />,
  Backend_Net: <BackendIcon />,
  Base_De_Datos: <BaseDeDatosIcon/>,
  Frontend_React: <FrontendIcon />,
  Bitacora: <BitacoraIcon />,
  Team: <TeamIcon />,
};

export function Sidebar() {
  const bySection = getDocsBySection();
  const params = useParams();
  const activeSlug = params["*"];
  const location = useLocation();
  const { isSidebarOpen, closeSidebar } = useSidebar();

  return (
    <aside className={`sidebar ${isSidebarOpen ? 'sidebar-open' : ''}`}>
      <div className="sidebar-header">
        <span className="sidebar-header-title">Navegación</span>
        <button className="sidebar-close-btn" onClick={closeSidebar}>
          <XIcon />
        </button>
      </div>
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
                  onClick={closeSidebar}
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
                          onClick={closeSidebar}
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