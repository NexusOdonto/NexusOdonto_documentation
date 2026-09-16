import type { TocItem } from "../../utils/toc";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
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
      { threshold: 0.1, rootMargin: "-10% 0px -70% 0px" }
    );

    items.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [items]);

  function scrollTo(id: string) {
    setActiveId(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  const toggleCollapse = () => {
    setIsCollapsed((prev) => !prev);
  };

  return (
    <aside
      className={`toc ${isCollapsed ? "toc-collapsed" : ""}`}
      aria-label="Tabla de contenidos de esta página"
    >
      <div className="toc-header" onClick={toggleCollapse} title={isCollapsed ? "Desplegar tabla" : "Recoger tabla"}>
        <div className="toc-header-left">
          <div className="toc-header-indicator" />
          {!isCollapsed && <h4 className="toc-title">En esta página</h4>}
        </div>

        <button
          type="button"
          className="toc-collapse-toggle"
          onClick={(e) => {
            e.stopPropagation();
            toggleCollapse();
          }}
          aria-label={isCollapsed ? "Desplegar tabla de contenidos" : "Recoger tabla de contenidos"}
          title={isCollapsed ? "Desplegar" : "Recoger"}
        >
          {isCollapsed ? <ChevronLeftIcon /> : <ChevronRightIcon style={{ transform: "rotate(90deg)" }} />}
        </button>
      </div>

      <AnimatePresence initial={false}>
        {!isCollapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.34, 1.56, 0.64, 1] }}
            style={{ overflow: "hidden" }}
          >
            <ul className="toc-list">
              {items.map((item) => (
                <li key={item.id} className={`toc-item toc-level-${item.level}`}>
                  <motion.button
                    type="button"
                    onClick={() => scrollTo(item.id)}
                    whileHover={{ x: 5, scale: 1.012 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 420, damping: 26 }}
                    className={`toc-link ${activeId === item.id ? "toc-active" : ""}`}
                  >
                    {item.level === 3 && <span className="toc-bullet">•</span>}
                    <span className="toc-text">{item.text}</span>
                  </motion.button>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </aside>
  );
}