import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { SearchModal } from "./SearchModal";
import { useTheme } from "../context/ThemeContext";
import { SearchIcon, SunIcon, MoonIcon, UserAvatarIcon } from "./Icons";
import { NexusLogo } from "./NexusLogo";

export function TopBar() {
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
        <Link to="/" className="topbar-logo-link" style={{ textDecoration: "none" }}>
          <NexusLogo />
          <span className="topbar-logo-badge">Docs</span>
        </Link>
      </div>

      <div className="topbar-center">
        <button className="topbar-search-btn" onClick={() => setSearchOpen(true)}>
          <SearchIcon className="topbar-search-icon" />
          <span>Search documentation...</span>
          <span className="topbar-search-shortcut">⌘K</span>
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

        <div className="topbar-avatar" title="Usuario NexusOdonto">
          <UserAvatarIcon width="16" height="16" />
        </div>
      </div>

      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  );
}