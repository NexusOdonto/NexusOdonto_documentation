import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { SECTION_ORDER, SECTION_LABELS, SPECIAL_SECTIONS } from "../lib/sectionConfig";
import { getDocsBySection } from "../lib/loadDocs";
import {
  OverviewIcon,
  AgentIcon,
  BackendIcon,
  FrontendIcon,
  BitacoraIcon,
  TeamIcon,
  ArrowRightIcon,
  GithubIcon,
} from "../components/Icons";

const CARD_ICONS: Record<string, { icon: ReactNode; bg: string; color: string; desc: string }> = {
  Overview: {
    icon: <OverviewIcon width="22" height="22" />,
    bg: "#E0F2FE",
    color: "#0284C7",
    desc: "Visión general del sistema, arquitectura y diseño.",
  },
  Agente_IA: {
    icon: <AgentIcon width="22" height="22" />,
    bg: "#D1FAE5",
    color: "#059669",
    desc: "Integración y configuración del agente inteligente.",
  },
  Backend_Net: {
    icon: <BackendIcon width="22" height="22" />,
    bg: "#DBEAFE",
    color: "#1D4ED8",
    desc: "Documentación de la API, modelos de datos y servicios .NET.",
  },
  Frontend_React: {
    icon: <FrontendIcon width="22" height="22" />,
    bg: "#E0E7FF",
    color: "#4338CA",
    desc: "Componentes UI, estado global, rutas y utilidades de React.",
  },
  Bitacora: {
    icon: <BitacoraIcon width="22" height="22" />,
    bg: "#E0F2FE",
    color: "#0369A1",
    desc: "Registro de cambios, decisiones y versiones del proyecto.",
  },
  Team: {
    icon: <TeamIcon width="22" height="22" />,
    bg: "#F1F5F9",
    color: "#475569",
    desc: "Guías de contribución, estándares y miembros del equipo.",
  },
};

export function HomePage() {
  const bySection = getDocsBySection();

  return (
    <div className="home-page">
      <section className="home-hero">

        <h1 className="home-hero-title">
          Sistema de Gestión Clínica <span className="home-hero-brand">NexusOdonto</span>
        </h1>

        <p className="home-hero-subtitle">
          Arquitectura moderna, inteligencia artificial y herramientas de desarrollo para la próxima generación de software odontológico. Explora guías, referencias API y documentación técnica.
        </p>

        <div className="home-hero-actions">
          <Link to="/docs/overview/introduccion" className="btn-primary">
            <span>Comenzar</span>
            <ArrowRightIcon />
          </Link>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary"
          >
            <GithubIcon />
            <span>Ver en GitHub</span>
          </a>
        </div>
      </section>

      <div className="home-cards-grid">
        {SECTION_ORDER.map((section) => {
          const docs = bySection[section] || [];
          const firstDoc = docs[0];
          const specialRoute = SPECIAL_SECTIONS[section];
          const targetUrl = specialRoute || (firstDoc ? `/docs/${firstDoc.slug}` : "#");
          const cardMeta = CARD_ICONS[section] || {
            icon: <OverviewIcon width="22" height="22" />,
            bg: "#E0F2FE",
            color: "#1E40AF",
            desc: "Documentación y especificaciones técnicas.",
          };

          return (
            <Link key={section} to={targetUrl} className="home-card">
              <div
                className="home-card-icon-box"
                style={{ backgroundColor: cardMeta.bg, color: cardMeta.color }}
              >
                {cardMeta.icon}
              </div>

              <h3 className="home-card-title">{SECTION_LABELS[section] || section}</h3>
              <p className="home-card-desc">{cardMeta.desc}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}