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

          {/* ===== OVERLAY INVISÍVEL SOBRE O WHATSAPP APÓS ATIVAÇÃO — redireciona para Discord ===== */}
          {/* O WhatsApp aparece logo abaixo do ATIVAR, dentro do card */}
          {activatedState && (
            <div
              className="absolute"
              style={{
                top: `${isMobile ? 46 : 44}%`,
                left: "18%",
                width: "35%",
                height: `${isMobile ? 6 : 5}%`,
                zIndex: 100,
                cursor: "pointer",
                pointerEvents: "auto",
              }}
              onClick={handleWhatsAppRedirect}
            />
          )}

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
