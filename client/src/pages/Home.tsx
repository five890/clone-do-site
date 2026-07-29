import { useEffect, useRef, useState, useCallback } from "react";

export default function Home() {
  const [iframeReady, setIframeReady] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [keyboardShift, setKeyboardShift] = useState(0);
  const initialHeightRef = useRef(window.innerHeight);
  const [activatedState, setActivatedState] = useState(false);
  const activationTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const onIframeLoad = useCallback(() => {
    setIframeReady(true);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setIframeReady(true), 5000);
    return () => clearTimeout(timer);
  }, []);

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

  useEffect(() => {
    const handler = () => window.scrollTo(0, 0);
    const interval = setInterval(handler, 300);
    window.addEventListener("scroll", handler);
    return () => {
      clearInterval(interval);
      window.removeEventListener("scroll", handler);
    };
  }, []);

  const keyboardEffect = keyboardShift > 0 ? keyboardShift : 0;
  const activationEffect = activatedState ? 32 : 0;
  const scaleVal = isMobile ? 1.09 : 1.08;
  const translateYBase = isMobile ? -18 : -20;
  const translateYTotal = translateYBase + keyboardEffect * 0.5 - activationEffect * 0.3;

  const handleActivateClick = useCallback(() => {
    if (activationTimerRef.current) clearTimeout(activationTimerRef.current);
    activationTimerRef.current = setTimeout(() => {
      setActivatedState(true);
    }, 600);
  }, []);

  const handleDiscordRedirect = useCallback(() => {
    window.location.href = "https://discord.gg/Bzmjkbt8yP";
  }, []);

  // Posição do overlay CANAL
  const canalTop = isMobile ? 67 - keyboardEffect * 0.3 - activationEffect * 0.3 : 65 - keyboardEffect * 0.3 - activationEffect * 0.3;
  const canalLeft = isMobile ? 55 : 52;
  const canalWidth = isMobile ? 35 : 25;
  const canalHeight = isMobile ? 6 : 5.5;

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
          {/* ===== OVERLAY PRETO COBRINDO A ÁREA ABAIXO DO ATIVAR ACESSO ===== */}
          <div
            className="absolute"
            style={{
              top: "46%",
              left: 0,
              width: "100%",
              height: "54%",
              zIndex: 5,
              background: "#000000",
            }}
          />

          {/* ===== OVERLAY INVISÍVEL SOBRE O CANAL — position: fixed, z-index máximo ===== */}
          <div
            style={{
              position: "fixed",
              top: `${canalTop}%`,
              left: `${canalLeft}%`,
              width: `${canalWidth}%`,
              height: `${canalHeight}%`,
              zIndex: 2147483647,
              cursor: "pointer",
              background: "rgba(0,0,0,0)",
            }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleDiscordRedirect();
            }}
            onTouchStart={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleDiscordRedirect();
              return false;
            }}
            onPointerDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
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
