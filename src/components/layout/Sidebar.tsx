import { useState, useEffect, useMemo, type ReactNode } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { getDocsBySection, normalizeSlug } from "../../utils/loadDocs";
import { SECTION_ORDER, SECTION_LABELS, SPECIAL_SECTIONS } from "../../utils/sectionConfig";
import {
  OverviewIcon,
  AgentIcon,
  BackendIcon,
  BaseDeDatosIcon,
  FrontendIcon,
  BitacoraIcon,
  TeamIcon,
  UserAvatarIcon,
  CodeIcon,
  XIcon,
  ChevronRightIcon,
} from "../ui/Icons";
import { NexusLogo } from "../ui/NexusLogo";
import { useSidebar } from "../../context/SidebarContext";

const SECTION_ICONS: Record<string, ReactNode> = {
  Overview: <OverviewIcon />,
  "01_Arquitectura_y_Entorno": <BackendIcon />,
  "02_Roles_y_Permisos": <UserAvatarIcon />,
  "03_Modulos_Frontend": <FrontendIcon />,
  "04_API_y_Servicios": <CodeIcon />,
  "05_Bitacora_de_Commits_y_Dailies": <BitacoraIcon />,
  Agente_IA: <AgentIcon />,
  Backend_Net: <BackendIcon />,
  Base_De_Datos: <BaseDeDatosIcon />,
  Frontend_React: <FrontendIcon />,
  Team: <TeamIcon />,
};

export function Sidebar() {
  const bySection = useMemo(() => getDocsBySection(), []);
  const params = useParams();
  const rawActiveSlug = params["*"] || "";
  const normActiveSlug = rawActiveSlug ? normalizeSlug(decodeURIComponent(rawActiveSlug)) : "";
  const location = useLocation();
  const { isSidebarOpen, closeSidebar, isCollapsed, toggleCollapse, setCollapsed } = useSidebar();

  // Detección de viewport para no aplicar modo icono colapsado en Drawer móvil
  const [isDesktop, setIsDesktop] = useState(
    typeof window !== "undefined" ? window.innerWidth >= 1024 : true
  );

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const effectivelyCollapsed = isCollapsed && isDesktop;

  // Estado para carpetas desplegables
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  // Atajo de teclado: Ctrl + B para recoger / desplegar sidebar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "b") {
        e.preventDefault();
        if (window.innerWidth >= 1024) {
          toggleCollapse();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleCollapse]);

  // Auto-expandir la carpeta que contiene el documento activo
  useEffect(() => {
    if (normActiveSlug) {
      for (const section of SECTION_ORDER) {
        const docs = bySection[section] || [];
        if (
          docs.some((d) => {
            const docNorm = normalizeSlug(d.slug);
            return (
              docNorm === normActiveSlug ||
              docNorm.endsWith(normActiveSlug) ||
              normActiveSlug.endsWith(docNorm) ||
              d.slug.toLowerCase() === rawActiveSlug.toLowerCase()
            );
          })
        ) {
          setOpenSections((prev) => ({ ...prev, [section]: true }));
          break;
        }
      }
    }
  }, [normActiveSlug, rawActiveSlug, bySection]);

  const toggleSection = (section: string) => {
    if (effectivelyCollapsed) {
      setCollapsed(false);
      setOpenSections((prev) => ({ ...prev, [section]: true }));
      return;
    }
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <aside
      className={`sidebar ${isSidebarOpen ? "sidebar-open" : ""} ${effectivelyCollapsed ? "sidebar-collapsed" : ""}`}
      aria-label="Navegación de módulos"
    >
      {/* Cabecera del Sidebar */}
      <div className="sidebar-top-bar">
        <div className="sidebar-brand-mobile mobile-only">
          <NexusLogo />
          <span className="sidebar-brand-badge">Docs</span>
        </div>

        {!effectivelyCollapsed && <span className="sidebar-top-title desktop-only">Navegación</span>}

        {/* Botón de cerrar solo en móvil */}
        <button
          type="button"
          className="sidebar-close-btn mobile-only"
          onClick={closeSidebar}
          aria-label="Cerrar menú"
        >
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
                  title={effectivelyCollapsed ? label : undefined}
                >
                  <motion.span
                    className="sidebar-item-icon"
                    whileHover={{ scale: 1.15, rotate: effectivelyCollapsed ? 6 : 0 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {icon}
                  </motion.span>
                  {!effectivelyCollapsed && <span className="sidebar-item-label">{label}</span>}
                </Link>
              </div>
            );
          }

          const docs = bySection[section] || [];
          const isSectionActive = docs.some((d) => normalizeSlug(d.slug) === normActiveSlug);
          const isOpen = !!openSections[section] && !effectivelyCollapsed;

          return (
            <div key={section} className="sidebar-section">
              <button
                type="button"
                className={`sidebar-section-header ${isSectionActive ? "active-group" : ""}`}
                onClick={() => toggleSection(section)}
                aria-expanded={isOpen}
                title={effectivelyCollapsed ? label : undefined}
              >
                <motion.span
                  className="sidebar-item-icon"
                  whileHover={{ scale: 1.15, rotate: effectivelyCollapsed ? 6 : 0 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {icon}
                </motion.span>
                {!effectivelyCollapsed && (
                  <>
                    <span className="sidebar-section-title">{label}</span>
                    <ChevronRightIcon className={`sidebar-chevron ${isOpen ? "open" : ""}`} />
                  </>
                )}
              </button>

              <AnimatePresence initial={false}>
                {isOpen && !effectivelyCollapsed && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: [0.34, 1.56, 0.64, 1] }}
                    style={{ overflow: "hidden" }}
                  >
                    {docs.length === 0 ? (
                      <p className="sidebar-empty">Sin documentos</p>
                    ) : (
                      <ul className="sidebar-list">
                        {docs.map((doc) => {
                          const docNorm = normalizeSlug(doc.slug);
                          const isActive = docNorm === normActiveSlug;
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
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </nav>
    </aside>
  );
}