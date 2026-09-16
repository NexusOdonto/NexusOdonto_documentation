import { useTheme } from "../../context/ThemeContext";

export function NexusLogoIcon({
  size = 34,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <img
      src="/favicon.svg"
      alt="NexusOdonto Logo"
      width={size}
      height={size}
      className={`nexus-logo-icon ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        objectFit: "contain",
        flexShrink: 0,
        filter: isDark
          ? "brightness(1.25) contrast(1.1) drop-shadow(0 0 8px rgba(139, 184, 162, 0.45))"
          : "brightness(0.95) contrast(1.08) drop-shadow(0 1px 3px rgba(0, 0, 0, 0.15))",
        transition: "filter 0.3s ease, transform 0.2s ease",
      }}
    />
  );
}

export function NexusLogo({ showText = true }: { showText?: boolean }) {
  return (
    <div
      className="nexus-logo-wrapper"
      style={{ display: "inline-flex", alignItems: "center", gap: "10px" }}
    >
      <NexusLogoIcon size={34} />
      {showText && (
        <span
          className="nexus-logo-text"
          style={{
            fontSize: "18px",
            fontWeight: 800,
            color: "var(--color-text)",
            letterSpacing: "-0.03em",
            fontFamily: "var(--font-main)",
            lineHeight: 1,
          }}
        >
          Nexus
          <span style={{ color: "var(--color-primary-light)", fontWeight: 800 }}>
            Odonto
          </span>
        </span>
      )}
    </div>
  );
}