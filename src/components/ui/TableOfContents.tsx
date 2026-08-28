import type { TocItem } from "../../utils/toc";
import { useState, useEffect } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "./Icons";

export function TableOfContents({ items }: { items: TocItem[] }) {
  if (items.length === 0) return null;

  const [activeId, setActiveId] = useState<string>("");
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { threshold: 0.1, rootMargin: "-20% 0px -70% 0px" }
    );

    items.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [items]);

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }

  function toggleCollapse() {
    setIsCollapsed(!isCollapsed);
  }

  return (
    <aside className={`toc ${isCollapsed ? "toc-collapsed" : ""}`}>
      <div className="toc-header">
        {!isCollapsed && <h4 className="toc-title">En esta página</h4>}
        <button 
          className="toc-toggle-btn"
          onClick={toggleCollapse}
          aria-label={isCollapsed ? "Expandir tabla de contenidos" : "Contraer tabla de contenidos"}
          title={isCollapsed ? "Expandir" : "Contraer"}
        >
          {isCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </button>
      </div>
      
      {!isCollapsed && (
        <ul className="toc-list">
          {items.map((item) => (
            <li key={item.id} className={`toc-level-${item.level}`}>
              <button
                onClick={() => scrollTo(item.id)}
                className={activeId === item.id ? "toc-active" : ""}
              >
                {item.text}
              </button>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}