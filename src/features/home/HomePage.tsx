import { Link } from "react-router-dom";
import {
  ArrowRightIcon,
  GithubIcon,
} from "../../components/ui/Icons";

export function HomePage() {
  return (
    <div className="home-page">
      <section className="home-hero">
        <h1 className="home-hero-title">
          Plataforma de Documentación <span className="home-hero-brand">NexusOdonto</span>
        </h1>

        <p className="home-hero-subtitle">
          Centraliza toda la documentación técnica del proyecto. Guías, referencias API, arquitectura y recursos para el equipo de desarrollo en un solo lugar.
        </p>

        <div className="home-hero-actions">
          <Link to="/docs/overview/introduccion" className="btn-primary">
            <span>Explorar Documentación</span>
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

      {/* Imagen destacada debajo del Hero */}
      <div className="home-hero-image-container">
        <img
          src="/fondo.jpg"
          alt="Plataforma de Documentación NexusOdonto"
          className="home-hero-image"
        />
      </div>
    </div>
  );
}