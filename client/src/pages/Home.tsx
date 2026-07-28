import { useEffect, useRef, useState, useCallback } from "react";

export default function Home() {
  const [iframeReady, setIframeReady] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  const onIframeLoad = useCallback(() => {
    setIframeReady(true);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setIframeReady(true), 4000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Bloquear scroll
  useEffect(() => {
    const handler = () => window.scrollTo(0, 0);
    const interval = setInterval(handler, 300);
    window.addEventListener("scroll", handler);
    return () => {
      clearInterval(interval);
      window.removeEventListener("scroll", handler);
    };
  }, []);

  const bgColor = "#060710";

  // Top overlay: cobre tudo do topo até o início do card (escudo, PROXY IOS, Painel de Ativação)
  // E também as laterais azuis
  const topOverlayDesktop = { top: "0%", left: "0%", width: "100%", height: "38%" };
  const bottomOverlayDesktop = { top: "64%", left: "0%", width: "100%", height: "36%" };

  const topOverlayMobile = { top: "0%", left: "0%", width: "100%", height: "28%" };
  const bottomOverlayMobile = { top: "64%", left: "0%", width: "100%", height: "36%" };

  const topOverlay = isMobile ? topOverlayMobile : topOverlayDesktop;
  const bottomOverlay = isMobile ? bottomOverlayMobile : bottomOverlayDesktop;

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-background select-none">
      {/* Iframe do site original */}
      <iframe
        ref={iframeRef}
        src="https://freefireproxy.com.br/ativar"
        className="h-full w-full border-0"
        title="Painel de Ativação"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
        scrolling="no"
        onLoad={onIframeLoad}
      />

      {iframeReady && (
        <>
          {/* ===== OVERLAY ESCURO NO TOPO — cobrindo PROXY IOS + escudo + laterais ===== */}
          <div
            className="absolute pointer-events-none"
            style={{ ...topOverlay, background: bgColor, zIndex: 40 }}
          />

          {/* ===== COMMUNITY SHELBY — grande, centralizado ===== */}
          <div
            className="absolute flex flex-col items-center justify-center"
            style={{
              top: isMobile ? "4%" : "8%",
              left: "0%",
              width: "100%",
              height: isMobile ? "22%" : "26%",
              zIndex: 50,
            }}
          >
            <h1
              style={{
                color: "#FFFFFF",
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: isMobile ? "clamp(18px, 6vw, 36px)" : "clamp(22px, 4.5vw, 42px)",
                fontWeight: 800,
                letterSpacing: "0.02em",
                lineHeight: 1.1,
                textShadow: "0 0 30px rgba(130, 140, 255, 0.3)",
              }}
              className="text-center uppercase"
            >
              Community Shelby
            </h1>
            <p
              style={{
                color: "rgba(180, 185, 220, 0.5)",
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: isMobile ? "clamp(8px, 2vw, 12px)" : "clamp(9px, 1.2vw, 14px)",
                letterSpacing: "0.35em",
                marginTop: "6px",
              }}
              className="text-center uppercase"
            >
              Painel de Ativação
            </p>
          </div>

          {/* ===== OVERLAY ESCURO EMBAIXO — cobrindo Certificado, CANAL, Footer, laterais ===== */}
          <div
            className="absolute pointer-events-none"
            style={{ ...bottomOverlay, background: bgColor, zIndex: 40 }}
          />
        </>
      )}

      {/* Loading state */}
      {!iframeReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-background">
          <div className="flex flex-col items-center gap-3">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
            <p className="text-sm text-muted-foreground" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Carregando painel...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
