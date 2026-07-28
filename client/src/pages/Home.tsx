import { useEffect, useRef, useState, useCallback } from "react";

// Overlay sobre freefireproxy.com.br/ativar
// - Community Shelby no lugar do PROXY IOS
// - CANAL e Footer cobertos
// - Resto do site visível (IP, Key, Ativar, Certificado, Servidores)

export default function Home() {
  const [iframeReady, setIframeReady] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const onIframeLoad = useCallback(() => {
    setIframeReady(true);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setIframeReady(true), 4000);
    return () => clearTimeout(timer);
  }, []);

  // Bloquear scroll
  useEffect(() => {
    const handler = () => {
      window.scrollTo(0, 0);
    };
    const interval = setInterval(handler, 300);
    window.addEventListener("scroll", handler);
    return () => {
      clearInterval(interval);
      window.removeEventListener("scroll", handler);
    };
  }, []);

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
          {/* ===== COMMUNITY SHELBY — substituindo PROXY IOS ===== */}
          {/* Fundo escuro cobrindo toda a área do logo/título PROXY IOS */}
          <div
            className="absolute pointer-events-none z-40"
            style={{
              top: "0%",
              left: "22%",
              width: "56%",
              height: "42%",
              background: "rgba(8, 10, 22, 0.98)",
            }}
          />

          {/* Texto Community Shelby */}
          <div
            className="absolute z-50 flex flex-col items-center justify-center pointer-events-none"
            style={{
              top: "3%",
              left: "28%",
              width: "44%",
              height: "18%",
            }}
          >
            <h1
              className="text-center font-bold tracking-wider leading-none"
              style={{
                color: "#D4D8FF",
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "clamp(20px, 3.5vw, 38px)",
                textShadow: "0 0 24px rgba(120, 130, 255, 0.5), 0 2px 8px rgba(0,0,0,0.6)",
              }}
            >
              Community Shelby
            </h1>
            <p
              className="text-center mt-2 tracking-[0.3em] uppercase"
              style={{
                color: "rgba(180, 185, 220, 0.6)",
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: "clamp(9px, 1.1vw, 13px)",
              }}
            >
              Painel de Ativação
            </p>
          </div>

          {/* ===== OVERLAYS PROTEÇÃO ===== */}

          {/* CANAL coberto */}
          <div
            className="absolute pointer-events-none z-50"
            style={{
              top: "65.5%",
              left: "50.47%",
              width: "14.45%",
              height: "6%",
              background: "rgba(10, 12, 30, 0.97)",
              borderRadius: "0 12px 12px 0",
            }}
          />

          {/* Gap entre botões e footer */}
          <div
            className="absolute pointer-events-none z-50"
            style={{
              top: "71.5%",
              left: "35%",
              width: "30%",
              height: "5%",
              background: "rgba(10, 12, 30, 0.97)",
            }}
          />

          {/* Footer */}
          <div
            className="absolute pointer-events-none z-50"
            style={{
              top: "76%",
              left: "25%",
              width: "50%",
              height: "3%",
              background: "rgba(8, 10, 22, 0.98)",
            }}
          />
        </>
      )}

      {/* Loading state */}
      {!iframeReady && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-background">
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
