
import { Link } from "react-router-dom";
import {
  ArrowRightIcon,
  GithubIcon,
} from "../components/Icons";

export function HomePage() {

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
    </div>
  );
}