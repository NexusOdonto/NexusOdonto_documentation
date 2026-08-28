import type { ReactNode } from "react";
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { getDocBySlug } from "../../utils/loadDocs";
import { extractToc, slugify } from "../../utils/toc";
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
                const text = getTextFromChildren(children);
                return <h2 id={slugify(text)} className="article-h2">{children}</h2>;
              },
              h3: ({ children }) => {
                const text = getTextFromChildren(children);
                return <h3 id={slugify(text)} className="article-h3">{children}</h3>;
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