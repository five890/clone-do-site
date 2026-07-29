import { useEffect, useRef, useState, useCallback } from "react";

export default function Home() {
  const [iframeReady, setIframeReady] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Detectar teclado virtual (viewport shrink)
  const [keyboardShift, setKeyboardShift] = useState(0);
  const initialHeightRef = useRef(window.innerHeight);

  // Detectar quando o WhatsApp aparece (após clicar em ATIVAR)
  const [activatedState, setActivatedState] = useState(false);
  const activationTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const onIframeLoad = useCallback(() => {
    setIframeReady(true);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setIframeReady(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  // Detectar quando o teclado virtual sobe (viewport encolhe)
  useEffect(() => {
    const initialH = window.innerHeight;
    initialHeightRef.current = initialH;

    const handleResize = () => {
      const currentH = window.innerHeight;
      const diff = initialH - currentH;
      if (diff > 100) {
        const shiftPercent = (diff / initialH) * 100;
        setKeyboardShift(shiftPercent);
      } else {
        setKeyboardShift(0);
      }
    };

    window.addEventListener("resize", handleResize);
    const interval = setInterval(handleResize, 500);
    return () => {
      window.removeEventListener("resize", handleResize);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
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

  // Efeito do teclado nos overlays e iframe
  const keyboardEffect = keyboardShift > 0 ? keyboardShift : 0;

  // Quando ativado (WhatsApp sobe), sobe os overlays junto
  const activationEffect = activatedState ? 32 : 0;

  // Scale e translateY do iframe
  const scaleVal = isMobile ? 1.09 : 1.08;
  const translateYBase = isMobile ? -18 : -20;
  const translateYTotal = translateYBase + keyboardEffect * 0.5 - activationEffect * 0.3;

  // Top overlay: cobre PROXY IOS + escudo
  const topOverlayHeight = isMobile ? 28 - keyboardEffect * 0.3 - activationEffect * 0.2 : 26 - keyboardEffect * 0.3 - activationEffect * 0.2;

  // Bottom overlay: sobe quando WhatsApp aparece
  const bottomOverlayTop = isMobile
    ? Math.max(24, 54 - keyboardEffect * 0.8 - activationEffect * 0.65)
    : Math.max(22, 52 - keyboardEffect * 0.8 - activationEffect * 0.65);

  const bottomOverlayHeight = 100 - bottomOverlayTop + 12;

  // Posição do botão ATIVAR no viewport (relativo à viewport)
  // O botão está ~42-48% vertical, ~20-80% horizontal
  const activateBtnTop = isMobile ? 43 : 42;
  const activateBtnHeight = 5;

  // Handler para o overlay invisível sobre o botão ATIVAR
  const handleActivateClick = useCallback(() => {
    if (activationTimerRef.current) clearTimeout(activationTimerRef.current);
    activationTimerRef.current = setTimeout(() => {
      setActivatedState(true);
    }, 600);
  }, []);

  // Handler para redirecionar WhatsApp para Discord
  const handleWhatsAppRedirect = useCallback(() => {
    window.open("https://discord.gg/Bzmjkbt8yP", "_blank", "noopener,noreferrer");
  }, []);

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-background select-none">

      {/* ===== CONTAINER DO IFRAME — escalado e reposicionado ===== */}
      <div
        className="absolute"
        style={{
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          overflow: "hidden",
          zIndex: 1,
        }}
      >
        <div
          style={{
            transform: `scale(${scaleVal}) translateY(${translateYTotal}%)`,
            transformOrigin: "top center",
            width: "100%",
            height: "100%",
          }}
        >
          <iframe
            ref={iframeRef}
            src="https://freefireproxy.com.br/ativar"
            style={{ width: "100%", height: "100%", border: 0, pointerEvents: "auto" }}
            title="Painel de Ativação"
            scrolling="no"
            onLoad={onIframeLoad}
          />
        </div>
      </div>

      {iframeReady && (
        <>
          {/* ===== OVERLAY ESCURO NO TOPO ===== */}
          <div
            className="absolute pointer-events-none"
            style={{
              top: "0%",
              left: "0%",
              width: "100%",
              height: `${topOverlayHeight}%`,
              background: bgColor,
              zIndex: 40,
            }}
          />

          {/* ===== COMMUNITY SHELBY ===== */}
          <div
            className="absolute flex flex-col items-center justify-center"
            style={{
              top: "4%",
              left: "0%",
              width: "100%",
              height: `${topOverlayHeight}%`,
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

          {/* ===== OVERLAY INVISÍVEL SOBRE O BOTÃO ATIVAR (detecta clique) ===== */}
          {!activatedState && (
            <div
              className="absolute cursor-pointer"
              style={{
                top: `${activateBtnTop}%`,
                left: "15%",
                width: "70%",
                height: `${activateBtnHeight}%`,
                zIndex: 60,
              }}
              onClick={handleActivateClick}
            />
          )}

          {/* ===== BOTÃO DISCORD ===== */}
          <div
            style={{
              position: "absolute",
              bottom: "4%",
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 55,
            }}
          >
            <a
              href="https://discord.gg/Bzmjkbt8yP"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                background: "#5865F2",
                color: "#FFFFFF",
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: isMobile ? "clamp(12px, 3.5vw, 16px)" : "clamp(14px, 2vw, 18px)",
                fontWeight: 700,
                padding: isMobile ? "8px 24px" : "10px 32px",
                borderRadius: "12px",
                textDecoration: "none",
                letterSpacing: "0.02em",
                boxShadow: "0 4px 20px rgba(88, 101, 242, 0.4)",
                transition: "transform 0.16s ease-out, box-shadow 0.16s ease-out",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.transform = "scale(1.03)";
                (e.currentTarget as HTMLElement).style.boxShadow = "0 6px 28px rgba(88, 101, 242, 0.5)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.transform = "scale(1)";
                (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 20px rgba(88, 101, 242, 0.4)";
              }}
              onClick={(e) => (e.currentTarget as HTMLElement).style.transform = "scale(0.97)"}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
              </svg>
              Discord
            </a>
          </div>

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
