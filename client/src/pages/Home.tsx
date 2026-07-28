import { useEffect, useRef, useState } from "react";
import { MonitorPlay } from "lucide-react";

// Design: Overlay dinâmico sobre freefireproxy.com.br/ativar
//
// Situação ANTES de ativar (viewport 1280x1100, scrollH=1100):
//   CANAL: top=723px (65.73%), left=646px (50.47%), width=185px (14.45%), height=49px (4.45%)
//   CERTIFICADO: top=723px, left=449px (35.08%), width=185px
//   Footer: top=837px (76.09%), left=416px (32.5%), width=448px (35%)
//
// Situação DEPOIS de ativar (scrollH=1272):
//   CANAL: top=491px (44.64%), left=638.5px (49.88%)
//   CERTIFICADO: top=491px, left=441.5px (34.49%)
//
// Estratégia:
// Discord substitui o CANAL visualmente na MESMA posição (65.73%, 50.47%)
// Overlay cobre o footer abaixo
// Overlay secundário cobre CANAL pós-ativação (44.64%)
// Scroll bloqueado

export default function Home() {
  const [iframeReady, setIframeReady] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIframeReady(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Bloquear scroll do iframe
  useEffect(() => {
    const handler = () => {
      if (iframeRef.current) {
        iframeRef.current.scrollTop = 0;
      }
    };
    const interval = setInterval(handler, 300);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-background">
      {/* Iframe do site original */}
      <iframe
        ref={iframeRef}
        src="https://freefireproxy.com.br/ativar"
        className="h-full w-full border-0"
        title="Painel de Ativação"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
        scrolling="no"
      />

      {iframeReady && (
        <>
          {/* Overlay CANAL original (antes de ativar) — cobre CANAL mas Discord fica por cima */}
          <div
            className="absolute pointer-events-none z-50"
            style={{
              top: "65.73%",
              left: "50.47%",
              width: "14.45%",
              height: "4.45%",
              background: "rgba(10, 12, 30, 0.97)",
              borderRadius: "0 12px 12px 0",
            }}
          />

          {/* Overlay gap entre CANAL e footer */}
          <div
            className="absolute pointer-events-none z-50"
            style={{
              top: "calc(65.73% + 4.45%)",
              left: "50.47%",
              width: "14.45%",
              height: "calc(76.09% - 65.73% - 4.45%)",
              background: "rgba(10, 12, 30, 0.97)",
            }}
          />

          {/* Overlay footer */}
          <div
            className="absolute pointer-events-none z-50"
            style={{
              top: "76.09%",
              left: "32.5%",
              width: "35%",
              height: "2.5%",
              background: "rgba(8, 10, 22, 0.97)",
            }}
          />

          {/* Overlay CANAL pós-ativação (CANAL sobe para 44.64%) */}
          <div
            className="absolute pointer-events-none z-50"
            style={{
              top: "43.5%",
              left: "49.5%",
              width: "16%",
              height: "5.5%",
              background: "rgba(10, 12, 30, 0.97)",
              borderRadius: "0 12px 12px 0",
            }}
          />

          {/* Botão Discord — substitui o CANAL visualmente na mesma posição */}
          <a
            href="https://discord.gg/Bzmjkbt8yP"
            target="_blank"
            rel="noopener noreferrer"
            className="absolute z-[60] flex items-center justify-center gap-2 pointer-events-auto transition-all duration-200 hover:scale-[1.03] active:scale-[0.97]"
            style={{
              // Mesma posição do CANAL original
              top: "65.5%",
              left: "50.47%",
              width: "14.45%",
              background: "linear-gradient(135deg, rgba(88, 101, 242, 0.22) 0%, rgba(88, 101, 242, 0.14) 100%)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              border: "1px solid rgba(88, 101, 242, 0.3)",
              borderRadius: "0 12px 12px 0",
              padding: "12px 16px",
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
        </>
      )}

      {/* Loading state */}
      {!iframeReady && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-background">
          <div className="flex flex-col items-center gap-3">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
            <p className="text-sm text-muted-foreground">Carregando painel...</p>
          </div>
        </div>
      )}
    </div>
  );
}
