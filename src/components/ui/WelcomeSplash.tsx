import { useState, useEffect, useRef } from "react";
import animationVideo from "../../assets/animacion.mp4";

export function WelcomeSplash() {
  const [isVisible, setIsVisible] = useState(true);
  const [isFading, setIsFading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Si ya vio la intro en esta sesión, no volver a mostrar
    const hasSeen = sessionStorage.getItem("nexus_welcome_seen");
    if (hasSeen === "true") {
      setIsVisible(false);
      return;
    }

    // Bloquear scroll durante la animación
    document.body.style.overflow = "hidden";

    // Iniciar reproducción en HD
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // En caso de que el navegador pause autoplay
      });
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const handleFinish = () => {
    if (isFading || !isVisible) return;
    setIsFading(true);
    sessionStorage.setItem("nexus_welcome_seen", "true");

    // Desvanecimiento suave al finalizar completamente el video
    setTimeout(() => {
      setIsVisible(false);
      document.body.style.overflow = "";
    }, 750);
  };

  if (!isVisible) return null;

  return (
    <div className={`welcome-splash ${isFading ? "fading-out" : ""}`}>
      <div className="welcome-splash-content">
        <video
          ref={videoRef}
          src={animationVideo}
          className="welcome-splash-media"
          autoPlay
          muted
          playsInline
          onEnded={handleFinish}
        />
      </div>
    </div>
  );
}
