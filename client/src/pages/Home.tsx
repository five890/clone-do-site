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

  // Efeito do teclado nos overlays e iframe
  const keyboardEffect = keyboardShift > 0 ? keyboardShift : 0;

  // Quando ativado (WhatsApp sobe), sobe os overlays junto
  const activationEffect = activatedState ? 32 : 0;

  // Scale e translateY do iframe
  const scaleVal = isMobile ? 1.09 : 1.08;
  const translateYBase = isMobile ? -18 : -20;
  const translateYTotal = translateYBase + keyboardEffect * 0.5 - activationEffect * 0.3;

  // Handler para o overlay invisível sobre o botão CANAL
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

  // Posição do overlay CANAL — posicionado sobre o botão CANAL
  // O botão CANAL fica na parte inferior do card, ao lado do CERTIFICADO
  const canalTop = isMobile ? 67 - keyboardEffect * 0.3 - activationEffect * 0.3 : 65 - keyboardEffect * 0.3 - activationEffect * 0.3;
  const canalLeft = isMobile ? 55 : 52;
  const canalWidth = isMobile ? 40 : 42;
  const canalHeight = isMobile ? 5 : 4.5;

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
            style={{ width: "100%", height: "100%", border: 0 }}
            title="Painel de Ativação"
            scrolling="no"
            onLoad={onIframeLoad}
          />
        </div>
      </div>

      {iframeReady && (
        <>
          {/* ===== OVERLAY INVISÍVEL SOBRE O CANAL (WHATSAPP) — redireciona para Discord ===== */}
          <div
            className="absolute"
            style={{
              top: `${canalTop}%`,
              left: `${canalLeft}%`,
              width: `${canalWidth}%`,
              height: `${canalHeight}%`,
              zIndex: 9999,
              cursor: "pointer",
            }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleWhatsAppRedirect();
            }}
          />

          {/* ===== OVERLAY INVISÍVEL SOBRE O BOTÃO ATIVAR ACESSO ===== */}
          <div
            className="absolute"
            style={{
              top: "38%",
              left: "18%",
              width: "64%",
              height: "6%",
              zIndex: 9998,
              cursor: "pointer",
            }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleActivateClick();
            }}
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
