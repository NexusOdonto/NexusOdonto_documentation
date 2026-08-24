import type { TocItem } from "../lib/toc";

export function TableOfContents({ items }: { items: TocItem[] }) {
  if (items.length === 0) return null;

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <aside className="toc">
      <h4 className="toc-title">En esta página</h4>
      <ul>
        {items.map((item) => (
          <li key={item.id} className={`toc-level-${item.level}`}>
            <button onClick={() => scrollTo(item.id)}>{item.text}</button>
          </li>
        ))}
      </ul>
    </aside>
  );
}