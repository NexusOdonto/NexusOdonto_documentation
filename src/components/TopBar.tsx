import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { SearchModal } from "./SearchModal";
import { useTheme } from "../context/ThemeContext";
import { SearchIcon, SunIcon, MoonIcon, MenuIcon } from "./Icons";
import { NexusLogo } from "./NexusLogo";

interface TopBarProps {
  onMenuClick?: () => void;
  showMenuButton?: boolean;
}

export function TopBar({ onMenuClick, showMenuButton = false }: TopBarProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    function handleShortcut(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    }
    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, []);

  return (
    <header className="topbar">
      <div className="topbar-left">
        {showMenuButton && (
          <button
            className="topbar-action-btn mobile-menu-toggle"
            onClick={onMenuClick}
            title="Abrir menú"
            style={{ marginRight: '8px' }}
          >
            <MenuIcon />
          </button>
        )}
        <Link to="/" className="topbar-logo-link" style={{ textDecoration: "none" }}>
          <NexusLogo />
          <span className="topbar-logo-badge">Docs</span>
        </Link>
      </div>

      <div className="topbar-center">
        <button className="topbar-search-btn" onClick={() => setSearchOpen(true)}>
          <SearchIcon className="topbar-search-icon" />
          <span>Search documentation...</span>
        </button>
      </div>

      <div className="topbar-right">
        <button
          className="topbar-action-btn"
          onClick={toggleTheme}
          title={theme === "dark" ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
        >
          {theme === "dark" ? <SunIcon /> : <MoonIcon />}
        </button>

      </div>

      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  );
}