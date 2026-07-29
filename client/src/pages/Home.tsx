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

  // Overlay preto começa na metade do botão ATIVAR ACESSO (41% do topo)
  const blackOverlayTop = "41%";
  const blackOverlayHeight = "59%";

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
          {/* ===== OVERLAY PRETO COBRINDO DA METADE DO ATIVAR ACESSO ATÉ O FIM ===== */}
          <div
            className="absolute"
            style={{
              top: blackOverlayTop,
              left: 0,
              width: "100%",
              height: blackOverlayHeight,
              zIndex: 5,
              background: "#000000",
            }}
          />

          {/* ===== CARD GRANDE DO DISCORD ===== */}
          <div
            className="absolute"
            style={{
              top: "52%",
              left: "50%",
              transform: "translateX(-50%)",
              width: isMobile ? "90%" : "80%",
              maxWidth: "600px",
              zIndex: 10,
            }}
          >
            <div
              style={{
                background: "linear-gradient(135deg, #5865F2 0%, #4752C4 100%)",
                borderRadius: "20px",
                padding: isMobile ? "30px 20px" : "50px 40px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "16px",
                boxShadow: "0 20px 60px rgba(88, 101, 242, 0.4)",
                border: "2px solid rgba(255,255,255,0.15)",
              }}
            >
              {/* Ícone Discord */}
              <svg
                width={isMobile ? "50" : "70"}
                height={isMobile ? "50" : "70"}
                viewBox="0 0 71 55"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M60.1045 4.8978C55.5792 2.8214 50.7265 1.2916 45.6527 0.41542C45.5603 0.39851 45.468 0.440769 45.4204 0.525289C44.7963 1.6353 44.105 3.0834 43.6209 4.2216C38.1637 3.4046 32.7345 3.4046 27.3892 4.2216C26.905 3.0581 26.1858 1.6353 25.5617 0.525289C25.5141 0.443589 25.4218 0.40133 25.3294 0.41542C20.2584 1.2888 15.4057 2.8186 10.8776 4.8978C10.8384 4.9147 10.8048 4.9429 10.7825 4.9795C1.57795 18.7309 -0.943561 32.1443 0.293408 45.3914C0.299005 45.4562 0.335386 45.5182 0.385761 45.5576C6.45866 50.0174 12.3413 52.7249 18.1147 54.5195C18.2071 54.5477 18.305 54.5139 18.3638 54.4378C19.7295 52.5728 20.9469 50.6063 21.9907 48.5383C22.0523 48.4172 21.9935 48.2735 21.8676 48.2256C19.9366 47.4931 18.0979 46.6 16.3292 45.5858C16.1893 45.5041 16.1781 45.304 16.3068 45.2082C16.679 44.9293 17.0513 44.6391 17.4067 44.3461C17.471 44.2926 17.5606 44.2813 17.6362 44.3151C29.2558 49.6202 41.8354 49.6202 53.3179 44.3151C53.3935 44.2785 53.4831 44.2898 53.5502 44.3433C53.9057 44.6363 54.2779 44.9293 54.6529 45.2082C54.7816 45.304 54.7732 45.5041 54.6333 45.5858C52.8646 46.6197 51.0259 47.4931 49.0921 48.2228C48.9662 48.2707 48.9102 48.4172 48.9718 48.5383C50.038 50.6034 51.2554 52.5699 52.5958 54.435C52.6518 54.5139 52.7525 54.5477 52.8449 54.5195C58.6463 52.7249 64.529 50.0174 70.6019 45.5576C70.6551 45.5182 70.6887 45.459 70.6943 45.3942C72.1747 30.0791 68.2147 16.7757 60.1968 4.9823C60.1772 4.9429 60.1436 4.9147 60.1045 4.8978ZM23.7259 37.1258C20.2276 37.1258 17.3451 33.9156 17.3451 29.9771C17.3451 26.0386 20.1717 22.8284 23.7259 22.8284C27.308 22.8284 30.1626 26.0668 30.1066 29.9771C30.1066 33.9156 27.28 37.1258 23.7259 37.1258ZM47.3178 37.1258C43.8196 37.1258 40.9371 33.9156 40.9371 29.9771C40.9371 26.0386 43.7636 22.8284 47.3178 22.8284C50.9 22.8284 53.7545 26.0668 53.6986 29.9771C53.6986 33.9156 50.9 37.1258 47.3178 37.1258Z"
                  fill="white"
                />
              </svg>

              {/* Título */}
              <h2
                style={{
                  color: "white",
                  fontSize: isMobile ? "22px" : "32px",
                  fontWeight: "700",
                  fontFamily: "'Space Grotesk', sans-serif",
                  margin: 0,
                  textAlign: "center",
                  letterSpacing: "-0.5px",
                }}
              >
                Entre no nosso Discord
              </h2>

              {/* Descrição */}
              <p
                style={{
                  color: "rgba(255,255,255,0.85)",
                  fontSize: isMobile ? "14px" : "16px",
                  fontFamily: "'Space Grotesk', sans-serif",
                  margin: 0,
                  textAlign: "center",
                  maxWidth: "400px",
                  lineHeight: "1.5",
                }}
              >
                Suporte, ativação de keys e novidades exclusivas para membros
              </p>

              {/* Botão Join */}
              <button
                onClick={handleDiscordRedirect}
                style={{
                  background: "white",
                  color: "#5865F2",
                  border: "none",
                  borderRadius: "12px",
                  padding: isMobile ? "14px 40px" : "16px 50px",
                  fontSize: isMobile ? "16px" : "18px",
                  fontWeight: "700",
                  fontFamily: "'Space Grotesk', sans-serif",
                  cursor: "pointer",
                  marginTop: "8px",
                  transition: "transform 0.15s ease, box-shadow 0.15s ease",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLButtonElement).style.transform = "scale(1.05)";
                  (e.target as HTMLButtonElement).style.boxShadow = "0 8px 30px rgba(0,0,0,0.3)";
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLButtonElement).style.transform = "scale(1)";
                  (e.target as HTMLButtonElement).style.boxShadow = "0 4px 20px rgba(0,0,0,0.2)";
                }}
              >
                ENTRAR NO SERVIDOR
              </button>
            </div>
          </div>

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
