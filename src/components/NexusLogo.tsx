export function NexusLogoIcon({
  size = 36,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <img
      src="/logo-icon.jpg"
      alt="NexusOdonto Icon"
      width={size}
      height={size}
      className={className}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        objectFit: "contain",
        borderRadius: "8px",
        mixBlendMode: "multiply",
        flexShrink: 0,
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
      <NexusLogoIcon size={38} />
      {showText && (
        <span
          className="nexus-logo-text"
          style={{
            fontSize: "20px",
            fontWeight: 800,
            color: "var(--color-text)",
            letterSpacing: "-0.03em",
            fontFamily: "var(--font-main)",
            lineHeight: 1,
          }}
        >
          Nexus<span style={{ color: "var(--color-primary-light)", fontWeight: 800 }}>Odonto</span>
        </span>
      )}
    </div>
  );
}
