import { useEffect, useRef, useState, useCallback } from "react";
import { MonitorPlay } from "lucide-react";

// Overlay dinâmico sobre freefireproxy.com.br/ativar
//
// Desktop (1280x1100):
//   CANAL: top=65.73%, left=50.47%, width=14.45%, height=4.45%
//   CERTIFICADO: top=65.73%, left=35.08%
//   Footer: top=76.09%, left=32.5%, width=35%
//
// Mobile (375px+): iframe escala, porcentagens mantidas com ajustes

export default function Home() {
  const [iframeReady, setIframeReady] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const onIframeLoad = useCallback(() => {
    setIframeReady(true);
  }, []);

  useEffect(() => {
    // Fallback timer caso o onload não dispare
    const timer = setTimeout(() => setIframeReady(true), 4000);
    return () => clearTimeout(timer);
  }, []);

  // Bloquear scroll do iframe
  useEffect(() => {
    const handler = () => {
      if (iframeRef.current) {
        iframeRef.current.contentWindow?.scrollTo(0, 0);
      }
    };
    const interval = setInterval(handler, 400);
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
          {/* ===== DESKTOP OVERLAYS ===== */}

          {/* Overlay CANAL original (antes de ativar) — desktop */}
          <div
            className="absolute pointer-events-none z-50 hidden sm:block"
            style={{
              top: "65.73%",
              left: "50.47%",
              width: "14.45%",
              height: "4.45%",
              background: "rgba(10, 12, 30, 0.97)",
              borderRadius: "0 12px 12px 0",
            }}
          />

          {/* Overlay gap entre CANAL e footer — desktop */}
          <div
            className="absolute pointer-events-none z-50 hidden sm:block"
            style={{
              top: "70.18%",
              left: "50.47%",
              width: "14.45%",
              height: "5.91%",
              background: "rgba(10, 12, 30, 0.97)",
            }}
          />

          {/* Overlay footer — desktop */}
          <div
            className="absolute pointer-events-none z-50 hidden sm:block"
            style={{
              top: "76.09%",
              left: "32.5%",
              width: "35%",
              height: "2%",
              background: "rgba(8, 10, 22, 0.97)",
            }}
          />

          {/* Overlay CANAL pós-ativação (CANAL sobe) — desktop */}
          <div
            className="absolute pointer-events-none z-50 hidden sm:block"
            style={{
              top: "43%",
              left: "49%",
              width: "16%",
              height: "5.5%",
              background: "rgba(10, 12, 30, 0.97)",
              borderRadius: "0 12px 12px 0",
            }}
          />

          {/* Botão Discord desktop — substitui CANAL na mesma posição */}
          <a
            href="https://discord.gg/Bzmjkbt8yP"
            target="_blank"
            rel="noopener noreferrer"
            className="absolute z-[60] flex items-center justify-center gap-2 pointer-events-auto hidden sm:flex transition-all duration-200 hover:scale-[1.03] active:scale-[0.97]"
            style={{
              top: "65.5%",
              left: "50.47%",
              width: "14.45%",
              background: "linear-gradient(135deg, rgba(88, 101, 242, 0.22) 0%, rgba(88, 101, 242, 0.14) 100%)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              border: "1px solid rgba(88, 101, 242, 0.3)",
              borderRadius: "0 12px 12px 0",
              padding: "12px 14px",
              textDecoration: "none",
              boxShadow: "0 4px 24px rgba(88, 101, 242, 0.2), 0 0 0 1px rgba(255,255,255,0.03) inset",
            }}
          >
            <MonitorPlay className="h-4 w-4 shrink-0" style={{ color: "#7B8CF7" }} />
            <span
              className="text-[12px] font-semibold tracking-wide text-center leading-tight"
              style={{
                color: "#D4D8FF",
                fontFamily: "'Space Grotesk', sans-serif",
                textShadow: "0 1px 4px rgba(0,0,0,0.3)",
              }}
            >
              Entre no Discord
            </span>
          </a>

          {/* ===== MOBILE OVERLAYS ===== */}

          {/* Overlay CANAL — mobile */}
          <div
            className="absolute pointer-events-none z-50 block sm:hidden"
            style={{
              top: "62%",
              left: "51%",
              width: "42%",
              height: "6%",
              background: "rgba(10, 12, 30, 0.97)",
              borderRadius: "0 10px 10px 0",
            }}
          />

          {/* Overlay gap — mobile */}
          <div
            className="absolute pointer-events-none z-50 block sm:hidden"
            style={{
              top: "68%",
              left: "51%",
              width: "42%",
              height: "5%",
              background: "rgba(10, 12, 30, 0.97)",
            }}
          />

          {/* Overlay footer — mobile */}
          <div
            className="absolute pointer-events-none z-50 block sm:hidden"
            style={{
              top: "73%",
              left: "22%",
              width: "56%",
              height: "3%",
              background: "rgba(8, 10, 22, 0.97)",
            }}
          />

          {/* Overlay CANAL pós-ativação — mobile */}
          <div
            className="absolute pointer-events-none z-50 block sm:hidden"
            style={{
              top: "42%",
              left: "50%",
              width: "44%",
              height: "7%",
              background: "rgba(10, 12, 30, 0.97)",
              borderRadius: "0 10px 10px 0",
            }}
          />

          {/* Botão Discord mobile */}
          <a
            href="https://discord.gg/Bzmjkbt8yP"
            target="_blank"
            rel="noopener noreferrer"
            className="absolute z-[60] flex items-center justify-center gap-1.5 pointer-events-auto block sm:hidden transition-all duration-200 hover:scale-[1.03] active:scale-[0.97]"
            style={{
              top: "61.5%",
              left: "51%",
              width: "42%",
              background: "linear-gradient(135deg, rgba(88, 101, 242, 0.22) 0%, rgba(88, 101, 242, 0.14) 100%)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              border: "1px solid rgba(88, 101, 242, 0.3)",
              borderRadius: "0 10px 10px 0",
              padding: "10px 12px",
              textDecoration: "none",
              boxShadow: "0 4px 24px rgba(88, 101, 242, 0.2), 0 0 0 1px rgba(255,255,255,0.03) inset",
            }}
          >
            <MonitorPlay className="h-3.5 w-3.5 shrink-0" style={{ color: "#7B8CF7" }} />
            <span
              className="text-[11px] font-semibold tracking-wide text-center leading-tight"
              style={{
                color: "#D4D8FF",
                fontFamily: "'Space Grotesk', sans-serif",
                textShadow: "0 1px 4px rgba(0,0,0,0.3)",
              }}
            >
              Entre no Discord
            </span>
          </a>
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
