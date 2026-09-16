import type { ReactNode } from "react";
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { getDocBySlug, normalizeSlug } from "../../utils/loadDocs";
import { extractToc, slugify, cleanHeaderText } from "../../utils/toc";
import { TableOfContents } from "../../components/ui/TableOfContents";
import { CheckCircleIcon, InfoIcon, CopyIcon } from "../../components/ui/Icons";

function getTextFromChildren(children: ReactNode): string {
  if (typeof children === "string" || typeof children === "number") {
    return String(children);
  }
  if (Array.isArray(children)) {
    return children.map(getTextFromChildren).join("");
  }
  if (children && typeof children === "object" && "props" in children) {
    const props = (children as { props?: { children?: ReactNode } }).props;
    if (props && props.children) {
      return getTextFromChildren(props.children);
    }
  }
  return "";
}

export function ArticlePage() {
  const params = useParams();
  const rawSlug = params["*"] || "";
  const doc = rawSlug ? getDocBySlug(rawSlug) : undefined;
  const [copiedCodeIndex, setCopiedCodeIndex] = useState<number | null>(null);

  // Restablecer scroll al tope cada vez que se cambia de documento
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [rawSlug]);

  if (!doc) {
    return (
      <div className="article-not-found">
        <h2>Documento no encontrado</h2>
        <p>No existe contenido para la ruta "{rawSlug}".</p>
        <Link to="/" className="btn-primary" style={{ display: "inline-flex", marginTop: "16px" }}>
          ← Volver al inicio
        </Link>
      </div>
    );
  }

  const toc = extractToc(doc.content);

  function copyCodeText(text: string, index: number) {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(text);
    }
    setCopiedCodeIndex(index);
    setTimeout(() => setCopiedCodeIndex(null), 2000);
  }

  let codeBlockCounter = 0;

  return (
    <div className="article-page-wrapper">
      <article className="article-page">
        <nav className="breadcrumbs">
          <Link to="/">Home</Link>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-section">{doc.section.replace(/_/g, " ")}</span>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">{doc.title}</span>
        </nav>

        <h1 className="article-title">{doc.title}</h1>
        {doc.author && (
          <p className="article-meta">
            Por <strong className="article-author">{doc.author}</strong>
            {doc.date ? ` · ${doc.date}` : ""}
          </p>
        )}

        <div className="article-body">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
            components={{
              h2: ({ children }) => {
                const rawText = getTextFromChildren(children);
                const clean = cleanHeaderText(rawText);
                return (
                  <h2 id={slugify(clean)} className="article-h2" style={{ scrollMarginTop: "80px" }}>
                    {children}
                  </h2>
                );
              },
              h3: ({ children }) => {
                const rawText = getTextFromChildren(children);
                const clean = cleanHeaderText(rawText);
                return (
                  <h3 id={slugify(clean)} className="article-h3" style={{ scrollMarginTop: "80px" }}>
                    {children}
                  </h3>
                );
              },
              a: ({ href, children, ...rest }) => {
                if (href && !href.startsWith("http") && !href.startsWith("#") && !href.startsWith("mailto:")) {
                  // Limpiar ruta interna hacia /docs/...
                  const cleanHref = href.replace(/\.md$/, "").replace(/^\.\//, "");
                  const targetSlug = cleanHref.startsWith("/") ? cleanHref : `/docs/${normalizeSlug(cleanHref)}`;
                  return (
                    <Link to={targetSlug} {...rest}>
                      {children}
                    </Link>
                  );
                }
                return (
                  <a href={href} target={href?.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" {...rest}>
                    {children}
                  </a>
                );
              },
              blockquote: ({ children }) => {
                const text = getTextFromChildren(children);

                const isImportant = text.includes("[!IMPORTANT]") || text.includes("Nota sobre");
                const titleMatch = text.match(/\[!(NOTE|IMPORTANT|TIP)\]\s*(.*)/i);
                const titleText = titleMatch && titleMatch[2]
                  ? titleMatch[2]
                  : isImportant
                  ? "Nota sobre Validaciones"
                  : "Consejos Clave";

                return (
                  <div className={`callout-box ${isImportant ? "callout-important" : "callout-note"}`}>
                    <div className="callout-header">
                      {isImportant ? <InfoIcon className="callout-icon" /> : <CheckCircleIcon className="callout-icon" />}
                      <span className="callout-title">{titleText}</span>
                    </div>
                    <div className="callout-content">{children}</div>
                  </div>
                );
              },
              code: (props) => {
                const { children, className, ...rest } = props;
                const match = /language-(\w+)/.exec(className || "");
                const isInline = !match && !className?.includes("hljs");

                // Extrae el texto plano sin importar si rehypeHighlight convirtió children en objetos
                const rawCodeText = getTextFromChildren(children);
                const codeString = rawCodeText.replace(/\n$/, "");

                if (isInline) {
                  return (
                    <code className="inline-code" {...rest}>
                      {children}
                    </code>
                  );
                }

                const blockIdx = ++codeBlockCounter;
                const isCopied = copiedCodeIndex === blockIdx;

                const lines = codeString.split("\n");
                const firstLine = lines[0] || "";
                const filenameMatch = firstLine.match(/^\/\/\s*(.+)$/);
                const fileName = filenameMatch ? filenameMatch[1] : "CodeSnippet.cs";

                return (
                  <div className="code-window">
                    <div className="code-window-header">
                      <div className="code-window-dots">
                        <span className="dot dot-red"></span>
                        <span className="dot dot-yellow"></span>
                        <span className="dot dot-green"></span>
                        <span className="code-window-filename">{fileName}</span>
                      </div>

                      <button
                        className="code-copy-btn"
                        onClick={() => copyCodeText(codeString, blockIdx)}
                      >
                        <CopyIcon className="copy-icon" />
                        <span>{isCopied ? "¡Copiado!" : "Copy"}</span>
                      </button>
                    </div>

                    <pre className="code-pre">
                      <code className={className} {...rest}>
                        {children}
                      </code>
                    </pre>
                  </div>
                );
              },
            }}
          >
            {doc.content}
          </ReactMarkdown>
        </div>
      </article>

      <TableOfContents items={toc} />
    </div>
  );
}