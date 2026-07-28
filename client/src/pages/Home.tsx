import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  ShieldCheck,
  KeyRound,
  Download,
  Server,
  Activity,
  Copy,
  Check,
  Lock,
  Wifi,
  Cpu,
} from "lucide-react";

// Design: Console Orbital — Futurismo editorial de interface
// Fundo preto-navy profundo, assinatura violeta #7568FF, tipografia Space Grotesk + IBM Plex Mono
// Atmosfera: halos violeta-azulados assimétricos visíveis, textura técnica, nunca preto plano

const SERVERS = [
  { mod: "HS PESCOÇO SAFE", servidor: "2.24.121.175", porta: "9999" },
  { mod: "HS ALTO SAFE", servidor: "2.24.121.175", porta: "9998" },
  { mod: "HS PEITO SAFE", servidor: "2.24.121.175", porta: "9997" },
];

export default function Home() {
  const [ip, setIp] = useState("Carregando...");
  const [keyValue, setKeyValue] = useState("");
  const [activating, setActivating] = useState(false);
  const [activated, setActivated] = useState(false);
  const [copied, setCopied] = useState(false);

  // Fetch user's public IP
  useEffect(() => {
    fetch("https://api.ipify.org?format=json")
      .then((res) => res.json())
      .then((data) => setIp(data.ip))
      .catch(() => setIp("Indisponível"));
  }, []);

  const handleActivate = useCallback(() => {
    if (!keyValue.trim()) {
      toast.error("Insira sua chave para ativar o acesso.");
      return;
    }
    setActivating(true);
    setActivated(false);
    setTimeout(() => {
      setActivating(false);
      setActivated(true);
      toast.success("Acesso ativado com sucesso.");
    }, 1600);
  }, [keyValue]);

  const handleCopyIp = useCallback(() => {
    if (ip === "Carregando..." || ip === "Indisponível") return;
    navigator.clipboard.writeText(ip).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [ip]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      {/* Atmospheric background image */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <img
          src="/manus-storage/hero-bg_0bd31fda.png"
          alt=""
          className="h-full w-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/70 to-background" />
      </div>

      {/* Orbital halos — asymmetric violet-blue system */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div
          className="halo-drift absolute -top-24 -left-20 h-80 w-80 rounded-full opacity-40 blur-[100px]"
          style={{ background: "#7568FF" }}
        />
        <div
          className="halo-drift absolute top-1/3 -right-24 h-72 w-72 rounded-full opacity-25 blur-[120px]"
          style={{ background: "#2A1F8F", animationDelay: "2s" }}
        />
        <div
          className="halo-drift absolute -bottom-32 left-1/4 h-96 w-96 rounded-full opacity-20 blur-[140px]"
          style={{ background: "#4A3FBF", animationDelay: "4s" }}
        />
        {/* Subtle grid texture */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(117,104,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(117,104,255,1) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex min-h-screen flex-col items-center px-4 py-8 sm:py-12">
        {/* Brand lockup — custom product mark */}
        <header className="mb-8 flex flex-col items-center gap-4 sm:mb-12">
          <div className="flex items-center gap-3">
            <img
              src="/manus-storage/logo-shield_a87b6bcf.png"
              alt="Símbolo do painel"
              className="h-11 w-11 object-contain sm:h-14 sm:w-14"
            />
            <div className="flex flex-col">
              <h1 className="font-display text-2xl font-bold leading-none tracking-tight text-foreground sm:text-3xl">
                PAINEL DE IP
              </h1>
              <span className="mt-1 font-mono-tech text-[10px] uppercase tracking-[0.3em] text-primary/70 sm:text-xs">
                v2.0 · CONEXÃO
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-px w-8 bg-primary/30" />
            <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
              Ativação de Acesso
            </p>
            <span className="h-px w-8 bg-primary/30" />
          </div>
        </header>

        {/* Main activation card */}
        <Card className="w-full max-w-md border-border/50 bg-card/80 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
          {/* IP Section */}
          <div className="mb-6">
            <div className="mb-2 flex items-center justify-between">
              <span className="font-mono-tech text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                Seu IP Atual
              </span>
              <div className="flex items-center gap-1.5">
                <span className="status-pulse h-2 w-2 rounded-full bg-emerald-400" />
                <span className="font-mono-tech text-[10px] uppercase tracking-wider text-emerald-400">
                  Online
                </span>
              </div>
            </div>
            <div
              className="group flex cursor-pointer items-center justify-between rounded-lg border border-border bg-secondary/50 px-4 py-3 transition-colors hover:border-primary/40"
              onClick={handleCopyIp}
            >
              <span className="font-mono-tech text-base font-medium text-foreground sm:text-lg">
                {ip}
              </span>
              <button className="text-muted-foreground transition-colors group-hover:text-primary">
                {copied ? (
                  <Check className="h-4 w-4 text-emerald-400" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <Separator className="mb-6 bg-border/50" />

          {/* Key input + Activate */}
          <div className="mb-6">
            <label className="mb-2 flex items-center gap-2 font-mono-tech text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              <KeyRound className="h-3.5 w-3.5" />
              Chave de Acesso
            </label>
            <Input
              type="text"
              placeholder="INSIRA SUA CHAVE"
              value={keyValue}
              onChange={(e) => {
                setKeyValue(e.target.value);
                setActivated(false);
              }}
              className="font-mono-tech h-12 border-border bg-secondary/50 text-sm uppercase tracking-wider text-foreground placeholder:text-muted-foreground/60 focus:border-primary/60"
            />
          </div>

          <Button
            onClick={handleActivate}
            disabled={activating}
            className="h-12 w-full bg-primary text-base font-semibold text-primary-foreground transition-all hover:bg-primary/90 active:scale-[0.98]"
          >
            {activating ? (
              <>
                <Activity className="mr-2 h-4 w-4 animate-spin" />
                Ativando...
              </>
            ) : activated ? (
              <>
                <ShieldCheck className="mr-2 h-5 w-5" />
                Acesso Ativado
              </>
            ) : (
              <>
                <Lock className="mr-2 h-4 w-4" />
                ATIVAR ACESSO
              </>
            )}
          </Button>

          {/* Certificate link — WhatsApp area removed per user request */}
          <div className="mt-6 flex items-center justify-center">
            <a
              href="/cert.pem"
              download
              className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              <Download className="h-4 w-4" />
              Baixar Certificado
            </a>
          </div>
        </Card>

        {/* Servers section — integrated telemetry band */}
        <section className="mt-10 w-full max-w-2xl sm:mt-14">
          <div className="mb-4 flex items-center gap-3">
            <Cpu className="h-4 w-4 text-primary" />
            <h2 className="font-mono-tech text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
              Servidores Disponíveis
            </h2>
            <span className="h-px flex-1 bg-border/40" />
            <span className="font-mono-tech text-[10px] text-muted-foreground/60">
              {SERVERS.length} nós ativos
            </span>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {SERVERS.map((srv, i) => (
              <Card
                key={i}
                className="group border-border/40 bg-card/60 p-4 backdrop-blur-md transition-all hover:border-primary/30 hover:bg-card/80"
              >
                <div className="mb-3 flex items-center justify-between">
                  <Badge className="bg-primary/15 text-primary hover:bg-primary/20">
                    {srv.mod}
                  </Badge>
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400/70" />
                </div>
                <div className="space-y-2 border-t border-border/30 pt-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono-tech text-[9px] uppercase tracking-wider text-muted-foreground">
                      Servidor
                    </span>
                    <span className="font-mono-tech text-xs font-medium text-foreground">
                      {srv.servidor}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono-tech text-[9px] uppercase tracking-wider text-muted-foreground">
                      Porta
                    </span>
                    <span className="font-mono-tech text-xs font-medium text-foreground">
                      {srv.porta}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-auto pt-12">
          <div className="flex items-center gap-2 text-xs text-muted-foreground/60">
            <Wifi className="h-3 w-3" />
            <span>Painel de IP © 2026 — Todos os direitos reservados</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
