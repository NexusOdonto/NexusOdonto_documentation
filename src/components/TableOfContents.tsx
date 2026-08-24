import type { TocItem } from "../lib/toc";
import { useState, useEffect } from "react";

export function TableOfContents({ items }: { items: TocItem[] }) {
  if (items.length === 0) return null;

  const [activeId, setActiveId] = useState<string>("");

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

  return (
    <aside className="toc">
      <h4 className="toc-title"> En esta página</h4>
      <ul>
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
    </aside>
  );
}