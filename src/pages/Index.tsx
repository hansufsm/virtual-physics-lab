import { Link } from "react-router-dom";
import { ArrowRight, Atom, Zap, Magnet, Activity, Sparkles, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const experiments = [
  {
    id: "capacitor",
    available: true,
    icon: Zap,
    area: "Eletrostática",
    title: "Capacitor de placas paralelas",
    description: "Estude C = εᵣε₀A/d, energia armazenada e o efeito de dielétricos.",
    href: "/experimentos/capacitor",
  },
  {
    id: "ohm",
    available: true,
    icon: Activity,
    area: "Circuitos",
    title: "Lei de Ohm e resistividade",
    description: "Verifique a relação V = R·I e meça a resistividade de materiais.",
    href: "/experimentos/ohm",
  },
  {
    id: "rc",
    available: true,
    icon: Activity,
    area: "Circuitos",
    title: "Circuito RC — carga e descarga",
    description: "Constante de tempo τ = RC e análise transitória.",
    href: "/experimentos/rc",
  },
  {
    id: "bobina",
    available: true,
    icon: Magnet,
    area: "Magnetismo",
    title: "Campo magnético de bobinas",
    description: "Lei de Biot–Savart aplicada a solenoides e bobinas de Helmholtz.",
    href: "/experimentos/bobina",
  },
  {
    id: "inducao",
    available: true,
    icon: Magnet,
    area: "Indução",
    title: "Indução eletromagnética",
    description: "Lei de Faraday: f.e.m. induzida em espiras móveis.",
    href: "/experimentos/inducao",
  },
  {
    id: "trafo",
    available: true,
    icon: Atom,
    area: "Indução",
    title: "Transformadores",
    description: "Razão de transformação e acoplamento magnético.",
    href: "/experimentos/transformador",
  },
  {
    id: "rlc",
    available: true,
    icon: Activity,
    area: "Circuitos AC",
    title: "Circuito RLC — ressonância",
    description: "Reatâncias, defasagem, curva de ressonância e fator de qualidade Q.",
    href: "/experimentos/rlc",
  },
  {
    id: "motor",
    available: true,
    icon: Magnet,
    area: "Magnetismo",
    title: "Motor DC — força de Laplace",
    description: "Torque em espira percorrida por corrente, curva T(ω), f.c.e.m. e eficiência.",
    href: "/experimentos/motor",
  },
  {
    id: "carga-em-campos",
    available: true,
    icon: Sparkles,
    area: "Eletromagnetismo",
    title: "Carga em campos E e B",
    description: "Força de Lorentz: trajetórias em E, órbitas em B, seletor de velocidades e ciclotron.",
    href: "/experimentos/carga-em-campos",
  },
  {
    id: "hall",
    available: true,
    icon: Magnet,
    area: "Magnetotransporte",
    title: "Efeito Hall",
    description: "Tensão Hall em barra condutora: identifique portadores e meça densidade n e mobilidade μ.",
    href: "/experimentos/hall",
  },
  {
    id: "ampere",
    available: true,
    icon: Magnet,
    area: "Magnetostática",
    title: "Lei de Ampère — fios e toroide",
    description: "Campo de fio retilíneo, força entre dois fios paralelos e B confinado em um toroide.",
    href: "/experimentos/ampere",
  },
  {
    id: "gauss",
    available: true,
    icon: Sparkles,
    area: "Eletrostática",
    title: "Lei de Gauss — fluxo elétrico",
    description: "Carga pontual, esfera, fio e plano: aplique gaussianas e verifique Φ = Q_enc/ε₀.",
    href: "/experimentos/gauss",
  },
  {
    id: "dipolo",
    available: true,
    icon: Sparkles,
    area: "Eletrostática",
    title: "Dipolo elétrico e torque",
    description: "Torque τ = p × E, energia U = −p·E, oscilação em campo externo e campo do dipolo (1/r³).",
    href: "/experimentos/dipolo",
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/60 backdrop-blur sticky top-0 z-10">
        <div className="container py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-gradient-primary grid place-items-center shadow-glow">
              <Atom className="h-4 w-4 text-primary-foreground" />
            </div>
            <div className="leading-tight">
              <div className="font-display font-semibold text-sm">LabVirtual EM</div>
              <div className="text-[10px] text-muted-foreground">Eletricidade & Magnetismo</div>
            </div>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#experimentos" className="hover:text-foreground transition-smooth">Experimentos</a>
            <a href="#sobre" className="hover:text-foreground transition-smooth">Sobre</a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero pointer-events-none" />
        <div className="container relative py-20 md:py-28 max-w-4xl">
          <Badge variant="secondary" className="mb-6 animate-fade-in">
            <Sparkles className="h-3 w-3 mr-1.5" /> Plataforma para graduação em Física e Engenharias
          </Badge>
          <h1 className="font-display text-4xl md:text-6xl font-bold tracking-tight text-balance animate-fade-in">
            Laboratório virtual de
            <span className="block bg-gradient-primary bg-clip-text text-transparent">Eletricidade e Magnetismo</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl text-balance animate-fade-in">
            Replique experimentos de bancada no navegador, faça varreduras de parâmetros e gere relatórios — com um
            assistente de IA que entende o contexto do seu experimento.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 animate-fade-in">
            <Button asChild size="lg" className="bg-gradient-primary shadow-elegant hover:shadow-glow transition-smooth">
              <Link to="/experimentos/capacitor">
                Iniciar experimento <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <a href="#experimentos">Ver catálogo</a>
            </Button>
          </div>

          <dl className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-6 animate-fade-in">
            {[
              { k: "12", v: "Experimentos ativos" },

              { k: "Open", v: "Próximos por vir" },
              { k: "Tempo real", v: "Cálculos físicos" },
              { k: "IA", v: "Assistente contextual" },
            ].map((s) => (
              <div key={s.v}>
                <dt className="font-display text-2xl font-bold text-primary">{s.k}</dt>
                <dd className="text-xs text-muted-foreground mt-0.5">{s.v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Catálogo */}
      <section id="experimentos" className="container py-20">
        <div className="max-w-2xl mb-10">
          <h2 className="font-display text-3xl font-bold tracking-tight">Catálogo de experimentos</h2>
          <p className="mt-2 text-muted-foreground">
            Cada experimento traz simulação interativa, varredura de parâmetros, teoria de apoio e um assistente de IA contextual.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {experiments.map((e) => {
            const Icon = e.icon;
            const card = (
              <div className={`group relative h-full rounded-xl border border-border bg-card p-6 shadow-card transition-smooth ${
                e.available ? "hover:border-primary/50 hover:shadow-elegant hover:-translate-y-0.5" : "opacity-70"
              }`}>
                <div className="flex items-start justify-between mb-4">
                  <div className={`h-10 w-10 rounded-lg grid place-items-center ${
                    e.available ? "bg-gradient-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  {!e.available && (
                    <Badge variant="outline" className="text-[10px]"><Lock className="h-3 w-3 mr-1" />Em breve</Badge>
                  )}
                </div>
                <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground mb-1">{e.area}</div>
                <h3 className="font-display font-semibold text-lg leading-tight">{e.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{e.description}</p>
                {e.available && (
                  <div className="mt-4 inline-flex items-center text-sm font-medium text-primary">
                    Abrir <ArrowRight className="ml-1 h-3.5 w-3.5 transition-smooth group-hover:translate-x-0.5" />
                  </div>
                )}
              </div>
            );
            return e.available && e.href ? (
              <Link key={e.id} to={e.href}>{card}</Link>
            ) : (
              <div key={e.id}>{card}</div>
            );
          })}
        </div>
      </section>

      {/* Sobre */}
      <section id="sobre" className="border-t border-border bg-gradient-subtle">
        <div className="container py-16 grid md:grid-cols-3 gap-10">
          <div className="md:col-span-1">
            <h2 className="font-display text-2xl font-bold">Pensado para sala de aula</h2>
            <p className="mt-2 text-sm text-muted-foreground">Arquitetura escalável, código aberto e foco em aprendizagem ativa.</p>
          </div>
          <div className="md:col-span-2 grid sm:grid-cols-2 gap-6 text-sm">
            {[
              { t: "Visualizações em tempo real", d: "Cálculos numéricos no navegador, sem latência de servidor." },
              { t: "Varreduras de parâmetros", d: "Gráficos C×d, Q×V e exportação CSV para relatórios." },
              { t: "Assistente IA contextual", d: "Tira dúvidas conhecendo a configuração atual do experimento." },
              { t: "Roteiros estruturados", d: "Objetivos, equações e passos sugeridos em cada experimento." },
            ].map((f) => (
              <div key={f.t}>
                <div className="font-display font-semibold">{f.t}</div>
                <p className="mt-1 text-muted-foreground">{f.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-border">
        <div className="container py-6 text-xs text-muted-foreground flex flex-wrap justify-between gap-2">
          <span>© LabVirtual EM · Eletromagnetismo I & II</span>
          <span className="font-mono">v0.1 — protótipo</span>
        </div>
      </footer>
    </div>
  );
};

export default Index;
