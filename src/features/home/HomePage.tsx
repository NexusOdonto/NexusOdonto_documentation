import { Link } from "react-router-dom";
import {
  ArrowRightIcon,
  GithubIcon,
  BackendIcon,
  UserAvatarIcon,
  FrontendIcon,
  BitacoraIcon,
} from "../../components/ui/Icons";

export function HomePage() {
  const bentoCards = [
    {
      title: "01. Arquitectura & Stack",
      description: "Clean Architecture en .NET 8, Oracle Database 19c/23ai, React 18 SPA y orquestación con Docker Compose.",
      link: "/docs/01_arquitectura_y_entorno/01_vision_general_y_stack",
      badge: "Core & Backend",
      icon: <BackendIcon />,
    },
    {
      title: "02. Roles y Permisos (RBAC)",
      description: "Matriz canónica de roles (AD001, OD001, RC001), SeedAdminGuard, segregación estricta y Google OAuth.",
      link: "/docs/02_roles_y_permisos/01_matriz_roles_y_permisos",
      badge: "Seguridad & Auth",
      icon: <UserAvatarIcon />,
    },
    {
      title: "03. Módulos Frontend & Odontograma",
      description: "Odontograma FDI de 5 superficies, Agenda en hora Colombia, motor de PDFs y animaciones con motion/react.",
      link: "/docs/03_modulos_frontend/02_odontograma_fdi_interactivo",
      badge: "Frontend UI/UX",
      icon: <FrontendIcon />,
    },
    {
      title: "05. Bitácoras de Desarrollo (Dailies)",
      description: "18 bitácoras cronológicas día a día (lunes a viernes) con registro detallado de commits y decisiones técnicas.",
      link: "/bitacora",
      badge: "Historial Activo",
      icon: <BitacoraIcon />,
    },
  ];

  return (
    <div className="home-page">
      {/* HERO SECTION */}
      <section className="home-hero">
        <h1 className="home-hero-title">
          Plataforma de Documentación <br />
          <span className="home-hero-brand">NexusOdonto</span>
        </h1>

        <p className="home-hero-subtitle">
          Centraliza la arquitectura técnica, catálogo de endpoints REST, modelos clínicos de base de datos, guías de seguridad RBAC y las bitácoras diarias de desarrollo en un solo portal interactivo.
        </p>

        <div className="home-hero-actions">
          <Link to="/docs/01_arquitectura_y_entorno/01_vision_general_y_stack" className="btn-primary">
            <span>Explorar Documentación</span>
            <ArrowRightIcon />
          </Link>

          <Link to="/bitacora" className="btn-outline">
            <BitacoraIcon />
            <span>Ver Bitácora Diaria</span>
          </Link>

          <a
            href="https://github.com/NexusOdonto"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary"
          >
            <GithubIcon />
            <span>GitHub</span>
          </a>
        </div>
      </section>

      {/* MARCO TECNOLÓGICO GLASSMORPHISM (SHOWCASE) */}
      <section className="home-hero-showcase">
        <div className="home-tech-card">
          <div className="home-tech-card-header">
            <div className="home-tech-card-dots">
              <span className="dot dot-red" />
              <span className="dot dot-yellow" />
              <span className="dot dot-green" />
            </div>
            <div className="home-tech-card-address">
              <span>https://docs.nexusodonto.com/v2.0-stable</span>
            </div>
            <div className="home-tech-card-status">
              <span className="status-live-dot" />
              <span>Online</span>
            </div>
          </div>

          <div className="home-tech-card-body mascot-layout">
            <div className="mascot-info-col">
              <div className="mascot-badge-row">
                <span className="home-mascot-badge">⭐ Mascota Oficial del Equipo</span>
                <span className="mascot-status-pill">🐾 Guardián Activo</span>
              </div>
              
              <h2 className="mascot-title">Líder NexusOdonto</h2>
              
              <p className="home-mascot-caption">
                Líder espiritual y guardián del código clínico de NexusOdonto 🐾✨
              </p>

              <div className="mascot-stats-grid">
                <div className="mascot-stat-item">
                  <span className="mascot-stat-icon">🛡️</span>
                  <div>
                    <span className="mascot-stat-label">Supervisión</span>
                    <span className="mascot-stat-value">Código 100% libre de bugs</span>
                  </div>
                </div>
                <div className="mascot-stat-item">
                  <span className="mascot-stat-icon">⚡</span>
                  <div>
                    <span className="mascot-stat-label">Energía del Equipo</span>
                    <span className="mascot-stat-value">Siempre al 100%</span>
                  </div>
                </div>
                <div className="mascot-stat-item">
                  <span className="mascot-stat-icon">🦷</span>
                  <div>
                    <span className="mascot-stat-label">Ecosistema Clínico</span>
                    <span className="mascot-stat-value">Protegido & Seguro</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mascot-media-col">
              <div className="mascot-photo-frame">
                <img
                  src="/lider.jpg"
                  alt="Mascota Oficial NexusOdonto"
                  className="mascot-photo-img"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BENTO GRID DE ACCESOS RÁPIDOS */}
      <section className="home-bento-section">
        <div className="home-bento-header">
          <span className="home-bento-tag">NAVEGACIÓN RÁPIDA</span>
          <h2 className="home-bento-title">Módulos y Recursos Principales</h2>
          <p className="home-bento-subtitle">Accede directamente a las guías técnicas esenciales del proyecto</p>
        </div>

        <div className="home-bento-grid">
          {bentoCards.map((card) => (
            <Link key={card.title} to={card.link} className="home-bento-card">
              <div className="home-bento-card-top">
                <div className="home-bento-icon">{card.icon}</div>
                <span className="home-bento-badge">{card.badge}</span>
              </div>
              <h3 className="home-bento-card-title">{card.title}</h3>
              <p className="home-bento-card-desc">{card.description}</p>
              <div className="home-bento-card-footer">
                <span>Consultar módulo</span>
                <ArrowRightIcon className="bento-arrow" />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}