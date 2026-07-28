import { useEffect, useState } from "react";

// Design: Overlay invisível sobre o site freefireproxy.com.br/ativar
// O iframe carrega o site original e um overlay cobre apenas a área do botão CANAL (WhatsApp)
//
// Coordenadas medidas diretamente na página freefireproxy.com.br/ativar:
// Viewport: 1280x1100
// Botão CANAL: left=646px (50.47%), top=723px (65.73%), width=185px, height=49px
// Botão CERTIFICADO: left=449px (35.08%), top=723px (65.73%), width=185px, height=49px

export default function Home() {
  const [iframeReady, setIframeReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIframeReady(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-background">
      {/* Iframe do site original — ocupa toda a tela */}
      <iframe
        src="https://freefireproxy.com.br/ativar"
        className="h-full w-full border-0"
        title="Painel de Ativação"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
      />

      {/* Overlay que cobre o botão CANAL (WhatsApp) */}
      {iframeReady && (
        <div
          className="absolute pointer-events-auto z-50"
          style={{
            // Coordenadas medidas: left=50.47%, top=65.73% do viewport 1280x1100
            // Usando left exato do botão CANAL (646px / 1280px = 50.47%)
            // e width exato (185px / 1280px = 14.45%)
            top: "65.73%",
            left: "50.47%",
            width: "14.45%",
            maxWidth: "200px",
            minWidth: "160px",
            height: "4.45%",
            maxHeight: "54px",
            minHeight: "44px",
            // Cor do fundo do card do site original (dark navy)
            background: "rgb(13, 16, 35)",
            borderRadius: "0 8px 8px 0",
          }}
        />
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
