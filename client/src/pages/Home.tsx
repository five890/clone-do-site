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

  // Posições mobile vs desktop
  const overlayTop = isMobile
    ? { top: "0%", left: "5%", width: "90%", height: "32%" }
    : { top: "0%", left: "15%", width: "70%", height: "42%" };

  const communityText = isMobile
    ? { top: "6%", left: "5%", width: "90%", height: "22%", fontSize: "clamp(18px, 6vw, 36px)" }
    : { top: "10%", left: "15%", width: "70%", height: "26%", fontSize: "clamp(22px, 4.5vw, 42px)" };

  const discordBtn = isMobile
    ? { top: "66%", left: "53%", width: "42%", height: "5.5%", minWidth: "120px" }
    : { top: "66%", left: "52%", width: "13%", height: "5.5%", minWidth: "140px" };

  const gapOverlay = isMobile
    ? { top: "72%", left: "30%", width: "40%", height: "4.5%" }
    : { top: "72%", left: "35%", width: "30%", height: "4.5%" };

  const footerOverlay = isMobile
    ? { top: "76%", left: "20%", width: "60%", height: "4%" }
    : { top: "76%", left: "25%", width: "50%", height: "3%" };

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
          {/* ===== OVERLAY ESCURO NO TOPO — cobrindo PROXY IOS ===== */}
          <div
            className="absolute pointer-events-none"
            style={{ ...overlayTop, background: "#060710", zIndex: 40 }}
          />

          {/* ===== COMMUNITY SHELBY — grande, centralizado ===== */}
          <div
            className="absolute flex flex-col items-center justify-center"
            style={{
              top: communityText.top,
              left: communityText.left,
              width: communityText.width,
              height: communityText.height,
              zIndex: 50,
            }}
          >
            <h1
              style={{
                color: "#FFFFFF",
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: communityText.fontSize,
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

          {/* ===== OVERLAY CANAL — quadrado preto com link Discord ===== */}
          <a
            href="https://discord.gg/Bzmjkbt8yP"
            target="_blank"
            rel="noopener noreferrer"
            className="absolute flex items-center justify-center"
            style={{
              top: discordBtn.top,
              left: discordBtn.left,
              width: discordBtn.width,
              height: discordBtn.height,
              background: "#0a0b14",
              borderRadius: "12px",
              border: "1px solid rgba(40, 42, 60, 0.6)",
              zIndex: 50,
              cursor: "pointer",
              textDecoration: "none",
              minWidth: discordBtn.minWidth,
              maxWidth: "200px",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ marginRight: "6px" }}>
              <path
                d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"
                fill="#7289da"
              />
            </svg>
            <span
              style={{
                color: "#b0b4d0",
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: isMobile ? "clamp(8px, 2vw, 12px)" : "clamp(8px, 1vw, 13px)",
                fontWeight: 500,
              }}
            >
              Discord
            </span>
          </a>

          {/* ===== OVERLAY GAP (espaço entre botões e footer) ===== */}
          <div
            className="absolute pointer-events-none"
            style={{ ...gapOverlay, background: "#060710", zIndex: 40 }}
          />

          {/* ===== OVERLAY FOOTER ===== */}
          <div
            className="absolute pointer-events-none"
            style={{ ...footerOverlay, background: "#060710", zIndex: 50 }}
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
