import { useEffect, useRef, useState } from "react";

// Design: Overlay invisível sobre o site freefireproxy.com.br/ativar
// Cobre o botão CANAL + espaço até o footer + footer, sem afetar CERTIFICADO
//
// Coordenadas medidas (viewport 1280x1100):
// CANAL: left=646px (50.47%), top=723px (65.73%), width=185px (14.45%), height=49px (4.45%)
// CERTIFICADO right edge: 634px (49.53%) — gap entre CERT e CANAL: ~12px
// Footer: left=416px (32.5%), top=837px (76.09%), width=448px (35%), height=15px (1.36%)
// Espaço entre CANAL bottom (70.18%) e footer top (76.09%) = ~6% de gap
//
// Estratégia: 3 overlays empilhados verticalmente:
// 1. CANAL overlay (top do CANAL)
// 2. Gap overlay (espaço entre CANAL e footer) — mais largo para cobrir a base do card
// 3. Footer overlay (texto do footer) — mais largo e centrado

export default function Home() {
  const [iframeReady, setIframeReady] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIframeReady(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Forçar scroll do iframe para o topo periodicamente (bloqueia scroll)
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
      {/* Iframe do site original — ocupa toda a tela, scroll desabilitado */}
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
          {/* 1. Overlay CANAL — cobre exatamente o botão CANAL */}
          <div
            className="absolute pointer-events-auto z-50"
            style={{
              top: "65.73%",
              left: "50.47%",
              width: "14.45%",
              height: "4.45%",
              background: "rgb(13, 16, 35)",
              borderRadius: "0 8px 8px 0",
            }}
          />

          {/* 2. Overlay gap — preenche o espaço entre CANAL bottom e footer top */}
          {/* Usa largura do CANAL para manter alinhamento */}
          <div
            className="absolute pointer-events-auto z-50"
            style={{
              top: "calc(65.73% + 4.45%)",
              left: "50.47%",
              width: "14.45%",
              height: "calc(76.09% - 65.73% - 4.45%)",
              background: "rgb(13, 16, 35)",
            }}
          />

          {/* 3. Overlay footer — cobre o texto "Proxy iOS 2026" */}
          <div
            className="absolute pointer-events-auto z-50"
            style={{
              top: "76.09%",
              left: "32.5%",
              width: "35%",
              height: "2.5%",
              background: "rgb(8, 10, 25)",
            }}
          />
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
