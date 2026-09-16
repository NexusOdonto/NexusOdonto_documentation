import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { searchDocs } from "../../utils/search";
import { SPECIAL_SECTIONS } from "../../utils/sectionConfig";
import { SearchIcon } from "./Icons";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const results = searchDocs(query);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setTimeout(() => {
        setQuery("");
        inputRef.current?.focus();
      }, 50);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  function goTo(sectionKey: string, slug: string) {
    const special = SPECIAL_SECTIONS[sectionKey];
    navigate(special || `/docs/${slug}`);
    onClose();
  }

  return createPortal(
    <div className="search-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="search-modal" onClick={(e) => e.stopPropagation()}>
        <div className="search-modal-header">
          <SearchIcon className="search-modal-icon" />
          <input
            ref={inputRef}
            className="search-input"
            type="text"
            placeholder="Buscar guías, endpoints, roles, arquitectura..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <span className="search-modal-esc" onClick={onClose}>ESC</span>
        </div>

        <div className="search-results">
          {query.trim() === "" ? (
            <div className="search-empty-state">
              <span className="search-category-label">ACCESOS RÁPIDOS SUGERIDOS</span>
              <div className="search-suggestions">
                <button
                  className="search-suggestion-btn"
                  onClick={() => goTo("01_Arquitectura_y_Entorno", "01_arquitectura_y_entorno/01_vision_general_y_stack")}
                >
                  📘 01. Visión General y Stack Tecnológico
                </button>
                <button
                  className="search-suggestion-btn"
                  onClick={() => goTo("02_Roles_y_Permisos", "02_roles_y_permisos/01_matriz_roles_y_permisos")}
                >
                  🔐 02. Matriz Canónica de Roles y Credenciales
                </button>
                <button
                  className="search-suggestion-btn"
                  onClick={() => goTo("03_Modulos_Frontend", "03_modulos_frontend/02_odontograma_fdi_interactivo")}
                >
                  🦷 03. Odontograma FDI Interactivo (5 Superficies)
                </button>
                <button
                  className="search-suggestion-btn"
                  onClick={() => goTo("04_API_y_Servicios", "04_api_y_servicios/01_autenticacion_y_perfil_api")}
                >
                  ⚡ 04. API de Autenticación, Perfil y OAuth
                </button>
                <button
                  className="search-suggestion-btn"
                  onClick={() => {
                    navigate("/bitacora");
                    onClose();
                  }}
                >
                  📅 05. Bitácoras de Desarrollo (18 Días Hábiles)
                </button>
              </div>
            </div>
          ) : results.length === 0 ? (
            <p className="search-hint">Sin resultados para "{query}"</p>
          ) : (
            <div className="search-matches-group">
              <span className="search-category-label">RESULTADOS ENCONTRADOS ({results.length})</span>
              {results.map((r) => (
                <button
                  key={r.doc.slug}
                  className="search-result-item"
                  onClick={() => goTo(r.doc.section, r.doc.slug)}
                >
                  <div className="search-result-top">
                    <span className="search-result-title">{r.doc.title}</span>
                    <span className="search-result-section-badge">{r.doc.section}</span>
                  </div>
                  <span className="search-result-snippet">{r.snippet}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="search-modal-footer">
          <span className="search-footer-hint">
            <kbd className="kbd-pill">↵</kbd> Seleccionar
          </span>
          <span className="search-footer-hint">
            <kbd className="kbd-pill">ESC</kbd> Cerrar
          </span>
          <span className="search-footer-engine">NEXUS SEARCH ENGINE</span>
        </div>
      </div>
    </div>,
    document.body
  );
}