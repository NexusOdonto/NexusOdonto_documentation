import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { searchDocs } from "../lib/search";
import { SPECIAL_SECTIONS } from "../lib/sectionConfig";
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
      setTimeout(() => {
        setQuery("");
        inputRef.current?.focus();
      }, 50);
    }
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

  return (
    <div className="search-overlay" onClick={onClose}>
      <div className="search-modal" onClick={(e) => e.stopPropagation()}>
        <div className="search-modal-header">
          <SearchIcon className="search-modal-icon" />
          <input
            ref={inputRef}
            className="search-input"
            type="text"
            placeholder="Search documentation, guides, and API..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <span className="search-modal-esc" onClick={onClose}>ESC</span>
        </div>

        <div className="search-results">
          {query.trim() === "" ? (
            <div className="search-empty-state">
              <span className="search-category-label">RECOMENDADO</span>
              <div className="search-suggestions">
                <button
                  className="search-suggestion-btn"
                  onClick={() => goTo("Backend_Net", "backend_net/arquitectura-backend")}
                >
                  Arquitectura del Backend .NET
                </button>
                <button
                  className="search-suggestion-btn"
                  onClick={() => goTo("Agente_IA", "agente_ia/agente-ia-config")}
                >
                  Configuración del Agente IA
                </button>
                <button
                  className="search-suggestion-btn"
                  onClick={() => goTo("Frontend_React", "frontend_react/componentes-ui")}
                >
                  Componentes Frontend React
                </button>
              </div>
            </div>
          ) : results.length === 0 ? (
            <p className="search-hint">Sin resultados para "{query}"</p>
          ) : (
            <div className="search-matches-group">
              <span className="search-category-label">DOCUMENTATION MATCHES</span>
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
            <kbd className="kbd-pill">↵</kbd> to select
          </span>
          <span className="search-footer-hint">
            <kbd className="kbd-pill">↑↓</kbd> to navigate
          </span>
          <span className="search-footer-engine">SEARCH ENGINE</span>
        </div>
      </div>
    </div>
  );
}